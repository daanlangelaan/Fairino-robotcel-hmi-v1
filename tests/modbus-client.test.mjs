import assert from "node:assert/strict";
import net from "node:net";
import test from "node:test";

import { createSingleFlight, ModbusTcpClient } from "../hmi/modbus-client.mjs";

function readRequest(functionCode, address, quantity) {
  const pdu = Buffer.alloc(5);
  pdu.writeUInt8(functionCode, 0);
  pdu.writeUInt16BE(address, 1);
  pdu.writeUInt16BE(quantity, 3);
  return pdu;
}

function responseFor(frame) {
  const functionCode = frame.readUInt8(7);
  const quantity = frame.readUInt16BE(10);
  let responsePdu;

  if (functionCode === 1 || functionCode === 2) {
    responsePdu = Buffer.from([functionCode, Math.ceil(quantity / 8), 0]);
  } else {
    responsePdu = Buffer.alloc(2 + quantity * 2);
    responsePdu.writeUInt8(functionCode, 0);
    responsePdu.writeUInt8(quantity * 2, 1);
  }

  const mbap = Buffer.from(frame.subarray(0, 7));
  mbap.writeUInt16BE(responsePdu.length + 1, 4);
  return Buffer.concat([mbap, responsePdu]);
}

async function startFakeModbusServer() {
  const requests = [];
  let connections = 0;
  let activeRequests = 0;
  let maxActiveRequests = 0;

  const server = net.createServer((socket) => {
    connections += 1;
    let buffer = Buffer.alloc(0);

    socket.on("data", (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);

      while (buffer.length >= 7) {
        const frameLength = 6 + buffer.readUInt16BE(4);
        if (buffer.length < frameLength) return;

        const frame = buffer.subarray(0, frameLength);
        buffer = buffer.subarray(frameLength);
        activeRequests += 1;
        maxActiveRequests = Math.max(maxActiveRequests, activeRequests);
        requests.push({
          functionCode: frame.readUInt8(7),
          address: frame.readUInt16BE(8),
          quantity: frame.readUInt16BE(10),
        });

        setTimeout(() => {
          socket.write(responseFor(frame));
          activeRequests -= 1;
        }, 10);
      }
    });
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  return {
    server,
    port: server.address().port,
    requests,
    get connections() {
      return connections;
    },
    get maxActiveRequests() {
      return maxActiveRequests;
    },
  };
}

test("serializes snapshot reads on one persistent connection", async (t) => {
  const fake = await startFakeModbusServer();
  const client = new ModbusTcpClient({ host: "127.0.0.1", port: fake.port, unitId: 1 });
  t.after(() => {
    client.close();
    fake.server.close();
  });

  await client.runExclusive(async (request) => {
    await request(readRequest(1, 100, 6));
    await request(readRequest(3, 100, 3));
    await request(readRequest(2, 100, 9));
    await request(readRequest(4, 100, 6));
  });

  assert.equal(fake.connections, 1);
  assert.equal(fake.maxActiveRequests, 1);
  assert.deepEqual(fake.requests, [
    { functionCode: 1, address: 100, quantity: 6 },
    { functionCode: 3, address: 100, quantity: 3 },
    { functionCode: 2, address: 100, quantity: 9 },
    { functionCode: 4, address: 100, quantity: 6 },
  ]);
});

test("queues concurrent callers with only one request in flight", async (t) => {
  const fake = await startFakeModbusServer();
  const client = new ModbusTcpClient({ host: "127.0.0.1", port: fake.port, unitId: 1 });
  t.after(() => {
    client.close();
    fake.server.close();
  });

  await Promise.all([
    client.request(readRequest(1, 100, 1)),
    client.request(readRequest(1, 101, 1)),
  ]);

  assert.equal(fake.connections, 1);
  assert.equal(fake.maxActiveRequests, 1);
  assert.deepEqual(fake.requests.map(({ address }) => address), [100, 101]);
});

test("coalesces overlapping polling cycles", async () => {
  let calls = 0;
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const poll = createSingleFlight(async () => {
    calls += 1;
    await gate;
    return calls;
  });

  const first = poll();
  const overlapping = poll();
  assert.equal(first, overlapping);
  assert.equal(calls, 0);

  release();
  assert.equal(await first, 1);
  assert.equal(calls, 1);
  assert.equal(await poll(), 2);
});
