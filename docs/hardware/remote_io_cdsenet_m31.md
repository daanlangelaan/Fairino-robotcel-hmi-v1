# CDSENET / Ebyte M31 remote IO

Deze notitie legt vast welke remote-IO hardware voor de Fairino-cel is besteld
en welke koppelroute we eerst moeten proberen. De foto's van de ontvangen
modules tonen `ProfiNet/ModBus RTU`. De latere check in de officiele
`M31-U-PN` handleiding laat echter zien dat de `-PN` serie primair een
Profinet distributed IO host is en daarnaast een Profinet-to-Modbus-RTU
gatewayfunctie via RS485 heeft. Dat is niet hetzelfde als bewezen
"lokale IO als Modbus RTU slave".

## Hardware uit bestelling

| Module | Functie | Protocol / rol | Opmerking |
| --- | --- | --- | --- |
| `M31-GAXXXA000-U` | 16 DI | Modbus TCP / Modbus RTU, RJ45 + RS485 | Smalle hoofdmodule. Goede kandidaat voor directe Fairino Modbus TCP of RTU-koppeling. |
| `P31-XXAX00A0G-U` | 16 DO | Label: `16DO <-> RS485 / Ethernet`, protocol `ProfiNet/ModBus RTU` | Ontvangen DO-module. De opdruk suggereert IO-koppeling via RS485/Ethernet, maar USB wordt niet genoemd. Bewijs nog nodig of Fairino de lokale DO via Modbus RTU/TCP direct kan schrijven. |
| `M31-AXXXA000G-U-PN` / label `AXXXA000G-U-PN` | 16 DI | Label: `ProfiNet/ModBus RTU` | Officiele `-PN` docs: Profinet IO host met RS485 gatewayfunctie. Niet bewezen als Modbus RTU slave voor lokale DI. |

Belangrijk: mijn eerdere aanname dat de `-PN` modules alleen Profinet waren was
te kort door de bocht, maar de omgekeerde aanname "dus lokale IO kan via Modbus
RTU" is ook niet bewezen. Volgens de officiele `-PN` documentatie is RS485 een
gatewaybus: de PN-module kan als Profinet-to-Modbus-RTU master acht command nodes
aansturen. Voor gebruik zonder Profinet-controller moeten we expliciet bewijzen
dat de lokale DI/DO ook via Modbus RTU slave-functies toegankelijk zijn.

## Lokale bronbestanden

- [Ebyte M31 distributed IO master manual](./ebyte_m31_distributed_io_master_manual_2026.pdf)
- [Ebyte P31-U Profinet gateway/manual](./ebyte_p31_u_profinet_gateway_manual_2025.pdf)
- [Ebyte M31-U-PN Profinet distributed IO host manual](./ebyte_m31_u_pn_profinet_distributed_io_host_manual.pdf)
- Fairino Modbus TCP documentatie: [../fairino/coding.html](../fairino/coding.html), sectie `9.18 Modbus TCP Communication`
- Fairino Modbus RTU documentatie: [../fairino/coding.html](../fairino/coding.html), sectie `9.30 Robot ModbusRTU Communication`
- Fairino grafische IO/Modbus blokken: [../fairino/graphical_programming.html](../fairino/graphical_programming.html), sectie `10.10.1 Modbus Commands`
- Ontvangen modulefoto: [photos/m31_axxxa000g_u_pn_label.png](./photos/m31_axxxa000g_u_pn_label.png)
- Ontvangen protocolfoto: [photos/m31_protocol_modbus_rtu_label.png](./photos/m31_protocol_modbus_rtu_label.png)
- Ontvangen DO-modulefoto: [photos/p31_xxax00a0g_u_16do_rs485_ethernet_label.png](./photos/p31_xxax00a0g_u_16do_rs485_ethernet_label.png)
- Ontvangen DI-modulefoto: [photos/m31_axxxa000g_u_pn_rs485_ethernet_label.png](./photos/m31_axxxa000g_u_pn_rs485_ethernet_label.png)

Externe bronnen die gebruikt zijn bij het aanmaken:

- `https://www.cdebyte.com/products/M31-XXAX00A0G`
- `https://www.cdebyte.com/products/M31-XXAX00A0G-U-PN/2`
- `https://www.cdebyte.com/products/M31-AXXXA000G-U-PN`
- `https://www.cdebyte.com/pdf-down.aspx?id=3402`
- `https://www.cdebyte.com/Uploadfiles/Files/2025-5-29/2025529157402667.pdf`

## Fairino-koppelkeuze

### Route A: direct via Modbus RTU

Dit is de gewenste route, omdat Profinet niet gebruikt wordt. Voor de `-PN`
modules is dit echter nog niet bewezen. We moeten testen of de lokale IO van de
module als Modbus RTU slave bereikbaar is. Als dat niet zo is, zijn de `-PN`
modules zonder Profinet-controller waarschijnlijk niet geschikt voor directe
Fairino IO.

Fairino ondersteunt volgens de lokale documentatie robot Modbus RTU master. De
documentatie noemt bij Modbus RTU onder andere deze functiecodes:

- `0x01` Read Coils
- `0x02` Read Discrete Inputs
- `0x03` Read Holding Registers
- `0x04` Read Input Registers
- `0x05` Write Single Coil
- `0x06` Write Single Holding Register
- `0x0F` Write Multiple Coils
- `0x10` Write Multiple Holding Registers

De Fairino WebApp/Lua gebruikt hiervoor generieke RTU-registercommando's zoals:

- `ModbusRegRead(...)`
- `ModbusRegWrite(...)`

Daarnaast bestaan er robot ModbusRTU-slave aliascommando's zoals
`ModbusSlaveReadDI_RTU(...)` en `ModbusSlaveWriteDO_RTU(...)`; die zijn voor de
robot als slave. Voor deze IO-modules verwachten we juist robot als master en
M31 als slave, dus start met de master/register route.

Modbus TCP en Profinet blijven buiten scope voor deze remote-IO migratie. Als
de `-PN` modules niet als Modbus RTU slave werken, is de praktische oplossing
een niet-PN M31 `...-U` Modbus TCP/RTU hostmodule of een aparte PLC/gateway.

## Huidige Fairino IO in project

De huidige robotcode gebruikt directe controller-DO's uit
[../../fairino/source/config.lua](../../fairino/source/config.lua):

| Signaal | Huidige DO | Functie |
| --- | ---: | --- |
| `DO_GRIPPER_CLOSE` | 0 | Grijper sluiten |
| `DO_CLAMP_CLOSE` | 1 | Klem sluiten |
| `DO_LAMP_GREEN` | 2 | Groene lamp |
| `DO_LAMP_ORANGE` | 3 | Oranje lamp |
| `DO_LAMP_RED` | 4 | Rode lamp |
| `DO_DEBUG_CLAMP_OK` | 5 | Simulator/debug |
| `DO_DEBUG_PICK_OK` | 6 | Simulator/debug |
| `DO_DEBUG_PLACE_ENTERED` | 7 | Simulator/debug |
| `DO_GLUE_TRIGGER` | 8 | Lijmtrigger |

De simulator-inputs staan nu nog als variabelen in
[../../fairino/source/io_sim.lua](../../fairino/source/io_sim.lua):

| Sim-input | Betekenis |
| --- | --- |
| `safety_ok` | Veiligheidsketen OK |
| `start` | Startknop |
| `reset` | Resetknop |
| `filter_present` | Filter aanwezig |
| `gripper_filter_present` | Filter in grijper |
| `clamp_closed` | Klem dicht |

Veiligheidsfuncties blijven buiten normale remote IO. Noodstop, veiligheidsstop
en veiligheidsrelais blijven bedraad volgens het veiligheidsconcept en mogen niet
als gewone software-IO worden vervangen.

## Eerste voorgestelde remote IO mapping

Deze tabel is een werkvoorstel. Pas de kanaalnummers en Modbus-adressen aan
zodra de echte registermap en de klemmen bekend zijn. Uitgangspunt:
`P31-XXAX00A0G-U` is de DO-hoofdmodule, en `AXXXA000G-U-PN` is de extra
inputmodule achter de hoofdmodule.

| Cel-signaal | Richting | Remote kanaal | Opmerking |
| --- | --- | --- | --- |
| Grijper sluiten | DO | Remote DO0 | Vervangt controller `DO0`. |
| Klem sluiten | DO | Remote DO1 | Vervangt controller `DO1`. |
| Groene lamp | DO | Remote DO2 | Vervangt controller `DO2`. |
| Oranje lamp | DO | Remote DO3 | Vervangt controller `DO3`. |
| Rode lamp | DO | Remote DO4 | Vervangt controller `DO4`. |
| Lijmtrigger | DO | Remote DO8 | Vervangt controller `DO8`, na elektrisch checken van ingangstype. |
| Startknop | DI | Remote DI0 | Alleen bediening, geen safety. |
| Resetknop | DI | Remote DI1 | Alleen bediening, geen safety. |
| Filter aanwezig | DI | Remote DI2 | Sensor. |
| Grijper filter aanwezig | DI | Remote DI3 | Sensor. |
| Klem dicht | DI | Remote DI4 | Sensor. |

## Testplan zodra hardware aanwezig is

1. Noteer van elke module: exacte typecode op label, MAC-adres, default IP en
   eventuele DIP-switch/status-led betekenis.
2. Voed module met 24 VDC of binnen toegestane `DC 9-36 V`. Controleer polariteit
   en gemeenschappelijke 0 V met de sensoren/actuatoren.
3. Koppel de input-uitbreiding fysiek aan de hoofdmodule volgens de M31-handleiding.
   Noteer welke zijde/connector de interne uitbreidingsbus gebruikt en welke
   connector RS485 A/B naar de Fairino is.
4. Verwacht volgens de officiele `-PN` docs geen USB-configpoort: de poorten die
   genoemd worden zijn RJ45/LAN1/LAN2 en RS485 A/B/G. Als USB-C fysiek aanwezig
   is maar Windows niets detecteert, behandel die voorlopig als service/ongebruikte
   interface en configureer via LAN of RS485.
5. Stel Modbus RTU-parameters vast. Startwaarden volgens de M31-documentatie
   voor de distributed IO masterlijn:
   - slave-id: `1`
   - baudrate: `9600`
   - databits: `8`
   - parity: `None`
   - stopbits: `1`
6. Bevestig daarna:
   - slave-id/adres
   - baudrate
   - parity
   - stopbits
   - registerbasis: 0-based of 1-based
   - functiecodes voor DI en DO
7. Test vanaf laptop met een USB-RS485 adapter:
   - lees DI met `0x02 Read Discrete Inputs` of `0x01 Read Coils`
   - schrijf DO met `0x05 Write Single Coil` of `0x0F Write Multiple Coils`
8. Lees alle 16 DI-kanalen uit en forceer per ingang een veilige testspanning.
9. Voor de DO-module: schrijf eerst zonder actuatorbelasting een testcoil en
   meet spanning/statusled. Pas daarna belasting aansluiten.
10. Configureer in Fairino WebApp een Modbus RTU master/register voor de module.
11. Voeg registers/aliases toe:
   - DI: discrete inputs of coils volgens M31-registermap.
   - DO: coils volgens M31-registermap.
12. Maak een minimale Lua-test met een unieke releasenaam. Eerste probe in dit
    project:
    [../../fairino/programs/releases/remote_io_rtu_probe_20260703_152609.lua](../../fairino/programs/releases/remote_io_rtu_probe_20260703_152609.lua)

   ```lua
   -- Concept voor Modbus RTU, pas functiecode/adres/registernaam aan in WebApp.
   -- Lees eerst 1 DI en schrijf 1 DO zonder actuatorbelasting.
   value1 = ModbusRegRead(0, "1", 1, "0", 0)
   ModbusRegWrite(0, "1", 1, {1}, "0", 0)
   WaitMs(300)
   ModbusRegWrite(0, "1", 1, {0}, "0", 0)
   ```

13. Pas pas daarna de productiecode aan door `SetDO(...)` en `sim_input(...)`
    achter kleine helperfuncties te zetten. Dan kunnen we wisselen tussen
    simulator, controller-IO en remote-IO zonder overal robotlogica te wijzigen.

## Nog open voordat we code omzetten

- Exacte registermap van de ontvangen modules bevestigen.
- Vaststellen welke module de RTU-hoofdmodule is en hoe de input-uitbreiding
  achter die hoofdmodule geadresseerd wordt.
- Bepalen welke Fairino `ModbusRegWrite` vorm op deze controller werkt:
  scalarwaarde `1` of tabelwaarde `{1}`.
- Elektrische uitgangstype checken: PNP/NPN, sourcing/sinking, maximale stroom
  per kanaal, vrije-loop diode bij spoelen/relais.
