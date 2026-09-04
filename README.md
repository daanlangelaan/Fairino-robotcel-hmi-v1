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

The project runs on Windows and Linux with Node.js 18 or newer. Runtime code has
no external npm dependencies; development validation uses the locked packages
from `package-lock.json`.

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

On the production MiniPC, the **Rebuild HMI** desktop launcher runs this same
guarded deployment in a visible terminal. It asks for sudo authorization,
refuses deployment while the robot program is running, and reopens the HMI
window after a successful service restart. **Close HMI** and **Start HMI** only
manage the browser window and do not deploy source changes.

The deployment script runs the repository checks, verifies through Fairino RPC
that the controller program is stopped, backs up the previous runtime,
synchronizes only the HMI runtime files, restarts `fairino-hmi`, and verifies
the local API. When the API itself is temporarily unavailable, deployment uses
the configured controller address for the same direct Fairino RPC safety check;
it still refuses every state other than stopped (`1`). Commit and push accepted
workspace changes so GitHub remains reproducible.

Robot programming and Fairino teaching assets remain in their existing project
folders. The HMI is an operator interface and Modbus bridge; safety and motion
logic remain outside the browser application.

## M31 Remote IO

The Remote IO commissioning path uses the Modbus set
`M31-AXXXA000G-U` + `M31-GAXXXA000-U` + `M31-GXXAX00A0-U`. Start with
[the hardware and migration notes](docs/hardware/remote_io_cdsenet_m31.md) and
[the TCP startcheck](docs/hardware/remote_io_tcp_startcheck.md). The Remote IO
output mirror is disabled by default and belongs only to the completed test
phase. The definitive machine uses the generated M31-only program
`fairino/programs/mini_cell_production_m31_latest.lua`. Its names and addresses
are generated from the V4 field-device handoff, so the Lua program, electrical
schema and documentation share one source.

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

## Remote beheer met Codex

De robotcel-MiniPC kan vanaf de vertrouwde beheerlaptop als remote Codex-project
worden gebruikt via SSH over Tailscale. De inrichting, controles,
Windows-configuratie en herstelstappen staan in
[`docs/remote_codex_access.md`](docs/remote_codex_access.md). De daadwerkelijke
SSH-, Tailscale- en slaapinstellingen zijn hostconfiguratie en worden daarom
niet als secrets of systeembestanden in deze repository opgeslagen.

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
| `HMI_CAMERA_ENABLED` | `false` | Enables cycle-triggered fault-video buffering after camera commissioning. |
| `HMI_CAMERA_DEVICE` | Jieli by-id path | Stable Linux V4L2 camera device. Prefer `/dev/v4l/by-id/...` over `/dev/videoN`. |
| `HMI_CAMERA_STORAGE_DIR` | `/var/lib/fairino-hmi/camera` | Private ring-buffer and incident-library storage. |
| `HMI_CAMERA_INPUT_FORMAT` | `mjpeg` | V4L2 input format validated for the installed camera. |
| `HMI_CAMERA_WIDTH` / `HMI_CAMERA_HEIGHT` | `1920` / `1080` | Recorded native Full HD resolution. |
| `HMI_CAMERA_FPS` | `25` | Recorded frames per second. |
| `HMI_CAMERA_SOURCE_PORT` | `8788` | Loopback-only port for the shared local MJPEG source. |
| `HMI_CAMERA_SOURCE_URL` | `http://127.0.0.1:8788/stream` | Fixed local source used by the recorder. |
| `HMI_CAMERA_BUFFER_SECONDS` | `120` | Approximate pre-fault video window. |
| `HMI_CAMERA_POSTFAULT_SECONDS` | `10` | Video retained after the fault edge. |
| `HMI_CAMERA_SEGMENT_SECONDS` | `4` | Internal rolling segment duration. |
| `HMI_CAMERA_RETENTION_DAYS` | `30` | Maximum incident age. |
| `HMI_CAMERA_MAX_INCIDENTS` | `50` | Maximum number of incident clips. |
| `FAIRINO_HOST` | `192.168.58.2` | Fairino controller or VM IP address. |
| `FAIRINO_PORT` | `502` | Modbus TCP port. |
| `FAIRINO_RPC_PORT` | `20003` | Fairino XML-RPC port used for verified controller-fault recovery and program restart. |
| `FAIRINO_UNIT_ID` | `1` | Modbus unit id. |
| `FAIRINO_PROGRAM_NAME` | `mini_cell_production_m31_latest.lua` | Exact M31 production Lua job that **Cel inschakelen** and Reset are allowed to load and run after controller commissioning. |
| `HMI_LUA_HEARTBEAT_IDLE_TIMEOUT_MS` | `5000` | Maximum unchanged Lua heartbeat while the state loop is idle. |
| `HMI_LUA_HEARTBEAT_MOTION_TIMEOUT_MS` | `30000` | Maximum unchanged Lua heartbeat during a running cycle; allows for blocking Fairino motion instructions. |

## Linux service

Systemd examples are included in:

```text
deploy/systemd/fairino-hmi.service
deploy/systemd/fairino-camera.service
deploy/systemd/fairino-hmi.env.example
```

Full Linux setup instructions are in:

```text
docs/linux_hmi_service.md
```

## Cycle-triggered fault video

The optional local camera source opens the USB camera once and shares its
loopback-only MJPEG stream between live HMI viewing and recording. The recorder
starts on the rising edge of `CELL_RUNNING`, retains an approximately 120-second
rolling window without audio, and continues for 10 seconds after a rising
`CELL_FAULT_ACTIVE` status. A normal cycle stop discards the temporary ring.

Each fault is stored as a separate MP4 with UTC metadata and a thumbnail under
`/var/lib/fairino-hmi/camera/incidents`. The library is newest-first and is
bounded to 50 incidents and 30 days by default. The **Camera** tab shows the
live Full-HD view, local date/time, fault details, thumbnails, and read-only
playback with browser seeking. Capture or storage failure is reported in the
HMI but never changes robot state or blocks machine control. Video is diagnostic
evidence only and is not a safety function.

The installed Full HD mode produced approximately 9.7 MB for 12.1 seconds in a
commissioning test, or roughly 48 MB per minute at that scene complexity. Later
production clips reached roughly 94 MB per minute. Allow at least 600 MB of
temporary headroom while the 120-second ring, final clip, and atomic replacement
can briefly coexist; actual H.264 size varies with movement and image detail.

Linux requires `ffmpeg`, `v4l-utils`, `ustreamer`, camera access for the
`fairino` service account, and a private state directory. Keep both HTTP services
on loopback. The current control HMI has state-changing APIs without user
authentication, so it must not be exposed or port-forwarded for remote video.
Future remote support must add authenticated users, role separation, encrypted
transport, logging, and local confirmation for every action that can move the
robot; the camera remains diagnostic and cannot provide safety clearance.

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
code as an error. `hmi/controller-status.mjs` contains a Dutch transcription of
every main/sub motion-controller fault in the [Fairino 3.9.8 Appendix
20.1](https://fairino-doc-en.readthedocs.io/latest/CobotsManual/appendix.html).
For example, `4/2` is shown as a resettable collision on axis 2. The HMI also
uses the documented resetability: Reset remains available for resettable faults
and is blocked for non-resettable, unspecified, and unknown controller faults.
Those cases direct the operator to technical personnel without sending the
operator to the Fairino WebApp.

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
