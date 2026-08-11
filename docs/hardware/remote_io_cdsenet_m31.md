# CDSENET / Ebyte M31 Remote IO

Deze notitie beschrijft uitsluitend de nieuwe Modbus-set die op 10 augustus
2026 is gefotografeerd. De eerder geteste Profinet-modules en hun documentatie
zijn uit het project verwijderd om verwisseling te voorkomen.

## Bevestigde hardware

De nieuwe foto's tonen één gekoppelde M31-host met twee uitbreidingen:

| Positie | Typecode op front | Functie | Rol |
| --- | --- | --- | --- |
| Links | `M31-AXXXA000G-U` | 16 DI | Modbus TCP/RTU-hoofdmodule |
| Midden | `M31-GAXXXA000-U` | 16 DI | I/O-uitbreiding |
| Rechts | `M31-GXXAX00A0-U` | 16 DO | I/O-uitbreiding |

De hoofdmodule heeft geen `-PN`-suffix. Op de zijwand staat
`Protocol: Modbus TCP/Modbus RTU`. Dit komt overeen met de lokale
[M31 Distributed I/O Master-handleiding](./ebyte_m31_distributed_io_master_manual_2026.pdf).

Nieuwe referentiefoto's:

- [gekoppelde modules, voorzijde](../photos/m31-remote-io/m31-module-front-connected.jpeg)
- [achterzijde en vergrendelingen](../photos/m31-remote-io/m31-module-rear.jpeg)
- [zijwand met protocol en DI-schema](../photos/m31-remote-io/m31-module-side-wiring-diagram.jpeg)
- [status- en kanaal-LEDs](../photos/m31-remote-io/m31-module-status-leds.jpeg)

## Protocol en registermap

De Fairino wordt Modbus TCP client/master; de M31 wordt TCP server/slave. De
M31-handleiding geeft als fabriekswaarden:

| Parameter | Fabriekswaarde |
| --- | --- |
| Slave-id | `1` |
| IP-adres | `192.168.3.7/24` |
| Modbus TCP-poort | `502` |
| DHCP | Uit |

De vier DIP-switches vormen het hardwaredeel van het slave-adres. Het totale
adres is hardware-adres plus software-offset. Fabrieksinstelling is `0 + 1 = 1`.

Volgens sectie 4.8 van de M31-handleiding zijn adressen per I/O-type continu
over host en uitbreidingen. Voor deze opbouw betekent dit:

| I/O | Modbus-adressen | Functiecodes |
| --- | --- | --- |
| Hoofdmodule DI1-DI16 | `0x0000`-`0x000F` | lezen met `0x02` |
| Uitbreiding DI1-DI16 | `0x0010`-`0x001F` | lezen met `0x02` |
| Uitbreiding DO1-DO16 | `0x0000`-`0x000F` | lezen `0x01`, schrijven `0x05`/`0x0F` |

De adressen zijn nulgebaseerd op de Modbus-wire: LED `DI1` is adres `0`, LED
`DI16` op de tweede DI-module is adres `31`, en LED `DO1` is adres `0`.

## Parallelle migratiestrategie

### Fase 1 - communicatie en LEDs

1. Laat alle actuatorbelastingen losgekoppeld van de DO-module.
2. Wijzig het M31-adres met Ebyte Distributed IO Configtool v1.3 van
   `192.168.3.7` naar `192.168.58.7`; zie de
   [TCP-startcheck](./remote_io_tcp_startcheck.md).
3. Configureer Fairino WebApp onder `Program Teaching` -> `ModbusTCP Settings`
   -> `Master settings` met masteralias `M31_REMOTE_IO`, IP `192.168.58.7`,
   poort `502` en unit-id `1`.
4. Voeg DO-alias `M31_DO_0` op adres `0` en DI-alias `M31_DI_0` op adres `0`
   toe.
5. Lees DI-adressen `0`-`31` en test DO-adressen `0`-`15` zonder belasting.
6. Voer
   [remote_io_led_test.lua](../../fairino/programs/remote_io_led_test.lua) uit.
   Het programma loopt DO1-DO16 één voor één af en eindigt met alles uit.

### Fase 2 - parallel naast Fairino-controller-IO

De bestaande Fairino-uitgangen blijven aangesloten en leidend. Na een volledig
geslaagde LED-test kan een parallelle build worden gemaakt met:

```powershell
powershell -ExecutionPolicy Bypass -File .\fairino\source\build_variant.ps1 `
  -Variant "remote_io_parallel" `
  -EnableRemoteIoOutputMirror
```

De laag
[io_remote_mirror.lua](../../fairino/source/io_remote_mirror.lua) schrijft elke
logische uitgang eerst naar de bestaande Fairino DO en daarna naar dezelfde
Remote-IO-coil. In deze fase blijven de Remote-IO-uitgangen zonder
actuatorbelasting; de LEDs en metingen bewijzen alleen adressering en polariteit.

Remote DI kan tijdens commissioning met `remote_io_read_input(port)` worden
gelezen, maar bestuurt de robotcyclus nog niet. Zo kan ieder sensorkanaal naast
de bestaande ingang worden vergeleken zonder de productiebron te wijzigen.

### Fase 3 - per signaal omzetten

Zet pas daarna één signaal tegelijk fysiek over. Bevestig per kanaal:

- logisch actief/inactief en elektrische polariteit;
- veilige toestand bij communicatieverlies en robotstop;
- juiste kanaal-LED en procesfeedback;
- bekabeling, contactbelasting en eventuele blusdiode bij spoelen;
- herstel na spanningsuitval.

Noodstop, veiligheidsrelais en andere safety-functies blijven buiten gewone
Remote IO en mogen niet via deze softwarelaag worden vervangen.

## Voorlopige celsignaalmapping

| Signaal | Nu | Remote kanaal |
| --- | ---: | ---: |
| Grijper sluiten | Fairino DO0 | DO1 / adres 0 |
| Klem sluiten | Fairino DO1 | DO2 / adres 1 |
| Groene lamp | Fairino DO2 | DO3 / adres 2 |
| Oranje lamp | Fairino DO3 | DO4 / adres 3 |
| Rode lamp | Fairino DO4 | DO5 / adres 4 |
| Check-valve pers | Fairino DO5 | DO6 / adres 5 |
| Check-valve toevoer | Fairino DO6 | DO7 / adres 6 |
| Lijmtrigger | Fairino DO7 | DO8 / adres 7 |
| Startknop | nog simulator/HMI | DI1 / adres 0 |
| Resetknop | nog simulator/HMI | DI2 / adres 1 |
| Filter aanwezig | nog simulator | DI3 / adres 2 |
| Filter in grijper | nog simulator | DI4 / adres 3 |
| Klem dicht | nog simulator | DI5 / adres 4 |

Kanaalnaam en wire-adres verschillen bewust één: fysiek `DO1` heeft
Modbus-adres `0`.

## Nog op de echte cel vastleggen

- Definitief M31-IP, subnetmasker en eventuele gateway.
- Bevestiging van unit-id `1` en continu brandende TCP-connection-status.
- Werkende Fairino `ModbusMasterWriteDO`-vorm op deze controllerfirmware.
- Uitgangscontactbelasting en fail-safe instelling voor alle gebruikte DO's.
- Definitieve klemmenlijst en ader-/kabelnummers.
