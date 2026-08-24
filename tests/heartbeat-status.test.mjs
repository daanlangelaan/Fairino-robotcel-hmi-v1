import assert from "node:assert/strict";
import test from "node:test";

import {
  heartbeatTimeoutConfigFromEnv,
  luaHeartbeatStatus,
} from "../hmi/heartbeat-status.mjs";

test("allows blocking Fairino motion states a longer heartbeat interval", () => {
  const moving = luaHeartbeatStatus({
    lastChangeAt: 1000,
    now: 20000,
    running: true,
    idleTimeoutMs: 5000,
    motionTimeoutMs: 30000,
  });
  const idle = luaHeartbeatStatus({
    lastChangeAt: 1000,
    now: 20000,
    running: false,
    idleTimeoutMs: 5000,
    motionTimeoutMs: 30000,
  });

  assert.deepEqual(moving, { ageMs: 19000, timeoutMs: 30000, fresh: true });
  assert.deepEqual(idle, { ageMs: 19000, timeoutMs: 5000, fresh: false });
});

test("marks a running Lua heartbeat stale at the motion timeout", () => {
  assert.equal(luaHeartbeatStatus({
    lastChangeAt: 1000,
    now: 31000,
    running: true,
    idleTimeoutMs: 5000,
    motionTimeoutMs: 30000,
  }).fresh, false);
});

test("treats a heartbeat without an observed change as not fresh", () => {
  assert.deepEqual(luaHeartbeatStatus({ lastChangeAt: 0, now: 1000 }), {
    ageMs: null,
    timeoutMs: 5000,
    fresh: false,
  });
});

test("normalizes configurable heartbeat timeouts safely", () => {
  assert.deepEqual(heartbeatTimeoutConfigFromEnv({}), { idleMs: 5000, motionMs: 30000 });
  assert.deepEqual(heartbeatTimeoutConfigFromEnv({
    HMI_LUA_HEARTBEAT_IDLE_TIMEOUT_MS: "7000",
    HMI_LUA_HEARTBEAT_MOTION_TIMEOUT_MS: "3000",
  }), { idleMs: 7000, motionMs: 7000 });
});
