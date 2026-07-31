# Fairino Robotcel HMI

Browser-based HMI for the Fairino FR5 robotcel. The HMI serves a local web page
and bridges operator commands/status to the robot through Modbus TCP.

The HMI files are in:

```text
hmi/
  index.html
  app.js
  styles.css
  server.mjs
```

The project runs on Windows and Linux with Node.js 18 or newer. No external npm
packages are required at the moment.

## Current implementation scope

The first target is to run the HMI on the Linux machine. Install the Linux
dependencies there, clone this repository there, and use Codex on that Linux
machine to implement and test the HMI startup/service setup.

Robot programming and Fairino teaching work are intentionally kept on the
existing Windows + VMware workflow for now. The Linux machine only needs to run
the HMI bridge and browser interface at this stage.

## Quick start

Install Node.js 18 or newer, then from the repository root:

```bash
npm install
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

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `8787` | HTTP port for the HMI. |
| `HMI_BIND_HOST` | `127.0.0.1` mock, `0.0.0.0` modbus starter | Listen address. Use `0.0.0.0` for network access. |
| `HMI_BRIDGE_MODE` | `mock` | `mock` for local test mode, `modbus` for robot mode. |
| `FAIRINO_HOST` | `192.168.58.2` in modbus starter | Fairino controller or VM IP address. |
| `FAIRINO_PORT` | `502` | Modbus TCP port. |
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
