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
   - Expected debug result:
     - `DO4` on = fault active.
     - `DO5` off = clamp was not accepted.
     - `DO6` off = pick was not accepted.
     - `DO7` off = place/clamp state was not entered.
5. Restore `SIM_GRIPPER_FILTER_PRESENT = 1`.
6. Test clamp fault:
   - Set `SIM_CLAMP_CLOSED = 0` in `io_sim.lua`.
   - Run `build_state_machine_once.cmd`.
   - Upload the generated file and verify red/fault behavior.
   - Expected debug result:
     - `DO4` on = fault active.
     - `DO6` on = pick accepted.
     - `DO7` on = place/clamp state entered.
     - `DO5` off = clamp was not accepted.
7. Restore `SIM_CLAMP_CLOSED = 1`.
8. Add the filter dispenser routine.

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

## Debug output map

- `DO4`: fault/red lamp.
- `DO5`: clamp accepted.
- `DO6`: pick accepted.
- `DO7`: place/clamp state entered.

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

During simulator testing the glue trigger is mirrored to visible `DO5`.

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
