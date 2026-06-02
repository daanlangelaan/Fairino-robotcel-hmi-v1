# Fairino VM + HMI Recovery Runbook

Dit document beschrijft hoe de Fairino SimMachine VM, Lua-cycle en lokale HMI weer werkend zijn gemaakt na een verse VM uitpak/herinstall. Gebruik dit als checklist wanneer de VM opnieuw wordt uitgepakt, een snapshot wordt teruggezet, of de HMI geen heartbeat/status meer ziet.

## Werkende Situatie

- Fairino VM IP: `192.168.92.130`
- Fairino Modbus TCP slave: `192.168.92.130:502`
- Lokale HMI: `http://127.0.0.1:8787/`
- HMI bridge mode: `modbus`
- Actieve Lua build met reset/home recovery: `mini_cell_a_cycle_order_hmi_reset_home_20260602_120909.lua`
- Laatste bron-build: [fairino/source/build_variant.ps1](../fairino/source/build_variant.ps1)

De HMI gebruikt alleen Modbus voor celbediening. De HMI Start-knop schrijft dus `HMI_START_REQ`; hij start niet zelf het Fairino teaching-programma via de WebApp API. Het Fairino Lua-programma moet eerst draaien en in `S30_WAIT_START` staan.

## Belangrijk Concept

De verse VM heeft standaard Modbus slave aliases zoals `DI0`, `DO0`, `AI0`, `AO0`. Onze Lua gebruikt named aliases zoals `HMI_START_REQ` en `CELL_ROBOT_HEARTBEAT`.

Als die aliases niet in de VM staan, krijg je errors zoals:

```text
failed to query the database (the data does not exist)
```

De register-adressen zijn:

- `DI0` = coil address `100`
- `DO0` = discrete input address `100`
- `AI0` = holding register address `100`
- `AO0` = input register address `100`

Zie ook [docs/hmi_modbus_register_map.md](./hmi_modbus_register_map.md).

## Herstelstappen Na Verse VM

1. Start de Fairino VM.

2. Controleer het IP in de VM via `get_ip` of de terminal. Pas commando's hieronder aan als het IP anders is.

3. Herstel de Modbus slave aliases:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\fairino\tools\restore_hmi_modbus_aliases.ps1 -FairinoHost 192.168.92.130
```

Verwachte output bevat:

```text
DI0-5:  HMI_START_REQ, HMI_RESET_REQ, HMI_STOP_REQ, HMI_AUTO_MODE_REQ, HMI_ACK_REQ, HMI_ESTOP_REQ
AI0-2:  HMI_BATCH_TARGET, HMI_HEARTBEAT, HMI_RECIPE
DO0-8:  CELL_READY, CELL_RUNNING, CELL_FAULT_ACTIVE, CELL_SAFETY_OK, CELL_GLUE_ACTIVE, CELL_CLAMP_CLOSED, CELL_GRIPPER_OK, CELL_BATCH_COMPLETE, CELL_COMMS_OK
AO0-5:  CELL_STATE, CELL_FAULT_CODE, CELL_CYCLE_COUNT, CELL_BATCH_TARGET_ECHO, CELL_BATCH_DONE, CELL_ROBOT_HEARTBEAT
```

4. Importeer de juiste point table in Fairino.

De file moet in de WebApp importdialoog als `web_point.db` worden gekozen/geupload. Als je een backupbestand gebruikt, pak de gewenste database en zorg dat hij als `web_point.db` wordt geimporteerd.

5. Bouw een nieuwe HMI Lua release:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\fairino\source\build_variant.ps1 -Variant a_cycle_order_hmi_batch_continue -EnableHmiModbus
```

6. Upload en open de gegenereerde release in Fairino.

Gebruik de nieuwste file onder:

```text
fairino/programs/releases/mini_cell_a_cycle_order_hmi_batch_continue_*.lua
```

Openen moet `success` geven. Als er een database error komt, zijn de aliases of points nog niet goed.

7. Start de lokale HMI bridge in Modbus mode:

```powershell
$env:HMI_BRIDGE_MODE='modbus'
$env:FAIRINO_HOST='192.168.92.130'
node hmi\server.mjs
```

Als je de gebundelde Codex Node runtime gebruikt:

```powershell
$env:HMI_BRIDGE_MODE='modbus'
$env:FAIRINO_HOST='192.168.92.130'
& 'C:\Users\Daan\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' hmi\server.mjs
```

8. Open de HMI:

```text
http://127.0.0.1:8787/
```

9. Start het Fairino teaching-programma zelf vanuit de WebApp.

Belangrijk: de HMI Start-knop start daarna alleen de cyclus via Modbus. Het Lua-programma moet dus al draaien en wachten in `S30_WAIT_START`.

## Online Verificatie

In de HMI bovenin staan twee lampjes:

- `Modbus`: lokale bridge heeft TCP-verbinding met Fairino Modbus port `502`.
- `Robot HB`: Lua status-loop schrijft `CELL_ROBOT_HEARTBEAT` en statusregisters.

Een gezonde ready toestand ziet er ongeveer zo uit:

```text
Bridge Modbus online
CELL_STATE = 30
CELL_READY = 1
CELL_RUNNING = 0
CELL_FAULT_CODE = 0
CELL_ROBOT_HEARTBEAT loopt op
```

Na Start vanuit de HMI:

```text
HMI_START_REQ pulse gaat kort naar 1
CELL_STATE loopt door de cyclus, bijvoorbeeld 60, 70, 100, ...
CELL_RUNNING = 1 tijdens beweging
CELL_CYCLE_COUNT telt op na een complete cyclus
```

Bij batch run:

```text
Na S170/S180 gaat de state-machine direct door naar S40/S50/S60 voor de volgende filter.
Hij gaat niet eerst terug naar home of S30 zolang CELL_CYCLE_COUNT < HMI_BATCH_TARGET.
Wanneer CELL_CYCLE_COUNT == HMI_BATCH_TARGET wordt CELL_STATE = 850 en CELL_BATCH_COMPLETE = 1.
Voor het zetten van S850 beweegt de robot terug naar home.
Reset zet de batch teller terug naar 0 en brengt de cel via S00_INIT/home terug naar S30_WAIT_START.
```

Bij Stop vanuit de HMI:

```text
HMI_STOP_REQ gaat naar 1 en blijft hoog staan.
Lua maakt de lopende cyclus af.
Na S180/S190 start Lua geen volgende filter, maar gaat terug naar S30_WAIT_START.
Reset of een nieuwe start zet HMI_STOP_REQ terug naar 0.
```

Bij Noodstop vanuit de HMI:

```text
HMI_ESTOP_REQ gaat naar 1 en blijft hoog staan.
Lua gaat naar S990_SAFETY_STOP, zet outputs uit en meldt foutcode 991.
Reset zet HMI_ESTOP_REQ terug naar 0 en mag pas terug naar init als de safety-conditie weer OK is.
De lokale HMI bridge start het Fairino teaching-programma opnieuw wanneer dit door de noodstop was gestopt; Lua gaat dan via S00_INIT naar home en daarna naar ready.
```

Snelle check via PowerShell:

```powershell
(Invoke-WebRequest -Uri 'http://127.0.0.1:8787/api/registers' -UseBasicParsing).Content
```

## Veelgemaakte Fouten

### Modbus lamp aan, Robot HB uit

De bridge kan Fairino bereiken, maar de Lua status-loop draait niet of schrijft niet.

Controleer:

- Staat het juiste HMI Lua-programma geladen?
- Is het teaching-programma echt gestart in Fairino?
- Staat Fairino in automatische/run mode?
- Zijn de Modbus aliases hersteld?
- Is er een Lua/database error bij het openen?

### HMI Start doet niets

De HMI Start-knop is bewust puur Modbus. Hij pulse't `HMI_START_REQ`, maar start niet het Fairino teaching-programma zelf.

Controleer:

- `CELL_STATE` moet eerst `30` zijn.
- `CELL_READY` moet `1` zijn.
- `CELL_ROBOT_HEARTBEAT` moet oplopen.

Als dat niet zo is, draait het Lua-programma nog niet goed.

### Lua opent niet: database data does not exist

Meestal ontbreekt een alias of point.

Doe opnieuw:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\fairino\tools\restore_hmi_modbus_aliases.ps1 -FairinoHost 192.168.92.130
```

Controleer daarna of de point table correct is geimporteerd.

### Verkeerde build actief

Tijdens herstel draaide Fairino nog een oude `hmi_do_status` build. Daardoor was Modbus TCP wel online, maar de AO-registers bleven `0`.

Gebruik de HMI Modbus batch-continuation build:

```text
mini_cell_a_cycle_order_hmi_batch_continue_*.lua
```

## Snapshot Advies

Maak een VMware snapshot op deze momenten:

1. Verse VM werkt, WebApp bereikbaar, nog zonder projectwijzigingen.
2. Modbus aliases en point table hersteld.
3. Lua geladen, HMI online, `Robot HB` loopt en Start vanuit HMI werkt.

Geef snapshots duidelijke namen, bijvoorbeeld:

```text
clean-working-webapp-vm
hmi-modbus-aliases-points-loaded
hmi-online-cycle-start-tested
```

## Gewijzigde Projectbestanden

- [fairino/tools/restore_hmi_modbus_aliases.ps1](../fairino/tools/restore_hmi_modbus_aliases.ps1): zet alle Modbus slave aliases terug in de VM.
- [fairino/source/hmi_modbus.lua](../fairino/source/hmi_modbus.lua): leest HMI commands en schrijft status/heartbeat via named Modbus aliases.
- [hmi/server.mjs](../hmi/server.mjs): lokale browser-HMI bridge naar Modbus TCP, registermap vanaf address `100`.
- [hmi/index.html](../hmi/index.html), [hmi/app.js](../hmi/app.js), [hmi/styles.css](../hmi/styles.css): tonen Modbus- en Robot-heartbeat lampjes.

## Ontwerpkeuze

De HMI blijft Pi-ready:

```text
Pi/browser HMI -> Modbus TCP -> Fairino slave registers -> Lua state machine
```

Geen WebApp API is nodig voor normale HMI-bediening. De WebApp API is alleen handig tijdens ontwikkeling voor uploaden/openen/starten van een testprogramma.

## Demo-Speed Variant

Voor klantdemo's is er een snellere testbuild gemaakt:

```text
mini_cell_a_cycle_order_hmi_customer_demo_speed_20260529_133702.lua
```

Deze build gebruikt nog steeds de Fairino global speed override bovenin de WebApp. Bij global speed `100%` zijn de effectieve programma-snelheden ongeveer:

| Staptype | Lua speed |
| --- | ---: |
| Home | `50` |
| Transport | `55` |
| Approach | `40` |
| Pick/place/contact | `25` |
| Retract | `40` |
| Droogrij index | `35` |
| Glue/J6 beweging | `20` |

Als de global speed bovenin Fairino op `50%` staat, halveert dit effectief. Bijvoorbeeld transport `55` wordt dan ongeveer `27.5%`.
