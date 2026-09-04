# Gebruikershandleiding Fairino robotcel HMI

- Status: levende gebruikershandleiding
- Laatste wijziging: 11 augustus 2026
- HMI-softwareversie: werkversie `main`
- Actief productieprogramma na M31-inbedrijfstelling: `mini_cell_production_m31_latest.lua`

## 1. Doel en doelgroep

Deze handleiding beschrijft de normale bediening van de Fairino FR5-robotcel
via de HMI. De HMI is de centrale bedieningsplek voor de operator; voor normale
productie is de Fairino WebApp niet nodig.

De handleiding is bedoeld voor geïnstrueerde operators. Instellingen op de
tabbladen **Troubleshoot** en **Advanced** zijn alleen bestemd voor technisch
personeel.

## 2. Belangrijke veiligheidsinformatie

> **Controleer vóór Cel inschakelen of Reset altijd dat niemand zich in de cel
> bevindt en dat de robot vrij kan bewegen. Beide knoppen kunnen het
> Lua-programma starten en de robot direct naar de homepositie laten bewegen.**

- De fysieke cel-noodstop, het lichtscherm en de veiligheidsketen blijven altijd
  leidend.
- De rode HMI-knop **Noodstop** stopt het Lua-programma softwarematig. Deze knop
  vervangt geen fysieke noodstop of gecertificeerde veiligheidsfunctie.
- Gebruik bij gevaar altijd de fysieke noodstop van de robotcel.
- De HMI kan een actieve hardwareveiligheid niet omzeilen.
- Start of reset de cel niet tijdens onderhoud, afstelling of wanneer iemand in
  de gevarenzone aanwezig is.
- Druk bij een mislukte reset niet herhaaldelijk zonder eerst de melding en de
  toestand van de cel te controleren.
- Gebruik een storingvideo uitsluitend om de oorzaak te onderzoeken. Het beeld
  is geen veiligheidsfunctie en bewijst nooit dat de cel vrij is.

## 3. Normale opstart na inschakelen

1. Controleer dat de cel vrij is en dat afscherming en veiligheidsvoorzieningen
   in orde zijn.
2. Schakel de robotcel en MiniPC volgens de lokale inschakelprocedure in.
3. Wacht totdat de HMI volledig zichtbaar is en de verbinding online meldt.
4. De HMI toont **Cel niet ingeschakeld**.
5. Controleer nogmaals dat de robot vrij kan bewegen.
6. Druk op **Cel inschakelen**.
7. De HMI controleert de foutstatus en het productieprogramma, zet de robot in
   automatische modus en start het Lua-programma.
8. Wacht totdat **Ready** verschijnt en de knop **Start** beschikbaar wordt.
9. Stel zo nodig het gewenste batchaantal in.
10. Druk op **Start** om de productiecyclus te beginnen.

De HMI meldt de cel pas als ingeschakeld wanneer:

- de controller geen fout meldt;
- de HMI-noodstop niet actief is;
- het juiste productieprogramma geladen is;
- de controller programmastatus `2` (running) meldt;
- de Lua-heartbeat aantoonbaar verandert.

Wanneer het juiste programma al draait, gebruikt de HMI dit programma zonder
een tweede startcommando te sturen.

Tijdens een productiecyclus werkt ieder blok in de procesflow als
voortgangsindicatie. Het actieve blok vult groen van links naar rechts op basis
van recent gemeten doorlooptijden van die specifieke robotstap. De HMI bewaart
de laatste zeven geldige metingen per stap en gebruikt de mediaan, zodat een
eenmalige vertraging de volgende cyclus niet vertekent. Afgeronde stappen blijven
volledig groen en toekomstige stappen blijven donker. De tekst blijft boven de
groene vulling zichtbaar.

## 4. Bedieningsknoppen

| Knop | Functie | Belangrijk gedrag |
| --- | --- | --- |
| **Cel inschakelen** | Maakt de robotcel gereed voor productie. | Controleert of laadt het juiste Lua-programma, kiest automatische modus en voert play uit. Kan direct een home-beweging veroorzaken. |
| **Start** | Start een productiecyclus. | Alleen beschikbaar nadat de cel gecontroleerd is ingeschakeld. Een eerdere Stop-aanvraag wordt opgeheven. |
| **Stop** | Vraagt een gecontroleerde productiestop aan. | De actieve cyclus wordt afgemaakt. De melding **Laatste cyclus wordt afgerond…** pulseert totdat de cyclus klaar is. Er wordt geen volgende cyclus gestart. |
| **Reset** | Herstelt een resetbare storing en start de robotruntime opnieuw. | Wist de controllerfout, controleert of laadt het productieprogramma, kiest automatische modus en voert play uit. Kan direct beweging veroorzaken. |
| **Noodstop** | Stopt het actieve Lua-programma direct via de controller. | Softwarematige programmastop; geen vervanging voor de fysieke cel-noodstop. Daarna is normaal **Reset** nodig. |
| **Batchwiel** | Kies het batchaantal door het wiel omhoog of omlaag te vegen. Een snelle veeg draait verder door. Tik op het middelste getal voor het numerieke toetsenblok. | Gebruik een waarde tussen 1 en 250. |
| **Instellen** | Slaat het gekozen batchaantal op. | Controleer vóór het instellen het getoonde doel. |

## 5. Betekenis van lampen en hoofdstatus

| Indicatie | Betekenis | Actie operator |
| --- | --- | --- |
| Rood knipperend, **Error** | Een controller-, proces- of HMI-noodstopfout is actief. | Lees foutcode en uitleg. Gebruik Reset alleen wanneer de HMI de storing als resetbaar toont; schakel anders technisch personeel in. |
| Oranje, **Ready** | Robotruntime is actief en de cel wacht op Start. | Controleer materiaal en batchaantal; druk daarna op Start. |
| Groen, **Draait** | Een productiecyclus is actief. | Houd de celstatus in de gaten. |
| **Cel niet ingeschakeld** | Het Lua-programma draait niet. | Controleer de cel en druk op Cel inschakelen. |
| **Laatste cyclus wordt afgerond…** | Stop is aangevraagd, maar de actieve cyclus is nog bezig. | Wacht totdat de cyclus gereed is. |
| **Batch klaar** | Het ingestelde batchdoel is bereikt. | Verwerk de gereedmelding en stel zo nodig een nieuw batchdoel in. |
| **Offline** | De HMI heeft geen verbinding met de bridge/controller. | Start niet; controleer voeding, netwerk en vraag technisch personeel om hulp. |
| **Modbus** / **Bridge Modbus** | Groen betekent dat de HMI-bridge via Modbus TCP met de Fairino-controller communiceert; rood betekent dat die verbinding ontbreekt. | Start niet wanneer een van deze verbindingen rood is. |
| **Camera** | Groen betekent dat de live camerabron online is; rood betekent dat deze niet bereikbaar is. | De camera is alleen voor diagnose en heeft geen veiligheidsfunctie. |
| **M31 remote IO** | Groen betekent dat de M31 Modbus TCP-service op het ingestelde netwerkadres bereikbaar is; rood betekent dat de M31 niet bereikbaar is. | Controleer voeding en netwerkverbinding voordat de cel wordt gebruikt. |
| **Lua communicatie ontbreekt** | De controller meldt het programma actief, maar de heartbeat verandert ook buiten de toegestane tijd voor een blokkerende robotbeweging niet. | Start niet; stop de runtime veilig en laat de communicatie controleren. |
| **Programma controleren** | Er is een ander Lua-programma geladen dan het vastgelegde productieprogramma. | Druk alleen bij een vrije cel op Cel inschakelen; de HMI probeert het juiste programma te laden. |
| **Programma gepauzeerd** | De controller meldt programmastatus `3`. | Laat technisch personeel het programma veilig stoppen voordat opnieuw wordt ingeschakeld. |

## 6. Gecontroleerd stoppen

Gebruik **Stop** voor een normale productiestop:

1. Druk eenmaal op **Stop**.
2. De melding **Laatste cyclus wordt afgerond…** verschijnt.
3. Laat de robot de actieve cyclus afmaken.
4. Wacht totdat de bewegingscyclus gestopt en de melding verdwenen is.

Gebruik de fysieke noodstop wanneer er onmiddellijk gevaar bestaat. Gebruik de
HMI-knop **Noodstop** alleen als softwarematige directe programmastop wanneer de
fysieke veiligheidssituatie dit toelaat.

## 7. Storing herstellen

### 7.1 Controllerstoring of asbotsing

De HMI vertaalt de door Fairino gedocumenteerde hoofd- en subfoutcodes naar een
Nederlandse omschrijving. Zo betekent `4/1` een botsing op as 1 en `4/2` een
botsing op as 2. De HMI toont ook of de fout volgens Fairino resetbaar is.

- Bij een resetbare storing blijft **Reset** beschikbaar en toont de HMI eerst
  welke oorzaak gecontroleerd moet worden.
- Bij een niet-resetbare, ongedocumenteerde of onbekende controllerstoring wordt
  **Reset geblokkeerd**. Schakel dan technisch personeel in.
- De operator hoeft voor storingsherstel de Fairino WebApp niet te openen.

1. Stop de werkzaamheden en controleer waar de robot contact heeft gemaakt.
2. Verwijder het obstakel of de oorzaak van de botsing.
3. Controleer dat de volledige robotbaan vrij is.
4. Zorg dat niemand zich in de cel bevindt.
5. Druk eenmaal op **Reset**.
6. Houd rekening met een directe home-beweging.
7. Als de grijper bij de storing gesloten was, blijft hij tijdens deze
   home-beweging gesloten en opent hij pas op home. Houd het opvangbakje bij
   home leeg en correct geplaatst.
8. Controleer dat de HMI weer **Ready** meldt voordat Start wordt gebruikt.

Deze productherstelvolgorde geldt niet als garantie bij een fysieke noodstop,
safety-stop of verlies van pneumatiek/voeding. De grijper is geen veiligheidsfunctie.

Wanneer Reset mislukt, lees dan de melding. Druk niet blind opnieuw; controleer
de foutstatus en raadpleeg technisch personeel wanneer de fout terugkomt.

### 7.2 HMI-noodstop gebruikt

1. Controleer waarom de softwarematige Noodstop is gebruikt.
2. Verhelp de oorzaak en maak de cel volledig vrij.
3. Controleer dat de fysieke veiligheidsketen gereed is.
4. Druk op **Reset** om de HMI-noodstop vrij te geven en de robotruntime opnieuw
   te starten.

### 7.3 Fysieke noodstop of lichtscherm actief geweest

1. Verhelp eerst de oorzaak van de veiligheidsstop.
2. Geef de fysieke noodstop of het lichtscherm alleen vrij volgens de lokale
   veiligheidsprocedure.
3. Voer de fysieke safety-reset uit wanneer het celontwerp dit vereist.
4. Controleer dat de cel leeg en veilig is.
5. Gebruik daarna pas **Reset** of **Cel inschakelen** op de HMI.

De HMI-reset is een procesherstel en is niet hetzelfde als de fysieke
veiligheidsreset.

### 7.4 Storingvideo terugkijken

Wanneer de video-optie door technisch personeel is vrijgegeven, start de HMI
automatisch een tijdelijke videobuffer zodra de productiecyclus begint. Alleen
de laatste ongeveer 120 seconden worden onthouden; er wordt geen audio opgenomen.

Bij een fout blijft de opname nog ongeveer 10 seconden lopen. Daarna stelt de
HMI het fragment in enkele seconden samen. De foutmelding verschijnt direct in
een venster. Sluit het venster met **×** om de melding over te slaan. Zodra de
bijbehorende opname gereed is, wordt **Bekijk storingvideo** actief. Met die knop
wordt hetzelfde venster groter en speelt de opname van deze specifieke storing
af. Eerdere opnames blijven op datum en tijd beschikbaar in **Camera**.

- Een normale cyclus zonder fout wordt niet bewaard.
- De bibliotheek bewaart standaard maximaal 50 storingen en maximaal 30 dagen;
  de oudste opname wordt automatisch verwijderd zodra een grens is bereikt.
- Een ontbrekende of mislukte opname verandert niets aan de robotstatus. Gebruik
  dan foutcode, melding en eventlog voor diagnose.
- Start, Reset en Cel inschakelen blijven lokale, bewuste bedienhandelingen. Een
  video is nooit voldoende om te bepalen dat de robot veilig kan bewegen.

## 8. Tabbladen voor technisch personeel

### Troubleshoot

Dit tabblad toont onder meer registers, actuele state, heartbeat en eventlog.
Gebruik het eventlog bij een storing om vast te stellen welke herstelstap is
mislukt.

- **Ack** bevestigt een melding via de procesbesturing.
- **Reset tellers** is een technische/mockfunctie. Gebruik deze niet om live
  productietellers te beheren; de robotcontroller kan de live tellerwaarde
  opnieuw aan de HMI doorgeven.
- **Desktop** sluit de HMI-weergave en gaat naar de MiniPC-desktop.

### Camera

Het lokale livebeeld staat uitsluitend op de **User**-pagina. Dit tabblad toont
alleen de storingsbibliotheek. Een rode stip betekent dat tijdens een
productiecyclus een tijdelijke buffer actief is; groen betekent dat opnames
beschikbaar zijn; oranje meldt een camerafout. De titel van iedere opname toont
datum en tijd; daaronder staan waar beschikbaar een thumbnail en foutomschrijving.
Gebruik **Video opnieuw laden** wanneer de browser het gekozen fragment niet
direct toont. Er wordt geen audio opgenomen.

De huidige HMI is alleen voor lokaal gebruik. Remote support mag later pas
worden vrijgegeven met persoonlijke accounts, rollen en logging. Start, Reset,
Cel inschakelen en andere beweging-activerende handelingen vereisen bovendien
lokale controle en bevestiging; livebeeld is daarvoor geen veiligheidsbewijs.

### Advanced

De outputtests kunnen fysieke uitgangen schakelen en aangesloten hardware
activeren. Gebruik deze functies uitsluitend door bevoegd technisch personeel,
met een vrijgemaakte cel en volgens de onderhoudsprocedure. De tests zijn tijdens
normale productie uitgeschakeld en worden geblokkeerd wanneer de cyclus draait.

## 9. Afsluiten en opnieuw starten

- Stop de productie gecontroleerd voordat de installatie wordt uitgeschakeld.
- Schakel de MiniPC of controller niet uit midden in een bewegingscyclus.
- Na een spanningsonderbreking start de HMI-service automatisch, maar de robot
  gaat niet automatisch bewegen.
- De operator moet na herstart bewust **Cel inschakelen** gebruiken.

## 10. Documentbeheer

Deze Markdown-handleiding in de Git-workspace is de actuele bron. Iedere
wijziging aan knoppen, statusteksten, foutafhandeling of normale bediening moet
in dezelfde softwarecommit ook in deze handleiding worden verwerkt.

Bij een formele vrijgave kan van deze bron een PDF- of Word-versie met vast
versienummer worden gemaakt. De gegenereerde uitgave is dan een momentopname;
de Markdown-versie blijft leidend voor verdere ontwikkeling.

### Wijzigingshistorie

| Datum | Softwareversie | Wijziging handleiding |
| --- | --- | --- |
| 2026-08-11 | werkversie `main` | Heartbeatbewaking houdt tijdens een actieve cyclus rekening met blokkerende Fairino-bewegingen, zodat geen kortstondige valse communicatiemelding ontstaat. |
| 2026-08-11 | werkversie `main` | Alle gedocumenteerde Fairino hoofd-/subfoutcodes krijgen Nederlandse HMI-tekst; Reset wordt geblokkeerd wanneer een controllerfout niet als resetbaar is gedocumenteerd. |
| 2026-08-21 | werkversie `main` | Storingsbibliotheek uitgebreid naar 120 s vóór en 10 s na de fout. |
| 2026-08-11 | werkversie `main` | Live Full-HD camerabeeld en een begrensde storingsbibliotheek toegevoegd. |
| 2026-08-10 | `04e0ba9` | Eerste gebruikershandleiding: centrale celopstart, normale bediening, Stop, Reset, softwarematige Noodstop, statussen en foutafhandeling. |
