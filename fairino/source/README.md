# Modular Fairino Lua Source

This folder is the human-friendly source layout.

The Fairino controller can still receive one generated `.lua` file in
`fairino/programs/`, but we keep the actual design split into small modules here
so it stays readable.

Module layout:

- `config.lua`: states, faults, IO numbers, parameters.
- `io_map_generated.lua`: generated device names, signal names and M31 addresses
  from the V4 handoff; never edit this file manually.
- `io_m31_production.lua`: authoritative M31 production input/output driver.
- `io_remote_mirror_noop.lua`: normal controller-build layer without M31 database dependencies.
- `io_remote_mirror.lua`: optional no-load Modbus TCP output mirror, included only when explicitly enabled.
- `io_sim.lua`: simulator input helpers and lamp/output helpers.
- `motion.lua`: robot movement routines.
- `station_clamp.lua`: clamp station logic.
- `main_once.lua`: finite simulator POC flow.
- `state_machine_once.lua`: finite state-machine simulator POC.
- `main_state_machine.lua`: later full state-machine entrypoint.

The historical test programs remain available for reproducing the test phase.
The definitive-machine build is generated with:

```bash
npm run generate:m31-io
npm run build:fairino-production
```

This produces `fairino/programs/mini_cell_production_m31_latest.lua`. The build
fails if the generated map differs from the V4 payload, contains direct
`SetDO`/`GetDI` field-I/O calls, or still enables the parallel output mirror.

For Remote IO commissioning, first run
`fairino/programs/remote_io_led_test.lua` with all actuator loads disconnected.
Only a confirmed non-PN M31 Modbus TCP slave is supported. Configure the
Fairino master/register aliases documented in the M31 hardware notes first.
`build_variant.ps1 -EnableRemoteIoOutputMirror` remains a historical test-only
path: the FAIRINO controller output remains active and is mirrored to M31. Do
not use that variant for the definitive machine.
