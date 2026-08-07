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

The deployment script runs the repository checks, refuses to restart while
`CELL_RUNNING` is active, backs up the previous runtime, synchronizes only the
HMI runtime files, restarts `fairino-hmi`, and verifies the local API. Commit
and push accepted workspace changes so GitHub remains reproducible.

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
| `FAIRINO_RPC_PORT` | `20003` | Fairino XML-RPC port used to clear and verify resettable controller faults. |
| `FAIRINO_UNIT_ID` | `1` | Modbus unit id. |
| `FAIRINO_HTTP_BASE` | `http://$FAIRINO_HOST` | Optional Fairino WebApp HTTP base URL. |

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

## Robot reset behavior

In Modbus mode, the HMI Reset button calls the controller's official
`ResetAllError()` RPC method and then confirms with `GetRobotErrorCode()` that
both the main and sub error codes are zero. It first verifies through
`GetProgramState()` that the robot program is stopped. Only after confirmation
does it pulse the existing cell-level `HMI_RESET_REQ`. Reset never starts or
resumes robot motion; Start remains a separate operator action after the
obstruction or fault cause has been removed.
