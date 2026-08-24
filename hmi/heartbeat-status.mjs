function timeoutSetting(value, fallback, { min = 1000, max = 120000 } = {}) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

export function heartbeatTimeoutConfigFromEnv(env = process.env) {
  const idleMs = timeoutSetting(env.HMI_LUA_HEARTBEAT_IDLE_TIMEOUT_MS, 5000);
  const configuredMotionMs = timeoutSetting(env.HMI_LUA_HEARTBEAT_MOTION_TIMEOUT_MS, 30000);
  return {
    idleMs,
    motionMs: Math.max(idleMs, configuredMotionMs),
  };
}

export function luaHeartbeatStatus({
  lastChangeAt,
  now = Date.now(),
  running = false,
  idleTimeoutMs = 5000,
  motionTimeoutMs = 30000,
}) {
  const timeoutMs = running
    ? Math.max(idleTimeoutMs, motionTimeoutMs)
    : idleTimeoutMs;
  const validLastChange = Number.isFinite(Number(lastChangeAt)) && Number(lastChangeAt) > 0;
  const ageMs = validLastChange
    ? Math.max(0, Number(now) - Number(lastChangeAt))
    : null;
  return {
    ageMs,
    timeoutMs,
    fresh: ageMs !== null && ageMs < timeoutMs,
  };
}
