# Next Steps

## Current proven baseline

- `fairino/programs/mini_cell_poc_sim_once.lua` runs in the simulator.
- Existing points work:
  - `P_HOME`
  - `P_PICK_APPROACH`
  - `P_PICK`
  - `P_PLACE_APPROACH`
  - `P_PLACE`
- Glue points to teach in the point table:
  - `A110_GLUE_APPROACH`
  - `A120_GLUE_START`
  - `A125_GLUE_END`
  - `A130_GLUE_RETRACT`
- Zig-zag filter-dispenser points to teach in the point table:
  - `A012_SINGULATOR_HANDLE_APPROACH`
  - `A014_SINGULATOR_HANDLE_PUSH`
  - `A016_SINGULATOR_HANDLE_RETRACT`
- Existing filter-pick points to move to the new dispenser position:
  - `A020_FILTER_PICK_APPROACH`
  - `A030_FILTER_PICK`
  - `A040_FILTER_LIFT`
- Collision-free transfer from the lifted filter to the clamp:
  - `A045_FILTER_TO_CLAMP_CLEARANCE`
  - Teach and dry-run the route `A040 -> A045 -> A050` at reduced speed.
- DO actions are visible in the simulator.

## Working method

Edit readable source files in `fairino/source/`.

Generate uploadable Fairino Lua files into `fairino/programs/`.

Do not manually maintain large generated files unless debugging a controller
specific issue.

Build options:

- Double-click `build_state_machine_once.cmd` in the project root.
- Or in VS Code: `Terminal > Run Build Task`.
- For unique upload names/backups, use:
  - `build_variant_good_cycle.cmd`
  - `build_variant_filter_empty.cmd`

Unique builds are written to `fairino/programs/releases/` and a convenient
`*_latest.lua` copy is also written to `fairino/programs/`.

## Next tests

1. Run `mini_cell_poc_sim_once_generated.lua`.
2. Run `mini_cell_state_machine_once_generated.lua`.
3. If the fault path is unclear, run `mini_cell_gripper_fault_test_generated.lua`.
   This test picks only, sets red DO4, and must not move to place.
4. Force a pick fault:
   - Set `SIM_GRIPPER_FILTER_PRESENT = 0` in `io_sim.lua`.
   - Run `build_state_machine_once.ps1`.
   - Upload the generated file and verify red/fault behavior.
   - Verify the fault code and stopped process state in the HMI. Do not use
     production outputs `DO5` through `DO7` as debug indicators.
5. Restore `SIM_GRIPPER_FILTER_PRESENT = 1`.
6. Test clamp fault:
   - Set `SIM_CLAMP_CLOSED = 0` in `io_sim.lua`.
   - Run `build_state_machine_once.cmd`.
   - Upload the generated file and verify red/fault behavior.
   - Verify the clamp fault code and stopped process state in the HMI.
7. Restore `SIM_CLAMP_CLOSED = 1`.
8. Teach and dry-run the zig-zag filter-dispenser points at reduced global
   speed before running an automatic cycle.

## Gripper fault recovery

For an ordinary process or resettable controller fault, an already closed
gripper remains closed during recovery homing and opens only after `A010_HOME`
is reached. Keep a tested collection tray at home. Safety-stop and emergency-
stop handling still uses `all_outputs_off()`; never treat the gripper hold as a
safety function or as protection against loss of air or electrical power.

## Zig-zag filter dispenser

The filter cycle now starts with the mechanical handle and then continues with
the existing filter-pick routine:

```text
A012 handle approach -> A014 push down -> A016 retract
    -> A020 filter approach -> A030 filter pick -> A040 filter lift
    -> A045 filter-to-clamp clearance -> A050 clamp approach
```

`A014_SINGULATOR_HANDLE_PUSH` is a slow linear contact move. Teach
`A016_SINGULATOR_HANDLE_RETRACT` so the gripper clears the handle before it
moves toward `A020_FILTER_PICK_APPROACH`. The source retries the complete handle
stroke up to `MAX_FILTER_DISPENSE_RETRIES` times when `filter_present` remains
false and then raises `F001_FILTER_NOT_AVAILABLE`.

## Full-cell expansion order

1. Filter pick/place skeleton.
2. Clamp station.
3. Glue sequence. Current simulator version is integrated after clamp as
   `S100_APPLY_GLUE`.
4. Check-valve dispenser sequence.
5. Insert and press station.
6. Drying row placement.
7. Fault manager.
8. HMI/register interface.

## Production output map

- `DO0`: gripper sluiten.
- `DO1`: clamp sluiten.
- `DO2`: groene lamp.
- `DO3`: oranje lamp.
- `DO4`: rode lamp.
- `DO5`: keerklep aandrukker.
- `DO6`: keerklep toevoer.
- `DO7`: lijmtrigger.

## Glue station test

Build with `build_glue_test.cmd`.

Upload `fairino/programs/mini_cell_glue_test_generated.lua`.

For unique upload names/backups, use `build_variant_glue_j6_test.cmd` and
upload the newest file from `fairino/programs/releases/`.

The normal glue cycle now uses point-table poses for the wrist sweep:

```lua
PTP(A110_GLUE_APPROACH, ...)
Lin(A120_GLUE_START, ...)
SetDO(DO_GLUE_TRIGGER, 1, ...)
Lin(A125_GLUE_END, ...)
SetDO(DO_GLUE_TRIGGER, 0, ...)
Lin(A130_GLUE_RETRACT, ...)
```

Teach `A120_GLUE_START` and `A125_GLUE_END` so J6 has enough travel for the
full glue rotation without reaching its joint limit. Keep the rotation visible
in the point table instead of hiding it in hardcoded Lua joint values.

The older proven simulator test is `glue_servoj_home_test`. It tests
`DO_GLUE_TRIGGER` plus a real J6 rotation using repeated `ServoJ` commands
from the known valid home joint pose.

The production glue trigger uses `DO7`; `DO5` is reserved for the keerklep
aandrukker.

Proven J6 route:

```lua
ServoJ(j1, j2, j3, j4, j5, target_j6, 0, 0, 0.08, 0, 0)
```

Verified result in the Fairino Robot panel:

- `J6: 120`
- `RZ: -30`
- no alarm

Verified temporary glue/contact-position result:

- Start at `P_PLACE`: `J6: 21.799`, `RZ: 90`
- ServoJ target: `J6: 141.799`
- Result: `J6: 141.799`, `RZ: -30`
- no alarm

Verified full-cycle result:

- Build: `mini_cell_full_cycle_with_glue_20260525_005640.lua`
- Flow: dispenser -> pick -> clamp -> `S100_APPLY_GLUE` -> home
- End result: `P_HOME`, `J6: 0`, no alarm
- Double-click build helper: `build_full_cycle_with_glue.cmd`

The `Lin(... offset rz=...)` candidate can run without alarm but did not change
Robot panel `J6`, so it is not the main route for glue wrist rotation. The
numeric `MoveJ` candidate caused joint/TCP consistency errors, so do not use it
unless the controller generated a valid matching joint/TCP pair.
