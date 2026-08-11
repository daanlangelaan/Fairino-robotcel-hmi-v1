import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, root), "utf8");
}

test("remote output mirror is opt-in and preserves controller-first ordering", async () => {
  const [config, io, remote] = await Promise.all([
    source("fairino/source/config.lua"),
    source("fairino/source/io_sim.lua"),
    source("fairino/source/io_remote_mirror.lua"),
  ]);

  assert.match(config, /^REMOTE_IO_OUTPUT_MIRROR_ENABLED = 0$/m);
  assert.ok(io.indexOf("SetDO(") < io.indexOf("remote_io_write_output("));
  assert.match(remote, /REMOTE_IO_OUTPUT_MIRROR_ENABLED ~= 1/);
  assert.match(remote, /REMOTE_IO_OUTPUT_ACTIVE_LEVEL/);
  assert.match(remote, /REMOTE_IO_OUTPUT_INACTIVE_LEVEL/);
  assert.match(remote, /ModbusMasterWriteDO\(\s*M31_REMOTE_IO,\s*M31_DO_0/s);
  assert.match(remote, /ModbusMasterReadDI\(M31_REMOTE_IO, M31_DI_0/);
  assert.doesNotMatch(remote, /ModbusReg(?:Read|Write)/);
});

test("variant build places the mirror layer before the shared IO layer", async () => {
  const build = await source("fairino/source/build_variant.ps1");

  assert.ok(build.indexOf('"io_remote_mirror.lua"') < build.indexOf('"io_sim.lua"'));
  assert.match(build, /EnableRemoteIoOutputMirror/);
  assert.match(
    build,
    /REMOTE_IO_OUTPUT_MIRROR_ENABLED\\s\*=\\s\*0.*REMOTE_IO_OUTPUT_MIRROR_ENABLED = 1/s,
  );
});

test("standalone LED test addresses all 16 outputs and finishes all-off", async () => {
  const program = await source("fairino/programs/remote_io_led_test.lua");

  assert.match(program, /^REMOTE_DO_START_ADDRESS = 0$/m);
  assert.match(program, /^REMOTE_DO_COUNT = 16$/m);
  assert.equal((program.match(/for channel = 0, REMOTE_DO_COUNT - 1 do/g) || []).length, 2);
  assert.match(program, /ModbusMasterWriteDO\(M31_REMOTE_IO, M31_DO_0/);
  assert.doesNotMatch(program, /ModbusRegWrite|ModbusRTU/);
  assert.match(program, /Always finish with every remote output off/);
});
