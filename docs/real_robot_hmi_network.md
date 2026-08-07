# Real Robot HMI Network

## Fairino Ports

From the Fairino installation documentation:

- Debug / button-box / web teaching port: `192.168.58.2`
- User Ethernet port: `192.168.57.2`

For the local WebApp teaching page and our Modbus HMI bridge, use the
`192.168.58.x` network.

## Cell Addresses

- Fairino robot: `192.168.58.2`
- Development laptop on USB Ethernet: `192.168.58.10`
- Mini PC HMI: `192.168.58.20`
- Netmask: `255.255.255.0`
- Gateway: leave empty for this isolated robot LAN

Do not reuse these IP addresses on Wi-Fi, VMware adapters, or another NIC.

## Mini PC HMI Environment

The HMI must run as a Modbus TCP client/master against the robot Modbus TCP
slave on port `502`.

Use these environment values on the mini PC:

```text
PORT=8787
HMI_BIND_HOST=0.0.0.0
HMI_BRIDGE_MODE=modbus
FAIRINO_HOST=192.168.58.2
FAIRINO_PORT=502
FAIRINO_UNIT_ID=1
```

The Lua teaching program must be open and running on the robot before the HMI
can show a moving robot heartbeat.

## Laptop Checks

Useful Windows checks while commissioning:

```powershell
ping -S 192.168.58.10 -n 30 192.168.58.2
Test-NetConnection 192.168.58.2 -Port 80
Test-NetConnection 192.168.58.2 -Port 502
Test-NetConnection 192.168.58.2 -Port 9999
```

Port meanings:

- `80`: Fairino WebApp
- `502`: Modbus TCP slave for the HMI
- `9999`: Fairino WebApp background WebSocket

If ping reports `General failure`, Windows is briefly losing the local network
interface or route. That is usually adapter, cable, power saving, dock, or
driver behavior rather than a Modbus configuration problem.
