# Linux HMI service

This is an example setup for running the Fairino HMI as a Linux systemd service.
It does not change the Windows startup flow.

## Scope for the first Linux setup

For now the Linux machine is the target for running the HMI only. Install the
required Linux dependencies on that machine and use Codex on Linux to implement,
test, and adjust the HMI service setup.

Do not move the robot programming workflow yet. Fairino teaching, robot program
loading, and VMware-based robot work stay on the existing Windows + VMware setup
for this phase.

## 1. Install Node.js

Install Node.js 18 or newer on the Linux machine. Install FFmpeg and V4L2 tools
when cycle-triggered fault video will be used:

```bash
node --version
sudo apt-get install ffmpeg v4l-utils ustreamer
```

## 2. Put the repository on the Linux machine

Example location:

```bash
sudo mkdir -p /opt/fairino-robotcel-hmi
sudo chown -R "$USER":"$USER" /opt/fairino-robotcel-hmi
git clone https://github.com/daanlangelaan/Fairino-robotcel-hmi-v1.git /opt/fairino-robotcel-hmi
cd /opt/fairino-robotcel-hmi
npm install
```

There are currently no external npm dependencies. `npm install` is still useful
because it verifies the Node project structure and keeps future installs
standard.

## 3. Test manually

Mock mode, without robot connection:

```bash
npm run start:mock
```

Modbus mode, connected to the Fairino controller:

```bash
FAIRINO_HOST=192.168.58.2 npm run start:modbus
```

Open:

```text
http://127.0.0.1:8787
```

The default is loopback-only. If another PC or tablet must open the HMI from the
network, intentionally bind to all network interfaces:

```bash
HMI_BIND_HOST=0.0.0.0 FAIRINO_HOST=192.168.58.2 npm run start:modbus
```

Then open:

```text
http://<linux-machine-ip>:8787
```

## 4. Install the systemd service

Create the dedicated service user:

```bash
sudo useradd --system --home /opt/fairino-robotcel-hmi --shell /usr/sbin/nologin fairino
sudo chown -R fairino:fairino /opt/fairino-robotcel-hmi
```

Copy the service and environment example:

```bash
sudo cp deploy/systemd/fairino-camera.service /etc/systemd/system/fairino-camera.service
sudo cp deploy/systemd/fairino-hmi.service /etc/systemd/system/fairino-hmi.service
sudo cp deploy/systemd/fairino-hmi.env.example /etc/fairino-hmi.env
sudo nano /etc/fairino-hmi.env
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable fairino-camera fairino-hmi
sudo systemctl start fairino-hmi
```

Check status and logs:

```bash
sudo systemctl status fairino-camera fairino-hmi
journalctl -u fairino-camera -u fairino-hmi -f
```

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `8787` | HTTP port for the HMI. |
| `HMI_BIND_HOST` | `127.0.0.1` | Listen address. Use `0.0.0.0` only on an isolated, trusted network. |
| `HMI_BRIDGE_MODE` | `mock` | `mock` for local test mode, `modbus` for robot mode. |
| `HMI_OUTPUT_TESTS_ENABLED` | `false` | Explicit service gate for Advanced active-low output tests. |
| `HMI_CAMERA_ENABLED` | `false` | Enables the rolling fault-video recorder after commissioning. |
| `HMI_CAMERA_DEVICE` | camera by-id path | Stable V4L2 capture device. |
| `HMI_CAMERA_STORAGE_DIR` | `/var/lib/fairino-hmi/camera` | Private recorder storage. |
| `HMI_CAMERA_INPUT_FORMAT` | `mjpeg` | Camera input pixel format. |
| `HMI_CAMERA_WIDTH` / `HMI_CAMERA_HEIGHT` | `1920` / `1080` | Native Full HD capture resolution. |
| `HMI_CAMERA_FPS` | `25` | Capture rate. |
| `HMI_CAMERA_SOURCE_PORT` | `8788` | Loopback-only shared MJPEG source port. |
| `HMI_CAMERA_SOURCE_URL` | `http://127.0.0.1:8788/stream` | Fixed local stream used by FFmpeg. |
| `HMI_CAMERA_BUFFER_SECONDS` | `120` | Approximate pre-fault window. |
| `HMI_CAMERA_POSTFAULT_SECONDS` | `10` | Retained video after the fault edge. |
| `HMI_CAMERA_SEGMENT_SECONDS` | `4` | Rolling segment size. |
| `HMI_CAMERA_RETENTION_DAYS` | `30` | Maximum incident age. |
| `HMI_CAMERA_MAX_INCIDENTS` | `50` | Maximum incident count. |
| `FAIRINO_HOST` | `192.168.58.2` | Fairino controller or VM IP address. |
| `FAIRINO_PORT` | `502` | Modbus TCP port. |
| `FAIRINO_RPC_PORT` | `20003` | Fairino XML-RPC port for verified controller-fault recovery and program restart. |
| `FAIRINO_UNIT_ID` | `1` | Modbus unit id. |
| `FAIRINO_PROGRAM_NAME` | `mini_cell_production_m31_latest.lua` | Exact M31 production Lua job that the HMI may load and run after controller commissioning. |
| `HMI_LUA_HEARTBEAT_IDLE_TIMEOUT_MS` | `5000` | Maximum unchanged Lua heartbeat outside an active motion cycle. |
| `HMI_LUA_HEARTBEAT_MOTION_TIMEOUT_MS` | `30000` | Longer watchdog window during a cycle because Fairino motion calls block the Lua state loop. |

## Advanced output tests

The Advanced tab can test control-box coils `300`, `301`, `305`, `306`, and
`307`. These outputs are active-low and can actuate connected hardware. The
feature is protected by all of the following:

- `HMI_OUTPUT_TESTS_ENABLED=true` in the production environment;
- a separate arming checkbox in the browser;
- a backend address allowlist and explicit request confirmation;
- a backend interlock that rejects requests while `CELL_RUNNING` is active.

Keep the service setting `false` during normal operation. These controls do not
replace physical isolation or the robot's safety system.

## Fault-video commissioning

The recorder is disabled by default. Before enabling it:

1. List stable camera paths and supported modes with:

   ```bash
   v4l2-ctl --list-devices
   v4l2-ctl --device=/dev/v4l/by-id/<camera>-video-index0 --list-formats-ext
   ```

2. Position the camera so the intended robot, gripper, and process stations are
   visible without unnecessarily recording neighboring work areas.
3. Install both service definitions. `fairino-camera` is the single process that
   opens the USB device and serves MJPEG only on `127.0.0.1:8788`; the HMI and
   FFmpeg recorder consume that shared source:

   ```bash
   sudo cp deploy/systemd/fairino-camera.service /etc/systemd/system/fairino-camera.service
   sudo cp deploy/systemd/fairino-hmi.service /etc/systemd/system/fairino-hmi.service
   sudo systemctl daemon-reload
   sudo systemctl enable fairino-camera fairino-hmi
   ```

4. Copy the camera variables from `deploy/systemd/fairino-hmi.env.example` to
   `/etc/fairino-hmi.env`, keep `HMI_CAMERA_ENABLED=false`, and restart once.
5. Test one recording with the robot and all actuators safely idle. Verify
   framing, timestamp, playback, browser seeking, and that no audio is present.
6. Set `HMI_CAMERA_ENABLED=true` only after this check and restart both services:

   ```bash
   sudo systemctl restart fairino-camera fairino-hmi
   ```

Recording starts on the rising `CELL_RUNNING` status. A normal stop discards
the temporary ring. A fault preserves approximately 120 seconds before and 10
seconds after the fault. Each incident has an MP4, JSON metadata file, and
normally a JPEG thumbnail in `/var/lib/fairino-hmi/camera/incidents`. The newest
50 incidents younger than 30 days are retained by default; retention is applied
at startup and after every saved fault. Camera failure is diagnostic and must
not stop or alter robot control.

The installed camera produced approximately 9.7 MB for 12.1 seconds at
1920x1080/25 fps during commissioning, equivalent to roughly 48 MB per minute
for that scene. With the default 50-incident limit, reserve at least 3 GB plus
temporary headroom; actual H.264 usage varies with movement and detail. Monitor
the state filesystem as part of normal MiniPC maintenance.

The **Camera** tab provides live view and read-only incident playback. The image
is not a safety function and must never replace local inspection before Start,
Reset, or Cel inschakelen. Both `fairino-camera` and the HMI remain bound to
loopback. Do not bind, reverse-proxy, or port-forward the unauthenticated
combined HMI for remote viewing. A future remote support design must use
encrypted transport, authenticated users, role-based authorization, session and
audit logging, and a read-only video role. Any remote action that can initiate
motion needs separate risk assessment and a local physical confirmation; camera
availability must never be an interlock or motion permission.

## Central cell startup

The service starts automatically, but it never starts robot motion merely
because the MiniPC receives power. When the controller program is stopped, the
operator HMI shows **Cel niet ingeschakeld** and enables **Cel inschakelen**.
That action checks the controller fault and HMI Noodstop state, verifies the
loaded job against `FAIRINO_PROGRAM_NAME`, loads the configured job if needed,
selects automatic mode, and starts the job. Success requires both controller
program state `2` and a newly changing Lua heartbeat.

The normal production **Start** command is rejected until the configured job is
running. An already-running correct job is reused without sending another start
command. An unexpected running job, paused job, active HMI Noodstop, controller
fault, failed program load, or missing heartbeat leaves the cell unready and
produces an operator-facing error.

**Cel inschakelen** can cause immediate robot motion through the Lua job's
startup/home sequence. The operator must verify that the cell is clear before
pressing it. Hardware emergency-stop and safety functions remain independent.

## Controller fault reset

The operator Reset button clears a resettable controller fault directly through
Fairino XML-RPC on port `20003`. The bridge executes `ResetAllError()`, waits one
second, and verifies with `GetRobotErrorCode()` that the main and sub codes are
both zero. Before clearing an error, it also requires `GetProgramState()` to
report that the robot program is stopped. It then clears the HMI stop requests,
pulses the existing Modbus cell-reset request, verifies or loads
`FAIRINO_PROGRAM_NAME`, selects automatic mode with `Mode(0)`, starts that Lua
job with `ProgramRun()`, and requires both program state `2` and a changing Lua
heartbeat.

Every HMI status refresh also reads `GetRobotErrorCode()` directly from the
controller. A nonzero controller error takes precedence over stale Lua/Modbus
running registers, so a collision that stops the Lua program is immediately
shown as an error rather than as a running cycle. The exact code remains in the
red fault badge, while the main status message gives an operator-facing
explanation. Controller code `4/1` is described as an axis collision.

The status refresh also reads `GetProgramState()` directly. State `1` (stopped)
overrides stale Lua running registers and is shown as **Cel niet ingeschakeld**. During reset,
the bridge waits one second after `Mode(0)` and retries only controller-rejected
`ProgramRun()` calls, up to three attempts. Once `ProgramRun()` is accepted, it
polls for running state without issuing another start command.

The HMI labels this control **Reset**, but it can cause immediate robot movement,
including the Lua program's initial homing move. The operator must remove the
obstruction and verify that the cell is clear before using it. It cannot bypass
a non-resettable or still-active hardware safety condition.

The HMI Noodstop uses the controller's `ProgramStop()` XML-RPC call and verifies
that `GetProgramState()` becomes `1` (stopped). Reset also handles a legacy or
in-flight Lua safety state `990/991`: when the controller is otherwise healthy
and Lua is still running, it clears the HMI emergency-stop coil and pulses the
Lua reset request instead of refusing the reset because the program is running.

## Updating an existing HMI installation

The Git workspace is authoritative. Do not edit `/opt/fairino-robotcel-hmi`
directly. From the workspace, run:

```bash
npm run check
sudo ./tools/deploy-hmi.sh
npm run check:deployed
```

The deployment creates a timestamped backup under
`/opt/fairino-hmi-backups`, uses the controller's RPC program state to refuse a
restart unless the program is stopped, synchronizes the runtime files, restarts
the service, and checks the local API. After live verification, commit and push
the same workspace changes to GitHub.

If the local HMI API is the component that has stalled, the deployment reads
`FAIRINO_HOST` and `FAIRINO_RPC_PORT` from `/etc/fairino-hmi.env` and performs
the stopped-state check directly against the controller. This is a fallback for
API availability only: controller program state must still equal `1`, otherwise
deployment is refused.

The MiniPC desktop shortcut **Rebuild HMI** starts
`tools/rebuild-hmi-desktop.sh` in a terminal and uses this same deployment
procedure. The terminal remains open when a check fails so the reason is
visible. After a successful update it closes and reopens the Chromium HMI
window, ensuring that both backend modules and browser assets are reloaded.
