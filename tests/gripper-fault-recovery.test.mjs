import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const ioPath = new URL("../fairino/source/io_sim.lua", import.meta.url);
const stateMachinePath = new URL(
  "../fairino/source/state_machine_once.lua",
  import.meta.url,
);

test("closed gripper is detected from physical DO0 after a Lua restart", async () => {
  const io = await readFile(ioPath, "utf8");

  assert.match(
    io,
    /if GetDO\(DO_GRIPPER_CLOSE, 0\) == OUTPUT_ACTIVE_LEVEL then\s+GRIPPER_COMMAND_CLOSED = 1/,
  );
  assert.match(io, /function gripper_is_commanded_closed\(\)/);
});

test("ordinary fault recovery holds the gripper until home and then opens it", async () => {
  const stateMachine = await readFile(stateMachinePath, "utf8");
  const init = stateMachine.match(/function state_init\(\)([\s\S]*?)\nend/)?.[1] || "";

  const rememberClosed = init.indexOf("gripper_is_commanded_closed()");
  const preserveGripper = init.indexOf("all_outputs_off_except_gripper()");
  const home = init.indexOf("move_home()");
  const openAtHome = init.indexOf("set_output(DO_GRIPPER_CLOSE, false)", home);

  assert.ok(rememberClosed >= 0);
  assert.ok(preserveGripper > rememberClosed);
  assert.ok(home > preserveGripper);
  assert.ok(openAtHome > home);
  assert.match(
    stateMachine,
    /function state_fault\(\)\s+all_outputs_off_except_gripper\(\)/,
  );
  assert.match(
    stateMachine,
    /function state_wait_reset\(\)\s+all_outputs_off_except_gripper\(\)/,
  );
});

test("safety stop still releases outputs through the existing safe path", async () => {
  const stateMachine = await readFile(stateMachinePath, "utf8");

  assert.match(
    stateMachine,
    /function request_safety_stop\(code\)[\s\S]*?all_outputs_off\(\)/,
  );
  assert.match(
    stateMachine,
    /function state_safety_stop\(\)\s+all_outputs_off\(\)/,
  );
});
