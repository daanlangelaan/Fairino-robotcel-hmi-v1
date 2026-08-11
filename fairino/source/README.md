# Modular Fairino Lua Source

This folder is the human-friendly source layout.

The Fairino controller can still receive one generated `.lua` file in
`fairino/programs/`, but we keep the actual design split into small modules here
so it stays readable.

Suggested module layout:

- `config.lua`: states, faults, IO numbers, parameters.
- `io_remote_mirror.lua`: optional no-load Modbus TCP output mirror; disabled by default.
- `io_sim.lua`: simulator input helpers and lamp/output helpers.
- `motion.lua`: robot movement routines.
- `station_clamp.lua`: clamp station logic.
- `main_once.lua`: finite simulator POC flow.
- `state_machine_once.lua`: finite state-machine simulator POC.
- `main_state_machine.lua`: later full state-machine entrypoint.

For now, `fairino/programs/mini_cell_poc_sim_once.lua` is the proven runnable
program. The next step is `mini_cell_state_machine_once_generated.lua`, which
keeps the state-machine structure but exits after one cycle for simulator
friendliness.

For Remote IO commissioning, first run
`fairino/programs/remote_io_led_test.lua` with all actuator loads disconnected.
Only a confirmed non-PN M31 Modbus TCP slave is supported. Configure the
Fairino master/register aliases documented in the M31 hardware notes first.
After the LED test succeeds,
`build_variant.ps1 -EnableRemoteIoOutputMirror` creates a parallel-output build:
the Fairino controller DO remains active and each logical output is mirrored to
the corresponding remote coil. Remote inputs are not yet used for control.
