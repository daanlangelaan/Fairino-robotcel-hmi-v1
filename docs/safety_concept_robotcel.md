# Safetyconcept robotcel Fairino FR5

Status: voorlopig concept, nog geen formele CE-validatie.

## Doel

Een machinebrede veiligheidsketen voor de robotcel maken waarbij een noodstop of toegang via het lichtscherm alle gevaarlijke beweging en energie veilig stopt:

- Fairino FR5 robot stoppen via de safety inputs.
- Pneumatiek veilig afschakelen en ontluchten waar nodig.
- Randapparatuur, zoals lijmmachine-enable of voeding, veilig uitschakelen.
- Herstart pas toestaan na handmatige reset en aparte start.

## Uitgangspunten cel

- Zijkant, achterkant en bovenkant zijn mechanisch dicht.
- Voorkant is beveiligd met een lichtscherm.
- Noodstop zit aan de voorkant.
- In de cel bevinden zich de robot en pneumatische actuatoren.
- Fairino POE safety/button box blijft aangesloten, maar wordt in productie niet als operator-noodstop gebruikt of wordt niet toegankelijk geplaatst.
- De externe cel-noodstop is de bedienbare machine-noodstop.

## Fairino safety-interface

Volgens Inlux/Fairino:

- De Fairino safety box moet aangesloten blijven; anders opent het circuit.
- Een externe noodstop kan via de Fairino `EI0/EI1` safety inputs worden gebruikt.
- De mini control box heeft emergency stop outputs:
  - `EST0-1` / `EST0-2`
  - `EST1-1` / `EST1-2`
- De mini control box heeft emergency stop inputs:
  - `EI0-1` / `EI0-2`
  - `EI1-1` / `EI1-2`
- De mini control box heeft protection stop inputs:
  - `SI0-1` / `SI0-2`
  - `SI1-1` / `SI1-2`
- De eerder gevonden `FR3MT&3C Base-Extension Module` is niet van toepassing op deze FR5-configuratie.

## Gekozen veiligheidsarchitectuur

De externe veiligheidsketen wordt leidend. Fairino safety outputs kunnen in de ingangsketen van het veiligheidsrelais worden opgenomen, zodat een Fairino noodstop ook de celveiligheid laat afvallen.

Concept:

```text
Externe cel-noodstop kanaal 1 -> Fairino EST0 -> safety relay input kanaal 1
Externe cel-noodstop kanaal 2 -> Fairino EST1 -> safety relay input kanaal 2

Lichtscherm OSSD1 -> safety relay input kanaal 1 of aparte safety-inputmodule
Lichtscherm OSSD2 -> safety relay input kanaal 2 of aparte safety-inputmodule

Safety relay output 1 -> K1 contactorspoel
Safety relay output 2 -> K2 contactorspoel

K1/K2 hoofdcontacten -> pneumatiek/lijm/randapparatuur enable uit
K1/K2 contacten -> Fairino EI0/EI1 openen
K1/K2 NC hulpcontacten -> safety relay feedback/EDM
```

Exacte aansluiting hangt af van het gekozen lichtscherm en het definitieve safety relay schema.

## Voorlopige onderdelen

### Safety relay

Omron `G9SE-201 DC24`

- 24 VDC.
- 2 safety outputs.
- `T11/T12`: safety input kanaal 1.
- `T21/T22`: safety input kanaal 2.
- `T31/T32/T33`: reset/feedback input.
- `13-14` en `23-24`: safety outputs.
- Manual reset gebruiken, geen auto reset.

### Contactoren

2x Schneider Electric TeSys D `LC1D126BLS207`

- 24 VDC spoel.
- 3 NO hoofdcontacten.
- 1 NO hulpcontact.
- 1 NC hulpcontact.
- NC hulpcontacten gebruiken voor EDM/feedback naar het safety relay.

### Noodstop

IDEM ES-serie twist-release noodstop, oppervlaktemontage, `2 NC / 1 NO`, IP67.

- Beide NC-contacten gebruiken voor de tweekanaals safetyketen.
- NO-contact eventueel alleen voor statusmelding, niet noodzakelijk voor safety.

## Conceptbedrading

### Safety input keten

```text
Kanaal 1:
G9SE input CH1 -> externe noodstop NC1 -> Fairino EST0 -> G9SE return CH1

Kanaal 2:
G9SE input CH2 -> externe noodstop NC2 -> Fairino EST1 -> G9SE return CH2
```

Lichtscherm moet ook tweekanaals/OSSD in de safetyfunctie worden opgenomen. Dit kan afhankelijk van het lichtscherm en relay-schema in dezelfde ingangsketen of via een geschikt veiligheidsrelais met OSSD-ingangen.

### Safety outputs

```text
G9SE output 13-14 -> K1 spoel
G9SE output 23-24 -> K2 spoel
```

### Contactors

```text
+24V -> K1 NO -> K2 NO -> pneumatiek enable / dumpventiel
+24V -> K1 NO -> K2 NO -> lijmmachine enable / relais
+24V -> K1 NO -> K2 NO -> reserve / extra actuator enable
```

Fairino `EI0/EI1` worden ook door de safetyketen geopend. Dit kan via extra contacten of via de contactoren, volgens het Fairino schema voor dual-channel emergency stop input.

### EDM / reset

```text
K1 NC hulpcontact -> K2 NC hulpcontact -> resetknop -> G9SE T31/T32/T33 feedback-reset input
```

Gedrag:

- Noodstop of lichtscherm actief: G9SE valt af, K1/K2 vallen af.
- Noodstop/lightscherm vrij: G9SE blijft afgevallen.
- Resetknop indrukken: G9SE controleert feedback en schakelt pas weer in als de keten gezond is.
- Reset mag nooit automatisch een cyclus starten.

Dit betreft de fysieke safety-reset van de G9SE. De afzonderlijke HMI-knop
`Reset` is een procesherstelcommando: die wist een resetbare
controllerfout en start daarna bewust het geladen Lua-programma in automatische
modus. Daardoor kan direct beweging ontstaan, waaronder de initiale home-beweging.
De HMI-knop mag niet als safety-reset worden gebruikt en kan een actieve
hardware-safetyketen niet omzeilen.

## Voorlopige risicobeoordeling

| Gevaar | Mogelijk letsel | Risico zonder maatregel | Maatregel | Voorlopig PLr |
| --- | --- | --- | --- | --- |
| Robot raakt of klemt persoon bij toegang via voorkant | Ernstig letsel | Hoog | Lichtscherm stopt robot en actuatoren | PL d, mogelijk PL e afhankelijk gebruik |
| Onverwacht herstarten na noodstop/lichtscherm | Ernstig letsel | Hoog | Manual reset + aparte start | Onderdeel van SF1/SF2 |
| Pneumatische actuator klemt hand | Licht tot ernstig letsel | Middel/hoog | Ventiel-enable uit en waar nodig ontluchten | PL c/d |
| Robot blijft actief na safety-event | Ernstig letsel | Hoog | Fairino `EI0/EI1` door safetyketen openen | PL d |
| K1/K2 contactor blijft plakken | Ernstig letsel bij herstart | Middel | Redundante contactoren + EDM via NC hulpcontacten | PL d |
| Omzeilen of bereiken langs lichtscherm | Ernstig letsel | Hoog | Vaste afscherming, correcte lichtschermhoogte en afstand | PL d/e |
| Restdruk pneumatiek na noodstop | Klemmen of onverwachte beweging | Middel | Safety dump valve of veilige ontluchting beoordelen | PL c/d |

## Safetyfuncties

### SF1 - Noodstop cel

Activering door:

- Externe cel-noodstop.
- Fairino emergency stop output `EST0/EST1`.

Resultaat:

- Safety relay valt af.
- K1/K2 vallen af.
- Pneumatiek en randapparatuur worden uitgeschakeld.
- Fairino `EI0/EI1` opent.

Voorlopig doel: `PL d`, Category 3.

### SF2 - Lichtscherm voorkant

Activering door:

- Onderbreking lichtscherm aan de voorkant.

Resultaat:

- Robot en gevaarlijke actuatoren stoppen.
- Geen automatische herstart.
- Reset buiten de cel met zicht op gevarenzone.

Voorlopig doel: `PL d`; `PL e` beoordelen afhankelijk van toegangscyclus, snelheid en risico.

### SF3 - Pneumatische energie veilig afschakelen

Activering door:

- SF1 of SF2.

Resultaat:

- Ventiel-enable uit.
- Waar nodig lucht dumpen/ontluchten.
- Geen gevaarlijke beweging door restdruk.

Voorlopig doel: `PL c/d`, afhankelijk van kracht en knelgevaar.

### SF4 - Herstartbeveiliging

Activering door:

- Terugkeer uit noodstop of lichtschermonderbreking.

Resultaat:

- Manual reset vereist.
- Daarna aparte start vereist.
- Reset start geen beweging.

Deze eis geldt voor de fysieke safety-reset. Na vrijgave van de safetyketen is
`Reset` op de HMI een afzonderlijke, bewust bediende startactie die
wel beweging kan starten; de gevarenzone moet dus vooraf volledig vrij zijn.

## Open punten

- Exact type lichtscherm kiezen en datasheet/certificaat opnemen.
- Veilige afstand lichtscherm berekenen op basis van stoptijd robot + safetyketen.
- Controleren of lichtscherm direct op G9SE kan of een ander safety relay/inputmodule nodig is.
- Definitieve Fairino `EI0/EI1` en `EST0/EST1` bedrading tekenen volgens Fairino schema.
- Pneumatiek beoordelen: is alleen ventiel-enable uit voldoende, of is een safety dump valve nodig?
- K1/K2 contactbelasting en hulpcontacten controleren in Schneider datasheet.
- G9SE manual-reset/feedback schema definitief overnemen uit Omron datasheet.
- Validatietestplan maken:
  - noodstop extern;
  - Fairino noodstop;
  - lichtscherm;
  - K1 vastgeplakt simuleren;
  - K2 vastgeplakt simuleren;
  - spanningsuitval en herstel;
  - reset zonder start;
  - herstart alleen via aparte start.
- SISTEMA/PAScal berekening maken wanneer de definitieve componenten vastliggen.

## Normatieve richting

Voor formele uitwerking rekening houden met onder andere:

- EN ISO 12100 - risicobeoordeling en risicoreductie.
- EN ISO 13849-1/-2 - safety-related control systems en validatie.
- EN ISO 10218-1/-2 - robots en robot systems/integration.
- IEC 61496 - electro-sensitive protective equipment, zoals lichtschermen.
- ISO 13855 - positionering/afstand van beschermende voorzieningen.
