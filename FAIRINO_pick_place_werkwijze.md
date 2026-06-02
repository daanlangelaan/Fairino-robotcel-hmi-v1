# FAIRINO pick/place werkwijze

Dit document beschrijft wat we in de FAIRINO robot simulator hebben gedaan en wat de juiste route is om punten en het grafische programma later opnieuw te maken of te herstellen.

## Simulator

- Web UI: `http://192.168.92.128`
- Login: `admin` / `123`
- Robot/model in simulator: FR5 / WebApp V3.9.5
- Programma: `pick_place_basic.lua`

## Status programma met IO

Het programma `pick_place_basic.lua` is op de controller opgeslagen met IO-regels voor een eenvoudige grijper/vacuumtest:

```lua
SetDO(0,0,0,0)              -- Ctrl-DO0 open/uit
PTP(P_HOME,20,-1,0)
PTP(P_PICK_APPROACH,20,-1,0)
Lin(P_PICK,20,-1,0,0)
SetDO(0,1,0,0)              -- Ctrl-DO0 dicht/aan bij pick
WaitMs(300)
Lin(P_PICK_APPROACH,20,-1,0,0)
PTP(P_PLACE_APPROACH,20,-1,0)
Lin(P_PLACE,20,-1,0,0)
SetDO(0,0,0,0)              -- Ctrl-DO0 open/uit bij place
WaitMs(300)
Lin(P_PLACE_APPROACH,20,-1,0,0)
PTP(P_HOME,20,-1,0)
```

Let op: `Program -> Graphical` toont mogelijk nog de oude Blockly-workspace zonder IO-blokken. De Lua op de controller is wel bijgewerkt. Controleer de inhoud via `Program -> Coding` of door het programma uit de controller terug te lezen.

## Belangrijke les over teaching points

In `Program -> Points` staan twee knoppen rechts per punt:

- Ronde pijl: **Overwrite Points**
  - Dit is niet om handmatig ingevulde coordinaten op te slaan.
  - Deze knop overschrijft het punt met de huidige robotpositie.
  - De popup zegt daarom dat bestaande teaching points worden overschreven.
- Potlood: **X,Y,Z,RX,RY,RZ,V**
  - Dit is bedoeld om gewijzigde puntwaarden te bevestigen.
  - De webapp rekent hierbij via `ModifyTeachPoint(...)` ook de jointwaarden door.

De documentatie zegt dat je `X/Y/Z/RX/RY/RZ/V` in de tabel kunt wijzigen en daarna de wijziging bevestigt. In deze simulator bleek direct typen in de tabel onhandig/onbetrouwbaar. Daarom hebben we de importroute gebruikt.

## Import/export route voor punten

De importknop in `System mode` accepteert alleen een SQLite databasebestand met exact deze naam:

```text
web_point.db
```

De database heeft tabel `points` met onder andere:

```text
name, speed, elbow_speed, acc, elbow_acc, toolnum, workpiecenum,
j1, j2, j3, j4, j5, j6,
E1, E2, E3, E4,
x, y, z, rx, ry, rz
```

Gebruikte bestanden:

- Export/origineel onderzoek: `docs/fairino/web_point_export.db`
- Gecorrigeerde import: `docs/fairino/web_point.db`

UI importstappen:

1. Ga naar `Program -> Points`.
2. Kies `System mode`.
3. Klik de linker importknop boven de tabel.
4. Selecteer `C:\softwarebuilds\fairinoproject\docs\fairino\web_point.db`.
5. Controleer dat de UI `Import successful` meldt.

## Handmatig een punt teachen

Normaal wordt een teaching point niet primair gemaakt door losse coordinaten in de puntentabel te typen. De gebruikelijke werkwijze is:

1. Beweeg de robot naar de gewenste positie.
2. Sla de huidige robotpositie op als punt.
3. Gebruik dat punt daarna in het programma.

Bij een echte robot doe je stap 1 door te joggen of door de robot handmatig/drag-teaching naar de positie te brengen.

In de simulator geldt hetzelfde principe, maar dan met de virtuele arm:

1. Ga naar `Initial` / robotinstellingen en gebruik de robotbeweging-interface.
2. Beweeg de virtuele arm naar de gewenste positie.
   - Dit kan via jointwaarden.
   - Of via tool/TCP coordinaten, bijvoorbeeld `X/Y/Z/RX/RY/RZ`, daarna `Calculate` en `Move`.
3. Ga daarna naar de robot supporting functies / `Point name`.
4. Vul de gewenste puntnaam in.
5. Sla de huidige robotpositie op als teaching point.

Voor een bestaand punt kun je in `Program -> Points` ook de ronde pijl **Overwrite Points** gebruiken. Die knop schrijft de huidige robotpositie over het gekozen punt heen. Dat is dus handig nadat de virtuele arm goed staat, maar niet bedoeld als "handmatig ingevoerde tabelwaarden opslaan".

Kort gezegd:

- Nieuwe of realistische punten maken: robot/simulatorarm bewegen en positie opslaan.
- Bestaande punten opnieuw teachen: arm bewegen en **Overwrite Points** gebruiken.
- Bulk of herstel: `web_point.db` import/export gebruiken.

## Teaching points

Na import horen deze punten aanwezig te zijn:

| Punt | X | Y | Z | RX | RY | RZ |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `P_HOME` | 109.954 | -527.277 | 489.037 | 90.060 | -7.375 | -5.558 |
| `P_PICK_APPROACH` | 117.527 | -685.042 | 489.037 | 88.382 | -7.336 | 1.059 |
| `P_PICK` | 117.527 | -685.042 | 242.379 | 88.382 | -7.336 | 1.059 |
| `P_PLACE_APPROACH` | -330.321 | -615.766 | 486.410 | 89.273 | -7.370 | -38.311 |
| `P_PLACE` | -330.321 | -615.766 | 224.583 | 89.273 | -7.370 | -38.311 |

De bedoeling:

- `P_PICK_APPROACH` staat recht boven `P_PICK`.
- `P_PLACE_APPROACH` staat recht boven `P_PLACE`.
- De verticale bewegingen worden dus met `LIN` gedaan.
- De verplaatsingen tussen stations worden met `PTP` gedaan.

## Grafisch programma

Ga naar:

```text
Program -> Graphical
```

Programmanaam:

```text
pick_place_basic
```

Gewenste volgorde:

```lua
PTP(P_HOME,20,-1,0)
PTP(P_PICK_APPROACH,20,-1,0)
Lin(P_PICK,20,-1,0,0)
WaitMs(300)
Lin(P_PICK_APPROACH,20,-1,0,0)
PTP(P_PLACE_APPROACH,20,-1,0)
Lin(P_PLACE,20,-1,0,0)
WaitMs(300)
Lin(P_PLACE_APPROACH,20,-1,0,0)
PTP(P_HOME,20,-1,0)
```

Bewegingsprincipe:

- Naar bovenpositie: `PTP` / `MoveJ`
- Laatste stuk omlaag: `LIN` / `MoveL`
- Laatste stuk omhoog: `LIN` / `MoveL`
- Tussen stations: `PTP` / `MoveJ`

Dus niet met `PTP` schuin door het product bewegen.

## Klein PTP-testprogramma

Voor een eerste afspeeltest hebben we ook een extra klein programma gemaakt:

```text
pick_place_jog_test.lua
```

Lokale kopie:

```text
C:\softwarebuilds\fairinoproject\pick_place_jog_test.lua
```

In de simulator is hetzelfde programma opgeslagen als `pick_place_jog_test.lua`.

Code:

```lua
PTP(P_HOME,20,-1,0)
PTP(P_PICK,20,-1,0)
WaitMs(300)
PTP(P_PLACE,20,-1,0)
WaitMs(300)
PTP(P_HOME,20,-1,0)
```

Deze eerste test gebruikt bewust alleen `PTP`, zodat we eerst controleren of:

- het programma correct geladen wordt;
- de puntnamen gevonden worden;
- de simulator de robot laat bewegen;
- de run/stop/reset-flow werkt.

Daarna maken we de meer correcte pick/place-beweging met `PTP` naar approach-punten en `LIN` omlaag/omhoog.

## Numeric MoveJ-testprogramma

Als `PTP(P_HOME,...)` of `PTP(P_PICK,...)` de fout `Joint command point error` geeft, dan kan de runtime moeite hebben met point-name lookup of met de puntdata zoals die in de point database staat.

Daarom is er een tweede test gemaakt die expliciet de joint- en TCP-waarden meegeeft:

```text
pick_place_movej_test.lua
```

Lokale kopie:

```text
C:\softwarebuilds\fairinoproject\pick_place_movej_test.lua
```

In de simulator is hetzelfde programma opgeslagen als `pick_place_movej_test.lua`.

Deze vorm lijkt op de `MoveJ(...)` code die de simulator zelf genereert bij directe robotbewegingen:

```lua
MoveJ(j1,j2,j3,j4,j5,j6,x,y,z,rx,ry,rz,tool,wobj,speed,acc,ovl,0,0,0,0,0,0,0,0,0,0,0,0)
```

Voor de eerste numeric test worden alleen `P_HOME`, `P_PICK`, `P_PLACE`, en terug naar `P_HOME` gebruikt.

## Testprocedure

1. Controleer in `Program -> Points` dat de vijf `P_*` punten correct zijn.
2. Ga naar `Program -> Graphical`.
3. Open of controleer `pick_place_basic.lua`.
4. Zet de snelheid laag, bijvoorbeeld `10%` of `20%`.
5. Zet de robot in de juiste mode voor programma-run.
6. Reset eventuele oude alarmen met `Clear`.
7. Klik pas daarna op `Play`.

## Volgende stap: I/O toevoegen

Als de beweging klopt, kan de eerste echte pick/place-versie worden:

```text
Wait DI_part_present
MoveJ P_PICK_APPROACH
MoveL P_PICK
Set DO_gripper ON
Wait DI_part_gripped
MoveL P_PICK_APPROACH
MoveJ P_PLACE_APPROACH
MoveL P_PLACE
Set DO_gripper OFF
MoveL P_PLACE_APPROACH
MoveJ P_HOME
```

Voorlopige I/O-afspraak:

- `DO1` = grijper/vacuum aan
- `DO2` = grijper/vacuum uit
- `DI1` = onderdeel aanwezig
- `DI2` = vacuum OK / part picked

## Valkuilen

- De waarden in de Code Translation zoals `20,-1,0` zijn geen coordinaten.
  - `20` is snelheid.
  - `-1` en `0` zijn motion parameters zoals blend/radius/offset.
  - De echte coordinaten zitten in de teaching points.
- De ronde pijl rechts in de puntenrij is overwrite met huidige robotpositie.
- Import in System mode verwacht exact `web_point.db`.
- Point Table mode is een ander mechanisme dan System mode; voor dit programma gebruiken we System mode.

## Correctie na `Joint command point error`

De fout `Joint command point error, can be reset` ontstond doordat sommige punten gemengde data hadden: X/Y/Z/RX/RY/RZ van de ene pose, maar J1..J6 van een andere pose. De controller controleert of de jointpositie en TCP-positie bij elkaar horen. Als dat niet klopt, stopt hij met deze fout.

De oplossing was: punten niet handmatig combineren, maar de simulator/controller zelf de jointwaarden laten berekenen met `TCFToJoint`.

Gecorrigeerde testpunten:

| Punt | X | Y | Z | RX | RY | RZ | J1 | J2 | J3 | J4 | J5 | J6 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| P_HOME | -497.000 | -130.000 | 477.000 | 180.000 | 0.000 | 90.000 | 0.000 | -90.000 | 90.000 | -90.000 | -90.000 | 0.000 |
| P_PICK_APPROACH | -497.000 | -260.000 | 450.000 | 180.000 | 0.000 | 90.000 | 14.214 | -83.330 | 86.831 | -93.501 | -90.000 | 14.214 |
| P_PICK | -497.000 | -260.000 | 300.000 | 180.000 | 0.000 | 90.000 | 14.214 | -78.296 | 103.493 | -115.197 | -90.000 | 14.214 |
| P_PLACE_APPROACH | -300.000 | -260.000 | 450.000 | 180.000 | 0.000 | 90.000 | 21.799 | -106.653 | 107.984 | -91.331 | -90.000 | 21.799 |
| P_PLACE | -300.000 | -260.000 | 300.000 | 180.000 | 0.000 | 90.000 | 21.799 | -101.415 | 126.681 | -115.266 | -90.000 | 21.799 |

Het actieve testprogramma is opgeslagen als `pick_place_basic.lua`. In de IO-versie gebruiken we `Ctrl-DO0` als grijperuitgang:

- `SetDO(0,0,0,0)` = grijper open
- `SetDO(0,1,0,0)` = grijper dicht

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

Testnotitie: een losse beweging naar `P_PICK` met de gecorrigeerde waarden liep zonder alarm. Het programma startte daarna ook zonder `cmdpointerror`; bij controle stond het op regel 3, de eerste LIN-beweging omlaag. Omdat LIN hier 20 mm/s gebruikt en de verticale slag 150 mm is, duurt dat zichtbaar langer dan de PTP-bewegingen.
