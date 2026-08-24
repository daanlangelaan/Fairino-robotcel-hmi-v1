import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const motionPath = new URL("../fairino/source/motion.lua", import.meta.url);
const stationPath = new URL(
  "../fairino/source/station_filter_dispenser.lua",
  import.meta.url,
);
const stateMachinePath = new URL(
  "../fairino/source/state_machine_once.lua",
  import.meta.url,
);

test("zig-zag dispenser handle stroke precedes the existing filter pick", async () => {
  const motion = await readFile(motionPath, "utf8");
  const station = await readFile(stationPath, "utf8");

  const approach = motion.indexOf("A012_SINGULATOR_HANDLE_APPROACH");
  const push = motion.indexOf("A014_SINGULATOR_HANDLE_PUSH");
  const retract = motion.indexOf("A016_SINGULATOR_HANDLE_RETRACT");
  const pickApproach = motion.indexOf("A020_FILTER_PICK_APPROACH");

  assert.ok(approach >= 0);
  assert.ok(approach < push);
  assert.ok(push < retract);
  assert.ok(retract < pickApproach);
  assert.match(station, /dispense_filter_motion\(\)/);
  assert.match(station, /guarded_wait\(FILTER_DISPENSE_SETTLE_TIME_MS\)/);
});

test("filter transfer uses a collision-clearance point before clamp approach", async () => {
  const motion = await readFile(motionPath, "utf8");
  const filterLift = motion.indexOf("A040_FILTER_LIFT");
  const clearance = motion.indexOf("A045_FILTER_TO_CLAMP_CLEARANCE");
  const clampApproach = motion.indexOf("A050_CLAMP_APPROACH");

  assert.ok(filterLift >= 0);
  assert.ok(clearance > filterLift);
  assert.ok(clampApproach > clearance);
  assert.match(
    motion,
    /PTP\(A045_FILTER_TO_CLAMP_CLEARANCE, SPEED_APPROACH, -1, 0\)/,
  );
});

test("dispenser reset clears an empty condition without masking a safety stop", async () => {
  const station = await readFile(stationPath, "utf8");
  const stateMachine = await readFile(stateMachinePath, "utf8");

  assert.match(
    station,
    /function filter_dispenser_reset\(\)[\s\S]*filter_dispenser_empty = 0[\s\S]*end/,
  );
  assert.match(stateMachine, /function state_init\(\)[\s\S]*filter_dispenser_reset\(\)/);
  assert.match(
    stateMachine,
    /elseif current_state == S50_DISPENSE_FILTER then\s+raise_fault\(F001_FILTER_NOT_AVAILABLE\)/,
  );
});
