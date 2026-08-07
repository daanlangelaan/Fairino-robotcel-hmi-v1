import { request } from "node:http";

const maxResponseBytes = 1024 * 1024;

export class FairinoRpcError extends Error {
  constructor(message, statusCode = 502) {
    super(message);
    this.name = "FairinoRpcError";
    this.statusCode = statusCode;
  }
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function decodeXml(value) {
  return String(value)
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", '"')
    .replaceAll("&apos;", "'")
    .replaceAll("&amp;", "&");
}

function encodeParameter(value) {
  if (!Number.isInteger(value)) {
    throw new FairinoRpcError(`Unsupported Fairino RPC parameter: ${JSON.stringify(value)}`, 500);
  }
  return `<param><value><i4>${value}</i4></value></param>`;
}

function methodCall(methodName, parameters = []) {
  const params = parameters.map(encodeParameter).join("");
  return `<?xml version="1.0"?><methodCall><methodName>${escapeXml(methodName)}</methodName><params>${params}</params></methodCall>`;
}

export function parseXmlRpcResponse(xml) {
  const fault = xml.match(/<fault>[\s\S]*?<name>\s*faultString\s*<\/name>[\s\S]*?<string>([\s\S]*?)<\/string>[\s\S]*?<\/fault>/i);
  if (fault) {
    throw new FairinoRpcError(`Fairino RPC fault: ${decodeXml(fault[1]).trim()}`);
  }

  const integers = [...xml.matchAll(/<(?:i4|int)>\s*(-?\d+)\s*<\/(?:i4|int)>/gi)]
    .map((match) => Number(match[1]));
  if (integers.length === 0) {
    throw new FairinoRpcError("Fairino RPC response did not contain an integer result");
  }
  return integers.length === 1 ? integers[0] : integers;
}

export class FairinoRpcClient {
  constructor({
    host,
    port = 20003,
    timeout = 3000,
    verifyDelayMs = 1000,
    programStartDelayMs = 1000,
  }) {
    this.host = host;
    this.port = port;
    this.timeout = timeout;
    this.verifyDelayMs = verifyDelayMs;
    this.programStartDelayMs = programStartDelayMs;
  }

  call(methodName, parameters = []) {
    const body = methodCall(methodName, parameters);
    return new Promise((resolve, reject) => {
      const req = request({
        host: this.host,
        port: this.port,
        path: "/RPC2",
        method: "POST",
        headers: {
          "Content-Type": "text/xml",
          "Content-Length": Buffer.byteLength(body),
          Connection: "close",
        },
      }, (res) => {
        const chunks = [];
        let responseBytes = 0;
        res.on("data", (chunk) => {
          responseBytes += chunk.length;
          if (responseBytes > maxResponseBytes) {
            res.destroy(new FairinoRpcError("Fairino RPC response was too large"));
            return;
          }
          chunks.push(chunk);
        });
        res.on("end", () => {
          const responseBody = Buffer.concat(chunks).toString("utf8");
          if (res.statusCode !== 200) {
            reject(new FairinoRpcError(`Fairino RPC rejected ${methodName}: HTTP ${res.statusCode}`));
            return;
          }
          try {
            resolve(parseXmlRpcResponse(responseBody));
          } catch (error) {
            reject(error);
          }
        });
        res.on("error", reject);
      });

      req.setTimeout(this.timeout, () => {
        req.destroy(new FairinoRpcError(`Fairino RPC ${methodName} timed out`));
      });
      req.on("error", (error) => {
        reject(error instanceof FairinoRpcError
          ? error
          : new FairinoRpcError(`Fairino RPC ${methodName} failed: ${error.message}`));
      });
      req.end(body);
    });
  }

  async getRobotErrorCode() {
    const result = await this.call("GetRobotErrorCode");
    if (!Array.isArray(result) || result.length < 3 || result[0] !== 0) {
      throw new FairinoRpcError(`GetRobotErrorCode failed: ${JSON.stringify(result)}`);
    }
    return { mainCode: result[1], subCode: result[2] };
  }

  async getProgramState() {
    const result = await this.call("GetProgramState");
    if (!Array.isArray(result) || result.length < 2 || result[0] !== 0) {
      throw new FairinoRpcError(`GetProgramState failed: ${JSON.stringify(result)}`);
    }
    return result[1];
  }

  async resetAllErrorsAndVerify() {
    const programState = await this.getProgramState();
    if (programState !== 1) {
      throw new FairinoRpcError(
        `Robot reset refused: program state ${programState} is not stopped`,
        409,
      );
    }
    const before = await this.getRobotErrorCode();
    const result = await this.call("ResetAllError");
    if (result !== 0) {
      throw new FairinoRpcError(`ResetAllError was rejected with code ${result}`);
    }

    if (this.verifyDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.verifyDelayMs));
    }
    const after = await this.getRobotErrorCode();
    if (after.mainCode !== 0 || after.subCode !== 0) {
      throw new FairinoRpcError(
        `Robot fault did not clear (${after.mainCode}/${after.subCode})`,
        409,
      );
    }
    return { programState, before, after };
  }

  async enterAutomaticModeAndRun() {
    const programStateBefore = await this.getProgramState();
    if (programStateBefore !== 1) {
      throw new FairinoRpcError(
        `Robot start refused: program state ${programStateBefore} is not stopped`,
        409,
      );
    }

    const modeResult = await this.call("Mode", [0]);
    if (modeResult !== 0) {
      throw new FairinoRpcError(`Mode(0) was rejected with code ${modeResult}`);
    }

    const runResult = await this.call("ProgramRun");
    if (runResult !== 0) {
      throw new FairinoRpcError(`ProgramRun was rejected with code ${runResult}`);
    }

    if (this.programStartDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.programStartDelayMs));
    }
    const programStateAfter = await this.getProgramState();
    if (programStateAfter !== 2) {
      throw new FairinoRpcError(
        `Robot program did not enter running state (state ${programStateAfter})`,
        409,
      );
    }
    return { programStateBefore, programStateAfter };
  }
}
