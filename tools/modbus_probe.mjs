import net from "node:net";

const host = process.argv[2] || "192.168.92.128";
const port = Number(process.argv[3] || 502);
const unitId = Number(process.argv[4] || 1);

let transactionId = 1;

function request(pdu) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host, port, timeout: 2500 });
    const tid = transactionId++;
    const mbap = Buffer.alloc(7);
    mbap.writeUInt16BE(tid, 0);
    mbap.writeUInt16BE(0, 2);
    mbap.writeUInt16BE(pdu.length + 1, 4);
    mbap.writeUInt8(unitId, 6);
    const frame = Buffer.concat([mbap, pdu]);

    socket.on("connect", () => socket.write(frame));
    socket.on("data", (data) => {
      socket.end();
      resolve(data);
    });
    socket.on("timeout", () => {
      socket.destroy();
      reject(new Error("timeout"));
    });
    socket.on("error", reject);
  });
}

function hex(buffer) {
  return [...buffer].map((byte) => byte.toString(16).padStart(2, "0")).join(" ");
}

async function readCoils(address, quantity) {
  const pdu = Buffer.alloc(5);
  pdu.writeUInt8(1, 0);
  pdu.writeUInt16BE(address, 1);
  pdu.writeUInt16BE(quantity, 3);
  return request(pdu);
}

async function writeSingleCoil(address, value) {
  const pdu = Buffer.alloc(5);
  pdu.writeUInt8(5, 0);
  pdu.writeUInt16BE(address, 1);
  pdu.writeUInt16BE(value ? 0xff00 : 0x0000, 3);
  return request(pdu);
}

async function readHoldingRegisters(address, quantity) {
  const pdu = Buffer.alloc(5);
  pdu.writeUInt8(3, 0);
  pdu.writeUInt16BE(address, 1);
  pdu.writeUInt16BE(quantity, 3);
  return request(pdu);
}

async function writeSingleRegister(address, value) {
  const pdu = Buffer.alloc(5);
  pdu.writeUInt8(6, 0);
  pdu.writeUInt16BE(address, 1);
  pdu.writeUInt16BE(value, 3);
  return request(pdu);
}

async function readInputRegisters(address, quantity) {
  const pdu = Buffer.alloc(5);
  pdu.writeUInt8(4, 0);
  pdu.writeUInt16BE(address, 1);
  pdu.writeUInt16BE(quantity, 3);
  return request(pdu);
}

async function main() {
  const checks = [
    ["read coils 100..104", () => readCoils(100, 5)],
    ["write coil 100 ON", () => writeSingleCoil(100, true)],
    ["read coils 100..104", () => readCoils(100, 5)],
    ["write coil 100 OFF", () => writeSingleCoil(100, false)],
    ["write holding register 100 = 10", () => writeSingleRegister(100, 10)],
    ["read holding registers 100..102", () => readHoldingRegisters(100, 3)],
    ["read input registers 100..105", () => readInputRegisters(100, 6)],
  ];

  for (const [label, fn] of checks) {
    try {
      const response = await fn();
      console.log(`${label}: ${hex(response)}`);
    } catch (error) {
      console.log(`${label}: ERROR ${error.message}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
