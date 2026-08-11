# Fairino Robot Cell Software

This folder contains Fairino Lua programs and related controller-side notes.

## Current direction

- Fairino FR5 controller is the main cell controller.
- Lua is the primary robot/cell program language.
- External HMI is a thin interface only.
- Safety remains hardware-based and separate from normal Lua/HMI logic.

## M31 Remote IO commissioning

The confirmed hardware is a `M31-AXXXA000G-U` 16DI Modbus host with
`M31-GAXXXA000-U` 16DI and `M31-GXXAX00A0-U` 16DO expansions. Follow
[the M31 hardware notes](../docs/hardware/remote_io_cdsenet_m31.md) before using
`programs/remote_io_led_test.lua` or enabling the optional parallel output
mirror. Existing Fairino controller IO remains authoritative until each remote
channel has been commissioned.

## HMI / VM recovery

After unpacking or restoring a Fairino SimMachine VM, use the recovery runbook:

- [Fairino VM + HMI Recovery Runbook](../docs/fairino_vm_hmi_recovery_runbook.md)

It documents the Modbus alias restore, point table import, HMI Lua build,
local bridge startup, and the online checks for `Modbus` and `Robot HB`.

## First proof-of-concept

Program: `programs/mini_cell_poc.lua`

Purpose:

- Validate a small state machine on the controller.
- Validate DI read behavior and timeouts.
- Validate DO outputs for gripper, clamp, and lamps.
- Validate reset/fault flow.
- Keep the program small before scaling to the full filter/check-valve cell.

Important open check:

- Confirm `GetDI(port) == 1` on the real/simulated controller. The local webapp generator uses this form for conditions. If needed, only `di_is_on(port)` should be adapted.

## Simulator-only variant

Program: `programs/mini_cell_poc_sim.lua`

Use this version when there is no real I/O hardware yet. It replaces real
`GetDI(...)` reads with editable Lua variables at the top of the file:

- `SIM_SAFETY_OK`
- `SIM_START_BUTTON`
- `SIM_FILTER_PRESENT`
- `SIM_GRIPPER_FILTER_PRESENT`
- `SIM_CLAMP_CLOSED`
- `SIM_RESET_BUTTON`

Set a value to `1` for true/high or `0` for false/low. This lets the simulator
test normal flow and fault flow before physical sensors exist.

The simulator-only version uses the existing pick/place teaching points from
the earlier test:

- `P_HOME`
- `P_PICK_APPROACH`
- `P_PICK`
- `P_PLACE_APPROACH`
- `P_PLACE`

The full cell version will later use real station names such as
`P_CLAMP_APPROACH` and `P_CLAMP_PLACE`, after those points exist in the
controller point database.

If the simulator shows `Start commandFailed`, first try
`programs/mini_cell_poc_sim_once.lua`. That file has no endless state-machine
loop and should behave like the earlier finite pick/place tests.
