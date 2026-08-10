# Fairino Robotcel HMI

Browser-based HMI for the Fairino FR5 robotcel. The HMI serves a local web page
and bridges operator commands/status to the robot through Modbus TCP.

The HMI files are in:

```text
hmi/
  index.html
  app.js
  styles.css
  modbus-client.mjs
  output-tests.mjs
  server.mjs
```

The project runs on Windows and Linux with Node.js 18 or newer. No external npm
packages are required at the moment.

## Source of truth and deployment

This repository is the source of truth for the HMI software. The installed copy
at `/opt/fairino-robotcel-hmi` is a deployment target, not a development folder.
Make HMI changes here, test them here, and then deploy them to `/opt`.

Check whether the workspace and deployed runtime match:

```bash
npm run check:deployed
```

After testing a workspace change, deploy it on the HMI PC with:

```bash
sudo ./tools/deploy-hmi.sh
```

The deployment script runs the repository checks, verifies through Fairino RPC
that the controller program is stopped, backs up the previous runtime,
synchronizes only the HMI runtime files, restarts `fairino-hmi`, and verifies
the local API. Commit and push accepted workspace changes so GitHub remains
reproducible.

Robot programming and Fairino teaching assets remain in their existing project
folders. The HMI is an operator interface and Modbus bridge; safety and motion
logic remain outside the browser application.

## Quick start

Install Node.js 18 or newer, then from the repository root:

```bash
npm install
npm run check
npm run start:mock
```

Open:

```text
http://127.0.0.1:8787
```

Mock mode is for testing the HMI without a robot connection.

## Run with the Fairino robot or VM

Set the Fairino IP address and start in Modbus mode:

```bash
FAIRINO_HOST=192.168.58.2 npm run start:modbus
```

On Windows PowerShell:

```powershell
$env:FAIRINO_HOST = "192.168.58.2"
npm run start:modbus
```

The existing Windows starter still works:

```text
Start_HMI_Modbus.bat
```

That script starts the HMI in Modbus mode and keeps the current Windows workflow
intact.

## Network access

In mock mode the HMI listens only on the local machine:

```text
127.0.0.1:8787
```

For a Linux HMI box that must be opened from another PC or tablet:

```bash
HMI_BIND_HOST=0.0.0.0 FAIRINO_HOST=192.168.58.2 npm run start:modbus
```

Then open:

```text
http://<linux-machine-ip>:8787
```

## Useful commands

```bash
npm run start
npm run start:mock
npm run start:modbus
npm run check
```

`npm run start` defaults to mock mode unless `HMI_BRIDGE_MODE` is set.

The deployed HMI includes serialized Modbus polling over a persistent TCP
connection and automated tests for request ordering, concurrency, and protected
manual output tests.

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `8787` | HTTP port for the HMI. |
| `HMI_BIND_HOST` | `127.0.0.1` | Listen address. Use `0.0.0.0` only when intentionally exposing the HMI to a trusted network. |
| `HMI_BRIDGE_MODE` | `mock` | `mock` for local test mode, `modbus` for robot mode. |
| `HMI_OUTPUT_TESTS_ENABLED` | `false` | Service-level gate for the Advanced active-low control-box output tests. |
| `FAIRINO_HOST` | `192.168.58.2` | Fairino controller or VM IP address. |
| `FAIRINO_PORT` | `502` | Modbus TCP port. |
| `FAIRINO_RPC_PORT` | `20003` | Fairino XML-RPC port used for verified controller-fault recovery and program restart. |
| `FAIRINO_UNIT_ID` | `1` | Modbus unit id. |
| `FAIRINO_PROGRAM_NAME` | `mini_cell_a_cycle_order_hmi_reset_home_20260715_172115.lua` | Exact production Lua job that **Cel inschakelen** and Reset are allowed to load and run. |

## Linux service

Systemd examples are included in:

```text
deploy/systemd/fairino-hmi.service
deploy/systemd/fairino-hmi.env.example
```

Full Linux setup instructions are in:

```text
docs/linux_hmi_service.md
```

The production `/etc/fairino-hmi.env`, browser profile, logs, and MiniPC desktop
configuration are intentionally not part of the HMI source repository.

## Operator manual

The Dutch living operator manual is maintained in
[`docs/gebruikershandleiding_hmi.md`](docs/gebruikershandleiding_hmi.md). Any
operator-facing change to buttons, status text, fault recovery, or the normal
workflow must update that manual in the same commit. PDF or Word releases may be
generated from this version-controlled source at formal release milestones.

## Central cell startup

After a controller or MiniPC restart, the operator does not need the Fairino
WebApp. The HMI shows **Cel niet ingeschakeld** while `GetProgramState()` reports
state `1`. The deliberate **Cel inschakelen** action then:

1. requires a healthy controller, an inactive HMI Noodstop, and stopped program state;
2. checks `GetLoadedProgram()` against `FAIRINO_PROGRAM_NAME`;
3. loads the configured Lua job with `ProgramLoad()` when another job is selected;
4. selects automatic mode with `Mode(0)` and starts the job with `ProgramRun()`;
5. requires controller state `2` and a changing Lua/Modbus heartbeat before reporting success.

The production **Start** button remains disabled until those checks pass. If the
configured program is already running, the HMI attaches to it without issuing
another start. **Cel inschakelen** can cause the Lua job's immediate homing move,
so the operator must first verify that the cell is clear.

This is intentionally an operator-confirmed startup rather than unattended
motion at power-on. The HMI service itself still starts automatically with
Linux.

## Robot reset behavior

In Modbus mode, the HMI Reset button calls the controller's official
`ResetAllError()` RPC method and then confirms with `GetRobotErrorCode()` that
both the main and sub error codes are zero. It first verifies through
`GetProgramState()` that the robot program is stopped. Only after confirmation
does it clear the HMI stop requests, pulse the cell-level `HMI_RESET_REQ`, verify
or load `FAIRINO_PROGRAM_NAME`, select automatic mode with `Mode(0)`, and call
`ProgramRun()`. The request only reports success after `GetProgramState()`
returns state `2` and the Lua heartbeat changes.

The live HMI status also reads `GetRobotErrorCode()` directly from the
controller. A nonzero controller error overrides stale Lua/Modbus running data,
turns off the green running indication, and presents the controller main/sub
code as an error. Known controller codes also receive an operator-facing
explanation; `4/1` is shown as an axis-collision warning with instructions to
remove the obstruction and check that the arm can move freely.

The live status also reads `GetProgramState()`. Controller state `1` overrides a
stale Lua `CELL_RUNNING` bit, so a failed start is shown as **Cel niet
ingeschakeld** instead of green/**Draait**. Recovery waits for automatic mode to settle and retries a
controller-rejected `ProgramRun()` up to three times; it never retries after an
accepted start that subsequently stops.

The **Reset** button can cause immediate robot movement, including the Lua
program's initial homing move. Only use it after the collision cause or
obstruction has been removed and the cell is clear. This software control cannot
bypass an active hardware safety circuit.

The HMI Noodstop command uses the controller's authenticated-independent
`ProgramStop()` XML-RPC method and verifies program state `1` (stopped). Reset
also recognizes an already-running Lua safety state `990/991`, clears the
latched HMI emergency-stop request, and sends the Lua reset request so this fault
does not remain stuck.
