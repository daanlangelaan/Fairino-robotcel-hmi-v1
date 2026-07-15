# Remote IO Modbus RTU startcheck

Gebruik deze checklist voordat we de Fairino IO naar de M31 remote IO verplaatsen.
Profinet gebruiken we niet.

## Hardware op tafel

1. 24 VDC voeding op de M31 hoofdmodule.
2. 0 V van voeding, sensoren en actuatoren gemeenschappelijk maken waar nodig.
3. Input-uitbreiding mechanisch/elektrisch aan de hoofdmodule koppelen volgens
   M31-handleiding.
4. RS485 A/B van de hoofdmodule naar laptop USB-RS485 of Fairino RS485.
5. USB-C op de module gebruiken als configuratie/service-interface als de
   CDSENET/Ebyte configuratiesoftware de module zo herkent. Dit is niet de
   runtime Modbus RTU-bus; die loopt via RS485 A/B/G.
6. Geen actuatorbelasting aansluiten tijdens de eerste DO-write test; alleen LED
   of meter gebruiken.

## Gegevens invullen

| Parameter | Waarde |
| --- | --- |
| Hoofdmodule type | `M31-XXAX00A0G-U-PN` |
| Input uitbreiding type | `AXXXA000G-U-PN` |
| Slave id | Startwaarde volgens M31-doc: `1` |
| Baudrate | Startwaarde volgens M31-doc: `9600` |
| Databits | 8 |
| Parity | Startwaarde volgens M31-doc: `None` |
| Stopbits | Startwaarde volgens M31-doc: `1` |
| DI startadres | Nog te meten |
| DO startadres | Nog te meten |
| Registerbasis | 0-based of 1-based nog te meten |

## USB/driver check

Als Windows niets laat zien bij het inpluggen van USB-C:

1. Controleer in `Apparaatbeheer` ook onder `Universal Serial Bus controllers`
   en `Other devices`, niet alleen onder `Ports (COM & LPT)`.
2. Verwacht bij veel Ebyte/Chinese USB-serieel interfaces iets als
   `USB-SERIAL CH340`, `USB-SERIAL CH341`, `USB Serial Device` of `USB2.0-Serial`.
3. Als er helemaal niets verschijnt, probeer alsnog een andere kabel/poort en
   controleer of de module 24 V houdt.
4. Als er een onbekend apparaat verschijnt, installeer de WCH CH340/CH341 driver:
   `https://www.wch-ic.com/downloads/CH341SER_EXE.html`
5. Als er nog steeds geen USB-apparaat verschijnt, gebruik de RS485-klemmen met
   een losse USB-RS485 adapter. De M31-handleiding toont testen via USB-naar-RS485.

## DIP switches

Volgens de M31-handleiding vormen de 4 DIP-switches het hardwaredeel van het
Modbus-adres:

- standaard hardware address: `0`
- standaard software offset address: `1`
- totaal device/slave address: hardware address + software offset address
- standaard totaaladres: `1`
- DIP-bitwaarde: `1`, `2`, `4`, `8`

Laat de DIP-switches eerst op fabrieksstand staan. Alleen aanpassen als we
meerdere modules op dezelfde RS485-bus zetten of als slave-id `1` al bezet is.

## Laptop eerst

1. Test RS485 met een laptop-tool voordat de robot master wordt.
2. Lees DI met `0x02 Read Discrete Inputs`. Als dat niets geeft, probeer
   `0x01 Read Coils`.
3. Schrijf DO0 zonder belasting met `0x05 Write Single Coil`.
4. Als single coil werkt, test `0x0F Write Multiple Coils` voor meerdere outputs.
5. Noteer de werkende slave-id, functiecode en adresbasis in deze file.

## Fairino daarna

1. WebApp: `Program Teaching` -> `ModbusRTU Settings`.
2. `Master Settings` -> `Add Modbus Master`.
3. Zet baudrate, databits, parity en stopbits gelijk aan de module. Begin met
   `9600`, `8`, `None`, `1` als de module nog op fabrieksinstellingen staat.
4. Voeg minimaal toe:
   - DI-read register: functie `0x02` of `0x01`, startadres DI0, quantity 1.
   - DO-write register: functie `0x05`, startadres DO0, quantity 1.
5. Gebruik de probe:
   [../../fairino/programs/releases/remote_io_rtu_probe_20260703_152609.lua](../../fairino/programs/releases/remote_io_rtu_probe_20260703_152609.lua)
6. Als `ModbusRegWrite(..., 1, ...)` niet werkt, maak een tweede probe met
   `ModbusRegWrite(..., {1}, ...)`.

## Stop bij

- Onbekende registermap.
- Geen stabiele RS485 communicatie op laptop.
- Onzekerheid over A/B polariteit of 0 V referentie.
- DO-test met echte actuatorbelasting voordat de LED/meter-test werkt.
- Safety-signalen die per ongeluk naar normale remote IO dreigen te gaan.
