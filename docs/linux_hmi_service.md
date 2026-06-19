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

Install Node.js 18 or newer on the Linux machine.

```bash
node --version
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
FAIRINO_HOST=192.168.92.130 npm run start:modbus
```

Open:

```text
http://127.0.0.1:8787
```

If another PC or tablet must open the HMI from the network, bind to all network
interfaces:

```bash
HMI_BIND_HOST=0.0.0.0 FAIRINO_HOST=192.168.92.130 npm run start:modbus
```

Then open:

```text
http://<linux-machine-ip>:8787
```

## 4. Install the systemd service

Create a dedicated user if desired:

```bash
sudo useradd --system --home /opt/fairino-robotcel-hmi --shell /usr/sbin/nologin fairino
sudo chown -R fairino:fairino /opt/fairino-robotcel-hmi
```

Copy the service and environment example:

```bash
sudo cp deploy/systemd/fairino-hmi.service /etc/systemd/system/fairino-hmi.service
sudo cp deploy/systemd/fairino-hmi.env.example /etc/fairino-hmi.env
sudo nano /etc/fairino-hmi.env
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable fairino-hmi
sudo systemctl start fairino-hmi
```

Check status and logs:

```bash
sudo systemctl status fairino-hmi
journalctl -u fairino-hmi -f
```

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `8787` | HTTP port for the HMI. |
| `HMI_BIND_HOST` | `127.0.0.1` | Listen address. Use `0.0.0.0` for network access. |
| `HMI_BRIDGE_MODE` | `mock` | `mock` for local test mode, `modbus` for robot mode. |
| `FAIRINO_HOST` | `192.168.92.128` | Fairino controller or VM IP address. |
| `FAIRINO_PORT` | `502` | Modbus TCP port. |
| `FAIRINO_UNIT_ID` | `1` | Modbus unit id. |
| `FAIRINO_HTTP_BASE` | `http://$FAIRINO_HOST` | Optional Fairino WebApp HTTP base URL. |
