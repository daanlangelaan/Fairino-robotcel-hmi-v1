# HMI Modbus TCP Register Map

Doel: dezelfde registerstructuur gebruiken voor de lokale laptop-HMI, de latere Raspberry Pi HMI en de Fairino Lua state-machine.

## Topologie

```text
Raspberry Pi HMI = Modbus TCP master/client
Fairino controller = Modbus TCP slave/server
```

Tijdens ontwikkeling draait op de laptop een lokale bridge:

```text
Browser HMI -> lokale bridge -> mock registers
Browser HMI -> lokale bridge -> Modbus TCP naar Fairino
```

De HMI blijft in beide gevallen dezelfde registermap gebruiken.

## Fairino Modbus TCP Slave

Uit de Fairino documentatie:

- Modbus TCP slave ondersteunt coils, discrete inputs, holding registers en input registers.
- De robot slave ondersteunt waarschijnlijk maar een masterverbinding tegelijk.
- General-purpose slave registers kunnen aliases krijgen in de Fairino WebApp.
- Functionele coils bestaan ook voor robot start/stop, maar celcommando's houden we in eigen user-registers.

## Adresblokken

We gebruiken voorlopig het general-purpose bereik vanaf `100`, omdat de Fairino TCP slave voorbeelden dit bereik gebruiken voor algemene aliases.

### HMI -> Fairino Coils

| Address | Alias | Betekenis | Type |
| ---: | --- | --- | --- |
| 100 | `HMI_START_REQ` | Start request, flank/one-shot | coil |
| 101 | `HMI_RESET_REQ` | Fault/reset request, flank/one-shot | coil |
| 102 | `HMI_STOP_REQ` | Stop/cycle-stop request | coil |
| 103 | `HMI_AUTO_MODE_REQ` | HMI vraagt auto/cycle-ready mode | coil |
| 104 | `HMI_ACK_REQ` | Bevestig melding/fouttekst | coil |
| 105 | `HMI_ESTOP_REQ` | HMI-noodstop request, direct naar safety/fault | coil |

### HMI -> Fairino Holding Registers

| Address | Alias | Betekenis | Type |
| ---: | --- | --- | --- |
| 100 | `HMI_BATCH_TARGET` | Gewenst batchaantal | holding register |
| 101 | `HMI_HEARTBEAT` | Teller vanuit HMI | holding register |
| 102 | `HMI_RECIPE` | Receptnummer, later | holding register |

### Fairino -> HMI Discrete Inputs

| Address | Alias | Betekenis | Type |
| ---: | --- | --- | --- |
| 100 | `CELL_READY` | Cel klaar voor start | discrete input |
| 101 | `CELL_RUNNING` | Cyclus actief | discrete input |
| 102 | `CELL_FAULT_ACTIVE` | Storing actief | discrete input |
| 103 | `CELL_SAFETY_OK` | Safety keten OK, alleen indicatie | discrete input |
| 104 | `CELL_GLUE_ACTIVE` | Lijmoutput actief | discrete input |
| 105 | `CELL_CLAMP_CLOSED` | Klem dicht indicatie | discrete input |
| 106 | `CELL_GRIPPER_OK` | Grijper/product OK indicatie | discrete input |
| 107 | `CELL_BATCH_COMPLETE` | Batch klaar | discrete input |
| 108 | `CELL_COMMS_OK` | Robot ziet HMI heartbeat | discrete input |

### Fairino -> HMI Input Registers

| Address | Alias | Betekenis | Type |
| ---: | --- | --- | --- |
| 100 | `CELL_STATE` | Actuele state als nummer, bijvoorbeeld `100` | input register |
| 101 | `CELL_FAULT_CODE` | Actieve foutcode, `0` is geen fout | input register |
| 102 | `CELL_CYCLE_COUNT` | Totaal aantal cycli | input register |
| 103 | `CELL_BATCH_TARGET_ECHO` | Actueel batchdoel | input register |
| 104 | `CELL_BATCH_DONE` | Aantal gereed in huidige batch | input register |
| 105 | `CELL_ROBOT_HEARTBEAT` | Teller vanuit robot/Lua | input register |

## Flankafhandeling

Start, reset, stop en noodstop zijn commando's, geen vaste toestanden.

- HMI zet coil kort naar `1`.
- Fairino/Lua ziet opgaande flank.
- Fairino/Lua verwerkt commando.
- HMI/bridge zet coil terug naar `0`.

`HMI_STOP_REQ` is een gecontroleerde cycle-stop: de lopende cyclus wordt afgemaakt, daarna start Lua geen volgende cyclus.

`HMI_ESTOP_REQ` is een softwarematige noodstop voor de HMI/simulator: Lua gaat naar `S990_SAFETY_STOP`, zet outputs uit en meldt fault `991`. Een echte noodstop moet altijd hardwarematig/veiligheidsmatig buiten deze software geborgd blijven.

De lokale bridge simuleert dit nu al met pulsen.

## Watchdog

HMI schrijft periodiek `HMI_HEARTBEAT`.
Fairino schrijft periodiek `CELL_ROBOT_HEARTBEAT`.

Bij wegvallen van HMI heartbeat:

- geen nieuwe cyclus starten;
- actieve cyclus bij voorkeur gecontroleerd stoppen of afmaken, afhankelijk van proceskeuze;
- safety blijft altijd hardwarematig.

## User Tab

Alleen normale bediening:

- start
- stop/cycle stop
- noodstop
- reset
- batch target
- batch done
- stoplicht/status
- foutmelding

## Troubleshoot Tab

Bouw- en onderhoudsbeeld:

- alle registers
- alle command bits
- alle sensor/mock inputs
- state-machine details
- output mirrors
- eventlog
