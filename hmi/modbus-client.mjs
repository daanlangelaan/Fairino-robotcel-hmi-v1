import net from "node:net";

export function createSingleFlight(operation) {
  let inFlight = null;

  return (...args) => {
    if (inFlight) return inFlight;

    const current = Promise.resolve().then(() => operation(...args));
    inFlight = current;
    current.then(
      () => {
        if (inFlight === current) inFlight = null;
      },
      () => {
        if (inFlight === current) inFlight = null;
      },
    );
    return current;
  };
}

export class ModbusTcpClient {
  constructor({ host, port = 502, unitId = 1, timeout = 2000 }) {
    this.host = host;
    this.port = port;
    this.unitId = unitId;
    this.timeout = timeout;
    this.socket = null;
    this.receiveBuffer = Buffer.alloc(0);
    this.pending = null;
    this.nextTransactionId = 1;
    this.queue = Promise.resolve();
  }

  request(pdu) {
    return this.runExclusive((request) => request(pdu));
  }

  runExclusive(operation) {
    const run = this.queue.then(async () => {
      const socket = await this.ensureConnected();
      const request = (pdu) => this.requestOnSocket(socket, pdu);
      return operation(request);
    });

    this.queue = run.catch(() => {});
    return run;
  }

  ensureConnected() {
    if (this.socket && !this.socket.destroyed && this.socket.writable) {
      return Promise.resolve(this.socket);
    }

    return new Promise((resolve, reject) => {
      const socket = net.createConnection({ host: this.host, port: this.port });
      let connecting = true;

      this.socket = socket;
      this.receiveBuffer = Buffer.alloc(0);

      socket.on("data", (chunk) => this.handleData(socket, chunk));
      socket.on("error", (error) => {
        if (connecting) {
          connecting = false;
          reject(error);
        }
        this.handleSocketFailure(socket, error);
      });
      socket.on("close", () => {
        const error = new Error("Modbus connection closed");
        if (connecting) {
          connecting = false;
          reject(error);
        }
        this.handleSocketFailure(socket, error);
      });
      socket.once("connect", () => {
        if (!connecting) return;
        connecting = false;
        resolve(socket);
      });
    });
  }

  requestOnSocket(socket, pdu) {
    if (socket !== this.socket || socket.destroyed || !socket.writable) {
      return Promise.reject(new Error("Modbus connection is not available"));
    }
    if (this.pending) {
      return Promise.reject(new Error("A Modbus request is already in flight"));
    }

    const transactionId = this.nextTransactionId;
    this.nextTransactionId = transactionId >= 65535 ? 1 : transactionId + 1;

    const mbap = Buffer.alloc(7);
    mbap.writeUInt16BE(transactionId, 0);
    mbap.writeUInt16BE(0, 2);
    mbap.writeUInt16BE(pdu.length + 1, 4);
    mbap.writeUInt8(this.unitId, 6);

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const error = new Error("Modbus timeout");
        this.rejectPending(error);
        socket.destroy();
      }, this.timeout);

      this.pending = { transactionId, resolve, reject, timer };
      socket.write(Buffer.concat([mbap, pdu]));
    });
  }

  handleData(socket, chunk) {
    if (socket !== this.socket) return;

    this.receiveBuffer = Buffer.concat([this.receiveBuffer, chunk]);
    if (this.receiveBuffer.length < 7) return;

    const protocolId = this.receiveBuffer.readUInt16BE(2);
    const messageLength = this.receiveBuffer.readUInt16BE(4);
    const frameLength = 6 + messageLength;

    if (protocolId !== 0 || messageLength < 2 || frameLength > 260) {
      const error = new Error("Invalid Modbus TCP response header");
      this.rejectPending(error);
      socket.destroy();
      return;
    }
    if (this.receiveBuffer.length < frameLength) return;

    const frame = this.receiveBuffer.subarray(0, frameLength);
    this.receiveBuffer = this.receiveBuffer.subarray(frameLength);
    const pending = this.pending;

    if (!pending) {
      socket.destroy(new Error("Unexpected Modbus TCP response"));
      return;
    }

    const transactionId = frame.readUInt16BE(0);
    const responseUnitId = frame.readUInt8(6);
    if (transactionId !== pending.transactionId) {
      const error = new Error(`Unexpected Modbus transaction ID ${transactionId}`);
      this.rejectPending(error);
      socket.destroy();
      return;
    }
    if (responseUnitId !== this.unitId) {
      const error = new Error(`Unexpected Modbus unit ID ${responseUnitId}`);
      this.rejectPending(error);
      socket.destroy();
      return;
    }

    const responsePdu = frame.subarray(7);
    if (responsePdu[0] >= 0x80) {
      const error = new Error(`Modbus exception ${responsePdu[1]}`);
      this.rejectPending(error);
      return;
    }

    this.pending = null;
    clearTimeout(pending.timer);
    pending.resolve(responsePdu);
  }

  rejectPending(error) {
    const pending = this.pending;
    if (!pending) return;

    this.pending = null;
    clearTimeout(pending.timer);
    pending.reject(error);
  }

  handleSocketFailure(socket, error) {
    if (socket !== this.socket) return;

    this.socket = null;
    this.receiveBuffer = Buffer.alloc(0);
    this.rejectPending(error);
  }

  close() {
    if (this.socket) this.socket.destroy();
    this.socket = null;
    this.receiveBuffer = Buffer.alloc(0);
    this.rejectPending(new Error("Modbus client closed"));
  }
}
