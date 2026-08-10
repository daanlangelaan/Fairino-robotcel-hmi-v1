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
  if (Number.isInteger(value)) {
    return `<param><value><i4>${value}</i4></value></param>`;
  }
  if (typeof value === "string") {
    return `<param><value><string>${escapeXml(value)}</string></value></param>`;
  }
  throw new FairinoRpcError(`Unsupported Fairino RPC parameter: ${JSON.stringify(value)}`, 500);
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

  const values = [...xml.matchAll(/<value>\s*<(i4|int|string)>\s*([\s\S]*?)\s*<\/\1>\s*<\/value>/gi)]
    .map((match) => (
      match[1].toLowerCase() === "string"
        ? decodeXml(match[2])
        : Number(match[2])
    ));
  if (values.length === 0) {
    throw new FairinoRpcError("Fairino RPC response did not contain a supported result");
  }
  return values.length === 1 ? values[0] : values;
}

export function normalizeProgramName(programName) {
  return String(programName || "")
    .replaceAll("\\", "/")
    .split("/")
    .filter(Boolean)
    .at(-1) || "";
}

export class FairinoRpcClient {
  constructor({
    host,
    port = 20003,
    timeout = 3000,
    verifyDelayMs = 1000,
    programStartDelayMs = 1000,
    modeSettleDelayMs = 1000,
    programStartAttempts = 3,
    programStartRetryDelayMs = 1000,
    programStatePollMs = 250,
    programStartTimeoutMs = 5000,
    programStopDelayMs = 1000,
  }) {
    this.host = host;
    this.port = port;
    this.timeout = timeout;
    this.verifyDelayMs = verifyDelayMs;
    this.programStartDelayMs = programStartDelayMs;
    this.modeSettleDelayMs = modeSettleDelayMs;
    this.programStartAttempts = programStartAttempts;
    this.programStartRetryDelayMs = programStartRetryDelayMs;
    this.programStatePollMs = programStatePollMs;
    this.programStartTimeoutMs = programStartTimeoutMs;
    this.programStopDelayMs = programStopDelayMs;
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

  async getLoadedProgram() {
    const result = await this.call("GetLoadedProgram");
    if (!Array.isArray(result) || result.length < 2 || result[0] !== 0 || typeof result[1] !== "string") {
      throw new FairinoRpcError(`GetLoadedProgram failed: ${JSON.stringify(result)}`);
    }
    return result[1];
  }

  async ensureProgramLoaded(programName) {
    const expectedProgram = normalizeProgramName(programName);
    if (!expectedProgram.toLowerCase().endsWith(".lua")) {
      throw new FairinoRpcError(`Invalid configured Lua program: ${JSON.stringify(programName)}`, 500);
    }

    const programState = await this.getProgramState();
    if (programState !== 1) {
      throw new FairinoRpcError(
        `Robot program load refused: program state ${programState} is not stopped`,
        409,
      );
    }

    const loadedBefore = await this.getLoadedProgram();
    if (normalizeProgramName(loadedBefore) === expectedProgram) {
      return { programState, loadedBefore, loadedAfter: loadedBefore, changed: false };
    }

    const result = await this.call("ProgramLoad", [expectedProgram]);
    if (result !== 0) {
      throw new FairinoRpcError(`ProgramLoad was rejected with code ${result}`);
    }
    const loadedAfter = await this.getLoadedProgram();
    if (normalizeProgramName(loadedAfter) !== expectedProgram) {
      throw new FairinoRpcError(
        `Robot loaded ${JSON.stringify(loadedAfter)} instead of ${JSON.stringify(expectedProgram)}`,
        409,
      );
    }
    return { programState, loadedBefore, loadedAfter, changed: true };
  }

  async programStopAndVerify() {
    const programStateBefore = await this.getProgramState();
    if (programStateBefore === 1) {
      return { programStateBefore, programStateAfter: 1 };
    }

    const result = await this.call("ProgramStop");
    if (result !== 0) {
      throw new FairinoRpcError(`ProgramStop was rejected with code ${result}`);
    }
    if (this.programStopDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.programStopDelayMs));
    }
    const programStateAfter = await this.getProgramState();
    if (programStateAfter !== 1) {
      throw new FairinoRpcError(
        `Robot program did not enter stopped state (state ${programStateAfter})`,
        409,
      );
    }
    return { programStateBefore, programStateAfter };
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

    let lastRejection = "unknown rejection";
    for (let attempt = 1; attempt <= this.programStartAttempts; attempt += 1) {
      const modeResult = await this.call("Mode", [0]);
      if (modeResult !== 0) {
        lastRejection = `Mode(0) was rejected with code ${modeResult}`;
      } else {
        if (this.modeSettleDelayMs > 0) {
          await new Promise((resolve) => setTimeout(resolve, this.modeSettleDelayMs));
        }
        const runResult = await this.call("ProgramRun");
        if (runResult === 0) {
          if (this.programStartDelayMs > 0) {
            await new Promise((resolve) => setTimeout(resolve, this.programStartDelayMs));
          }
          const deadline = Date.now() + this.programStartTimeoutMs;
          let programStateAfter;
          do {
            programStateAfter = await this.getProgramState();
            if (programStateAfter === 2) {
              return { programStateBefore, programStateAfter, attempts: attempt };
            }
            if (this.programStatePollMs > 0 && Date.now() < deadline) {
              await new Promise((resolve) => setTimeout(resolve, this.programStatePollMs));
            }
          } while (Date.now() < deadline);
          throw new FairinoRpcError(
            `Robot program did not enter running state (state ${programStateAfter})`,
            409,
          );
        }
        lastRejection = `ProgramRun was rejected with code ${runResult}`;
      }

      if (attempt < this.programStartAttempts && this.programStartRetryDelayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.programStartRetryDelayMs));
      }
    }
    throw new FairinoRpcError(
      `${lastRejection} after ${this.programStartAttempts} attempts`,
    );
  }
}
