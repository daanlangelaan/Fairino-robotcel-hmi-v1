import assert from "node:assert/strict";
import test from "node:test";
import {
  RemoteIoStatusMonitor,
  remoteIoConfigFromEnv,
} from "../hmi/remote-io-status.mjs";

test("M31 monitor uses the commissioned Modbus TCP endpoint", () => {
  assert.deepEqual(remoteIoConfigFromEnv({}), {
    host: "192.168.58.7",
    port: 502,
    timeoutMs: 1200,
  });
  assert.deepEqual(remoteIoConfigFromEnv({
    M31_REMOTE_IO_HOST: "10.0.0.7",
    M31_REMOTE_IO_PORT: "1502",
    M31_REMOTE_IO_TIMEOUT_MS: "2500",
  }), {
    host: "10.0.0.7",
    port: 1502,
    timeoutMs: 2500,
  });
});

test("M31 monitor reports successful and failed reachability checks", async () => {
  let reachable = true;
  const monitor = new RemoteIoStatusMonitor(remoteIoConfigFromEnv({}), {
    now: () => new Date("2026-08-14T18:30:00.000Z"),
    probe: async () => {
      if (!reachable) throw new Error("host offline");
    },
  });

  assert.equal(monitor.status().connected, false);
  await monitor.refresh();
  assert.equal(monitor.status().connected, true);
  assert.equal(monitor.status().error, null);

  reachable = false;
  await monitor.refresh();
  assert.equal(monitor.status().connected, false);
  assert.match(monitor.status().error, /host offline/);
});
