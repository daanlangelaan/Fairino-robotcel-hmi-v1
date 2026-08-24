import { createConnection } from "node:net";

function positiveInteger(value, fallback, { min = 1, max = 65535 } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}

export function remoteIoConfigFromEnv(env = process.env) {
  return {
    host: String(env.M31_REMOTE_IO_HOST || "192.168.58.7").trim(),
    port: positiveInteger(env.M31_REMOTE_IO_PORT, 502),
    timeoutMs: positiveInteger(env.M31_REMOTE_IO_TIMEOUT_MS, 1200, { min: 100, max: 10000 }),
  };
}

export function probeTcpEndpoint({ host, port, timeoutMs }, dependencies = {}) {
  const connect = dependencies.createConnection || createConnection;
  return new Promise((resolve, reject) => {
    const socket = connect({ host, port });
    let settled = false;
    const finish = (error) => {
      if (settled) return;
      settled = true;
      socket.destroy();
      if (error) reject(error);
      else resolve();
    };
    socket.setTimeout(timeoutMs, () => finish(new Error("verbindingstime-out")));
    socket.once("connect", () => finish());
    socket.once("error", finish);
  });
}

export class RemoteIoStatusMonitor {
  constructor(config, dependencies = {}) {
    this.config = { ...config };
    this.probe = dependencies.probe || probeTcpEndpoint;
    this.now = dependencies.now || (() => new Date());
    this.current = {
      connected: false,
      checkedAt: null,
      error: "M31 Remote IO nog niet gecontroleerd",
    };
    this.refreshing = null;
  }

  async refresh() {
    if (this.refreshing) return this.refreshing;
    this.refreshing = this.refreshOnce().finally(() => {
      this.refreshing = null;
    });
    return this.refreshing;
  }

  async refreshOnce() {
    try {
      await this.probe(this.config);
      this.current = {
        connected: true,
        checkedAt: this.now().toISOString(),
        error: null,
      };
    } catch (error) {
      this.current = {
        connected: false,
        checkedAt: this.now().toISOString(),
        error: `M31 Remote IO niet bereikbaar: ${error.message}`,
      };
    }
    return this.status();
  }

  status() {
    return {
      host: this.config.host,
      port: this.config.port,
      ...this.current,
    };
  }
}
