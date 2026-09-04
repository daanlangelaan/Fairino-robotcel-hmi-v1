# M31 productie-I/O

> Automatisch gegenereerd uit `specs/fairino-field-device-handoff-v4-existing-project.json`. Niet handmatig wijzigen.

Centrale bron: SHARED_DATA_SCHEMA_FAIRINO 0.1.0-rc.23, commit `fd26d46cdb2bc23d41874e210aa2ed4791e793a7`.

Alle gewone proces-I/O loopt uitsluitend via M31. M31-host DI1 blijft gereserveerd voor bestaande safetydiagnose en is geen safetybesturing of FAIRINO-veldapparaat.

## Digitale uitgangen

| Apparaatnaam | Proceslocatie | Functie | Signaalnaam | Fysiek kanaal | Modbusadres (0-based) | Library-item |
| --- | --- | --- | --- | --- | ---: | --- |
| Magneetventiel 1 | Grijper | Opent en sluit de pneumatische productgrijper | DO_GRIPPER_CLOSE | M31 DO-uitbreiding DO1 | 0 | heschen-4v210-08-dc24v v2 |
| Magneetventiel 2 | Filterklem | Klemt het filter vast en geeft het weer vrij | DO_CLAMP_CLOSE | M31 DO-uitbreiding DO2 | 1 | heschen-4v210-08-dc24v v2 |
| Signaaltoren 1 | Robotcel | Geeft de machine-status visueel en akoestisch weer | DO_LAMP_GREEN | M31 DO-uitbreiding DO3 | 2 | zdnyi-dh50-4w-j-signal-tower v2 |
| Signaaltoren 1 | Robotcel | Geeft de machine-status visueel en akoestisch weer | DO_LAMP_ORANGE | M31 DO-uitbreiding DO4 | 3 | zdnyi-dh50-4w-j-signal-tower v2 |
| Signaaltoren 1 | Robotcel | Geeft de machine-status visueel en akoestisch weer | DO_LAMP_RED | M31 DO-uitbreiding DO5 | 4 | zdnyi-dh50-4w-j-signal-tower v2 |
| Magneetventiel 3 | Keerkleppers | Beweegt de perscilinder voor het inpersen van de keerklep | DO_CHECK_VALVE_PRESS | M31 DO-uitbreiding DO6 | 5 | heschen-4v210-08-dc24v v2 |
| Magneetventiel 4 | Keerklepdispenser | Bedient de geteste gecombineerde keerkleptoevoer en vrijgave | DO_CHECK_VALVE_FEED | M31 DO-uitbreiding DO7 | 6 | heschen-4v210-08-dc24v v2 |
| Lijmdispenser 1 | Lijmstation | Doseert lijm na een potentiaalvrij extern startsignaal | DO_GLUE_TRIGGER | M31 DO-uitbreiding DO8 | 7 | unbranded-mt-410-peristaltic-dispenser v2 |
| Signaaltoren 1 | Robotcel | Geeft de machine-status visueel en akoestisch weer | DO_LAMP_BLUE | M31 DO-uitbreiding DO9 | 8 | zdnyi-dh50-4w-j-signal-tower v2 |
| Signaaltoren 1 | Robotcel | Geeft de machine-status visueel en akoestisch weer | DO_BUZZER | M31 DO-uitbreiding DO10 | 9 | zdnyi-dh50-4w-j-signal-tower v2 |

## Digitale ingangen

| Apparaatnaam | Proceslocatie | Functie | Signaalnaam | Fysiek kanaal | Modbusadres (0-based) | Library-item |
| --- | --- | --- | --- | --- | ---: | --- |
| Glasvezelsensor 1 | Keerklep-pickpositie | Detecteert of een keerklep gereedligt op de pickpositie | DI_CHECK_VALVE_PICK_PRESENT | M31 DI-host DI2 | 1 | gtric-e3x-na41 v2 |
| Cilindersensor 1 | Grijper | Detecteert dat de grijpercilinder volledig geopend is | DI_GRIPPER_OPEN | M31 DI-host DI3 | 2 | dmsh-pnp-magnetic-cylinder-sensor v1 |
| Cilindersensor 2 | Grijper | Detecteert de afgestelde grijpercilinderstand voor een correct geklemd filter | DI_GRIPPER_FILTER_POSITION | M31 DI-host DI4 | 3 | dmsh-pnp-magnetic-cylinder-sensor v1 |
| Cilindersensor 3 | Grijper | Detecteert de afgestelde grijpercilinderstand voor een correct geklemde keerklep | DI_GRIPPER_CHECK_VALVE_POSITION | M31 DI-host DI5 | 4 | dmsh-pnp-magnetic-cylinder-sensor v1 |
| Cilindersensor 4 | Filterklem | Detecteert de volledig geopende eindstand van de filterklem | DI_FILTER_CLAMP_OPEN | M31 DI-host DI6 | 5 | dmsh-pnp-magnetic-cylinder-sensor v1 |
| Cilindersensor 5 | Filterklem | Detecteert de volledig gesloten eindstand van de filterklem | DI_FILTER_CLAMP_CLOSED | M31 DI-host DI7 | 6 | dmsh-pnp-magnetic-cylinder-sensor v1 |
| Cilindersensor 6 | Keerkleppers | Detecteert de teruggetrokken thuisstand van de perscilinder | DI_PRESS_HOME | M31 DI-host DI8 | 7 | dmsh-pnp-magnetic-cylinder-sensor v1 |
| Cilindersensor 7 | Keerkleppers | Detecteert de volledig ingeperste eindstand van de perscilinder | DI_PRESS_INSERTED | M31 DI-host DI9 | 8 | dmsh-pnp-magnetic-cylinder-sensor v1 |
| Cilindersensor 8 | Keerklepschuif | Detecteert de volledig geopende eindstand van de keerklepschuif | DI_CHECK_VALVE_GATE_OPEN | M31 DI-host DI10 | 9 | dmsh-pnp-magnetic-cylinder-sensor v1 |
| Cilindersensor 9 | Keerklepschuif | Detecteert de volledig gesloten eindstand van de keerklepschuif | DI_CHECK_VALVE_GATE_CLOSED | M31 DI-host DI11 | 10 | dmsh-pnp-magnetic-cylinder-sensor v1 |
| Druksensor 1 | Pneumatische hoofdtoevoer | Bewaakt of voldoende persluchtdruk voor de machine beschikbaar is | DI_AIR_PRESSURE_OK | M31 DI-host DI12 | 11 | ifm-pn3094-pressure-sensor v1 |
| Glasvezelsensor 2 | Droog- en afvoerpositie | Detecteert of een product aanwezig is op de droog- en afvoerpositie | DI_DRYING_POSITION_OCCUPIED | M31 DI-host DI13 | 12 | gtric-e3x-na41 v2 |
| Fotocelsensor 1 | Filterdispenser 1 | Detecteert of een filter beschikbaar is in filterdispenser 1 | DI_FILTER_DISPENSER_1_PRESENT | M31 DI-uitbreiding DI1 | 16 | gtric-e3f-18s10n1 v1 |
| Fotocelsensor 2 | Filterdispenser 2 | Detecteert of een filter beschikbaar is in filterdispenser 2 | DI_FILTER_DISPENSER_2_PRESENT | M31 DI-uitbreiding DI2 | 17 | gtric-e3f-18s10n1 v1 |
| Fotocelsensor 3 | Filterdispenser 3 | Detecteert of een filter beschikbaar is in filterdispenser 3 | DI_FILTER_DISPENSER_3_PRESENT | M31 DI-uitbreiding DI3 | 18 | gtric-e3f-18s10n1 v1 |
| Fotocelsensor 4 | Filterdispenser 4 | Detecteert of een filter beschikbaar is in filterdispenser 4 | DI_FILTER_DISPENSER_4_PRESENT | M31 DI-uitbreiding DI4 | 19 | gtric-e3f-18s10n1 v1 |
| Fotocelsensor 5 | Filterdispenser 5 | Detecteert of een filter beschikbaar is in filterdispenser 5 | DI_FILTER_DISPENSER_5_PRESENT | M31 DI-uitbreiding DI5 | 20 | gtric-e3f-18s10n1 v1 |
| Fotocelsensor 6 | Filterdispenser 6 | Detecteert of een filter beschikbaar is in filterdispenser 6 | DI_FILTER_DISPENSER_6_PRESENT | M31 DI-uitbreiding DI6 | 21 | gtric-e3f-18s10n1 v1 |
