# FAIRINO simulator overdracht voor Codex

Dit mapje bevat de context om met Codex verder te werken aan de FAIRINO robot simulator en het pick/place testprogramma.

## Simulator

- Web UI: `http://192.168.92.128`
- Login: `admin` / `123`
- Bekende versie in onze sessie: WebApp `V3.9.5`, robot `FR5 V6.0`
- Hoofdprogramma: `pick_place_basic.lua`

## Belangrijkste status

We hebben een basis pick/place programma gemaakt met vijf punten:

- `P_HOME`
- `P_PICK_APPROACH`
- `P_PICK`
- `P_PLACE_APPROACH`
- `P_PLACE`

De robot bewoog uiteindelijk goed nadat de punten opnieuw werden geimporteerd met passende jointwaarden. De eerdere fout:

```text
[Error] Joint command point error, can be reset
```

kwam waarschijnlijk door punten waarbij de Cartesian coordinaten en J1..J6 niet logisch bij elkaar pasten.

## Huidige IO-afspraak

Voor de grijper gebruiken we voorlopig `Ctrl-DO0`:

- `SetDO(0,0,0,0)` = grijper open
- `SetDO(0,1,0,0)` = grijper dicht

De actuele Lua staat in:

```text
programs/pick_place_basic.lua
```

Volgorde:

```lua
SetDO(0,0,0,0)
PTP(P_HOME,20,-1,0)
PTP(P_PICK_APPROACH,20,-1,0)
Lin(P_PICK,20,-1,0,0,0,0,0)
SetDO(0,1,0,0)
WaitMs(300)
Lin(P_PICK_APPROACH,20,-1,0,0,0,0,0)
PTP(P_PLACE_APPROACH,20,-1,0)
Lin(P_PLACE,20,-1,0,0,0,0,0)
SetDO(0,0,0,0)
WaitMs(300)
Lin(P_PLACE_APPROACH,20,-1,0,0,0,0,0)
PTP(P_HOME,20,-1,0)
```

## Punten importeren

De puntendatabase staat hier:

```text
points/web_point.db
```

Import in de FAIRINO UI:

1. Ga naar `Program -> Points`.
2. Kies `System mode`.
3. Klik op de importknop boven de puntentabel.
4. Selecteer `points/web_point.db`.
5. Controleer dat de UI `Import successful` meldt.

Let op: de import verwacht dat het bestand exact `web_point.db` heet.

## Programma laden of herstellen

In de simulator kun je de Lua-code via `Program -> Coding` openen/importeren. De grafische Blockly-workspace en de `.lua` zijn in deze webapp niet altijd dezelfde opslaglaag. Als de grafische pagina niet meteen de IO-blokken toont, controleer dan de Lua-code zelf in `Program -> Coding`.

De webapp gebruikt voor grafische programma's intern een Blockly JSON/XML workspace. In onze laatste stap stond de Lua al goed, maar de zichtbare Graphical workspace bleef nog oud/leeg totdat hij correct werd geladen.

## Belangrijke documenten

- `FAIRINO_pick_place_werkwijze.md`: onze volledige werkwijze en lessen uit de sessie.
- `docs_fairino/points.html`: FAIRINO documentatie over points.
- `docs_fairino/graphical_programming.html`: FAIRINO documentatie over graphical programming.
- `docs_fairino/manual_teaching.html`: FAIRINO documentatie over teaching.
- `docs_fairino/robot_io_registers.html`: FAIRINO documentatie over IO.
- `docs_fairino/frlua_programming_script_manual.pdf`: Lua/programmeerhandleiding.

## Aanbevolen prompt voor collega Codex

```text
Ik werk met de FAIRINO robot simulator op http://192.168.92.128.
Login is admin / 123.
Lees eerst README_START_HIER.md en FAIRINO_pick_place_werkwijze.md in deze map.
Doel: verder werken aan pick_place_basic.lua, met punten uit points/web_point.db en Ctrl-DO0 als grijperoutput.
Werk zoveel mogelijk via de web UI zodat het tegelijk een tutorial blijft.
```

