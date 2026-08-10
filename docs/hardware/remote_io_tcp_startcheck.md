# M31 Remote IO - Modbus TCP startcheck

Deze checklist hoort bij de nieuwe Modbus-set van 10 augustus 2026:

- host: `M31-AXXXA000G-U`, 16DI;
- DI-uitbreiding: `M31-GAXXXA000-U`, 16DI;
- DO-uitbreiding: `M31-GXXAX00A0-U`, 16DO.

## Voor inschakelen

- [ ] Modules spanningsloos koppelen; sliders daarna op `LOCK`.
- [ ] Host en uitbreidingen voeden volgens de M31-handleiding.
- [ ] Alle actuatorbelastingen van DO1-DO16 losgekoppeld.
- [ ] M31 en Fairino aangesloten op dezelfde Ethernet-switch.
- [ ] Safety-signalen blijven op het veiligheidsrelais/de veiligheidskring.

## M31-netwerk instellen

De fabrieksinstelling is `192.168.3.7/24`, TCP-server, poort `502`, DHCP uit
en Modbus unit-id `1`. De handleiding toont Configtool v1.2; Ebyte biedt
inmiddels **M31-U Distributed IO Configtool v1.3** aan. Het gecontroleerde
[officiële ZIP-pakket](./software/ebyte_m31_u_distributed_io_configtool_v1.3.zip)
staat lokaal in het project. Herkomst en checksums staan in de
[software-notitie](./software/README.md). De actuele download staat ook op de
officiële
[Ebyte-pagina voor distributed-I/O-downloads](https://www.ebyte.com/datadown/fengbushiIO.html).

Omdat de module al bereikbaar is op `192.168.3.7`, kan hij op dezelfde switch
blijven zitten. Stap 1 is alleen nodig wanneer de laptop nog geen adres of route
in `192.168.3.0/24` heeft.

1. Geef de laptop tijdelijk een adres in hetzelfde subnet, bijvoorbeeld
   `192.168.3.100/24`. Gebruik geen gateway.
2. Selecteer in Configtool `Ethernet`, kies de juiste netwerkkaart en klik
   `Search`.
3. Selecteer de M31 op `192.168.3.7` en open `Config`.
4. Stel de netwerkparameters in:

   | Parameter | Waarde voor deze cel |
   | --- | --- |
   | Work mode | `TCP Server` |
   | DHCP | `Disable` |
   | Local IP address | `192.168.58.7` |
   | Submask | `255.255.255.0` |
   | Local port | `502` |
   | Gateway | `0.0.0.0`; als de tool dit weigert: `192.168.58.1` |
   | Modbus on net | `Modbus TCP` |

5. Klik `Save` en wacht op de melding dat de parameters zijn opgeslagen.
6. Herstart de M31 met de knop `Reboot` of schakel alleen de M31-voeding uit
   en weer in. De wijziging wordt pas na de herstart actief.
7. Zet de laptop terug naar het celnetwerk, bijvoorbeeld `192.168.58.10/24`,
   en controleer:

   ```powershell
   ping 192.168.58.7
   Test-NetConnection 192.168.58.7 -Port 502
   ```

Na het opslaan valt de verbinding op `192.168.3.7` normaal direct of bij de
herstart weg. Dat is verwacht; zoek daarna op het nieuwe adres.

Laat de vier DIP-switches voor deze eerste TCP-test allemaal op `OFF`. Daarmee
blijft het hardware-adres `0` en, met de standaard software-offset `1`, de
Modbus unit-id `1`.

## Fairino Modbus TCP-master instellen

1. Open `Program Teaching` -> `ModbusTCP Settings`.
2. Kies `Master settings` -> `Add Modbus master station`.
3. Vul in:

   | Parameter | Waarde |
   | --- | --- |
   | Name | `M31_REMOTE_IO` |
   | Slave IP | `192.168.58.7` |
   | Port | `502` |
   | Slave station number | `1` |
   | Communication period | `100 ms` |
   | Timeout period | `1000 ms` |

4. Voeg twee masterregisters toe:

   | Type | Address number | Name | Gebruik |
   | --- | ---: | --- | --- |
   | `DO` | `0` | `M31_DO_0` | startpunt voor 16 coils |
   | `DI` | `0` | `M31_DI_0` | startpunt voor 32 discrete inputs |

5. Controleer dat de connection-status continu brandt. Knipperen wijst volgens
   de Fairino-handleiding meestal op een verkeerd registertype of adres.

## Laptop-/WebApp-test

1. Laat alle belastingen van de remote DO-klemmen los.
2. Schrijf in de Fairino masterpagina DO-adres `0` eerst naar `1` en direct
   terug naar `0`.
3. Controleer dat uitsluitend LED `DO1` aan en daarna weer uit gaat.
4. Activeer veilig één DI per keer en controleer:
   - host DI1-DI16 zijn adressen `0`-`15`;
   - uitbreiding DI1-DI16 zijn adressen `16`-`31`.
5. Stop bij time-outs, een verschoven adresmap of een uitgang die niet uitgaat.

## Standalone LED-test

Pas na bovenstaande controles:

1. Stop het productieprogramma.
2. Houd alle actuatorbelastingen losgekoppeld.
3. Start
   [remote_io_led_test.lua](../../fairino/programs/remote_io_led_test.lua).
4. Controleer DO1-DO16 één voor één; na afloop moeten alle LEDs uit zijn.

## Parallelle outputtest

Pas na een geslaagde losse LED-test:

1. Laat de bestaande Fairino-DO's aangesloten en leidend.
2. Laat de Remote-IO-DO's nog zonder actuatorbelasting.
3. Bouw met `-EnableRemoteIoOutputMirror` volgens
   [remote_io_cdsenet_m31.md](./remote_io_cdsenet_m31.md).
4. Vergelijk ieder gebruikt Fairino-uitgangskanaal met de overeenkomstige
   M31-LED.
5. Test ook robotstop, foutreset, programmasluiting en spanningsherstel.

## Stopvoorwaarden

- Geen stabiele Ethernet- of Modbus TCP-verbinding.
- Afwijking van de verwachte 32DI/16DO-adresmap.
- Een aangesloten actuator tijdens de LED-only test.
- Onbewezen actieve/inactieve polariteit of contactbelasting.
- Een safety-signaal dat naar gewone Remote IO dreigt te verhuizen.
