import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";

import { FairinoRpcClient, FairinoRpcError, parseXmlRpcResponse } from "../hmi/fairino-rpc.mjs";

function scalarResponse(value) {
  return `<?xml version="1.0"?><methodResponse><params><param><value><i4>${value}</i4></value></param></params></methodResponse>`;
}

function arrayResponse(values) {
  const items = values.map((value) => `<value><i4>${value}</i4></value>`).join("");
  return `<?xml version="1.0"?><methodResponse><params><param><value><array><data>${items}</data></array></value></param></params></methodResponse>`;
}

async function startFakeRpcServer(responses) {
  const calls = [];
  const server = createServer(async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks).toString("utf8");
    calls.push({ path: req.url, body });
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(responses.shift());
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return { server, port: server.address().port, calls };
}

test("parses scalar and array XML-RPC integer responses", () => {
  assert.equal(parseXmlRpcResponse(scalarResponse(0)), 0);
  assert.deepEqual(parseXmlRpcResponse(arrayResponse([0, 4, 1])), [0, 4, 1]);
});

test("uses the official RPC2 ResetAllError call and verifies the fault cleared", async (t) => {
  const fake = await startFakeRpcServer([
    arrayResponse([0, 1]),
    arrayResponse([0, 4, 1]),
    scalarResponse(0),
    arrayResponse([0, 0, 0]),
  ]);
  t.after(() => fake.server.close());

  const client = new FairinoRpcClient({
    host: "127.0.0.1",
    port: fake.port,
    timeout: 1000,
    verifyDelayMs: 0,
  });
  const result = await client.resetAllErrorsAndVerify();

  assert.deepEqual(result, {
    programState: 1,
    before: { mainCode: 4, subCode: 1 },
    after: { mainCode: 0, subCode: 0 },
  });
  assert.deepEqual(fake.calls.map(({ path }) => path), ["/RPC2", "/RPC2", "/RPC2", "/RPC2"]);
  assert.match(fake.calls[0].body, /<methodName>GetProgramState<\/methodName>/);
  assert.match(fake.calls[1].body, /<methodName>GetRobotErrorCode<\/methodName>/);
  assert.match(fake.calls[2].body, /<methodName>ResetAllError<\/methodName>/);
});

test("reports a reset failure when the controller fault remains active", async (t) => {
  const fake = await startFakeRpcServer([
    arrayResponse([0, 1]),
    arrayResponse([0, 4, 1]),
    scalarResponse(0),
    arrayResponse([0, 4, 1]),
  ]);
  t.after(() => fake.server.close());

  const client = new FairinoRpcClient({
    host: "127.0.0.1",
    port: fake.port,
    timeout: 1000,
    verifyDelayMs: 0,
  });

  await assert.rejects(
    () => client.resetAllErrorsAndVerify(),
    (error) => error instanceof FairinoRpcError
      && error.statusCode === 409
      && /4\/1/.test(error.message),
  );
});

test("refuses to reset unless the controller program is stopped", async (t) => {
  const fake = await startFakeRpcServer([arrayResponse([0, 2])]);
  t.after(() => fake.server.close());

  const client = new FairinoRpcClient({
    host: "127.0.0.1",
    port: fake.port,
    timeout: 1000,
    verifyDelayMs: 0,
  });

  await assert.rejects(
    () => client.resetAllErrorsAndVerify(),
    (error) => error instanceof FairinoRpcError
      && error.statusCode === 409
      && /not stopped/.test(error.message),
  );
  assert.equal(fake.calls.length, 1);
});
