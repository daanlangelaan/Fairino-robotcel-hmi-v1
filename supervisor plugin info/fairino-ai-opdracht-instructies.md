# Opdracht Voor Fairino AI - Supervisor Plugin Discovery

Ik ben bezig met een overkoepelende engineeringtool: **Supervisor**.

Supervisor moet straks verschillende specialistische skills/plugins kunnen gebruiken. Het Fairino-project dat we nu hebben gedaan bevat eigenlijk twee losse plugins:

1. **Fairino robot controller plugin**
2. **Modbus HMI builder plugin**

Deze moeten bewust los van elkaar worden uitgewerkt.

De bedoeling is dat alles wat we in dit eerste project hebben ontdekt niet verloren gaat. We moeten dus per plugin vastleggen:

- welke inputdata de plugin nodig heeft;
- welke output de plugin moet maken;
- welke standaardmodules of herbruikbare functies erin zitten;
- welke projectdata generiek genoeg is voor Supervisor Core;
- welke data specifiek blijft voor de plugin;
- welke open vragen nog beantwoord moeten worden.

---

## Deel 1 - Fairino Robot Controller Plugin

Maak een duidelijke plugin-specificatie voor de Fairino robot controller.

Deze plugin moet op basis van Supervisor projectdata Fairino robotbesturing kunnen voorbereiden of genereren.

Beschrijf minimaal:

- welke processtappen de plugin nodig heeft;
- welke robotacties per stap nodig zijn;
- welke I/O-koppelingen nodig zijn;
- welke handshakes nodig zijn tussen Supervisor/HMI/PLC/robot;
- welke robotstatussen gemonitord moeten worden;
- welke alarmen/fouten/diagnoses beschikbaar moeten zijn;
- welke parameters of recepten invloed hebben op robotprogramma's;
- welke Fairino-specifieke instellingen nodig zijn;
- welke data nodig is om Fairino Lua-code te genereren;
- welke data nodig is om een point-bestand te genereren;
- welke outputbestanden de plugin moet opleveren;
- welke onderdelen project-specifiek zijn;
- welke onderdelen herbruikbaar zijn voor volgende Fairino projecten.

Voorbeelden van inputdata:

- processtappen;
- robotposities/points;
- tool/frame data;
- I/O signalen;
- Modbus/register mappings indien relevant;
- start/stop/reset handshakes;
- robot ready/busy/fault states;
- recepten/productvarianten;
- veiligheidsstatussen die alleen gemonitord worden.

Voorbeelden van output:

- Fairino Lua-code;
- point-bestand;
- robot-programmastructuur;
- I/O mapping document;
- status/alarm mapping;
- test- of commissioning checklist.

Belangrijk:

De plugin mag Fairino-specifieke kennis bevatten, maar Supervisor Core moet generiek blijven.

Dus: geef expliciet aan welke velden echt generiek in Supervisor thuishoren en welke velden alleen in de Fairino plugin namespace thuishoren.

---

## Deel 2 - Modbus HMI Builder Plugin

Maak daarnaast een aparte plugin-specificatie voor de HMI.

De HMI mag niet verstopt zitten in de Fairino robot plugin.

Deze plugin moet op basis van Supervisor projectdata een herbruikbare Modbus HMI kunnen maken of configureren.

Beschrijf minimaal:

- wat de operator moet kunnen bedienen;
- wat de operator moet kunnen monitoren;
- welke machine-statussen zichtbaar moeten zijn;
- welke robotstatussen zichtbaar moeten zijn;
- welke handmatige bedieningen nodig zijn;
- welke servicefuncties nodig zijn;
- welke alarmen en meldingen getoond worden;
- welke instellingen/recepten bedienbaar zijn;
- welke Modbus registers/coils nodig zijn;
- welke standaard HMI-modules herbruikbaar zijn;
- welke schermen project-specifiek zijn;
- welke permissieniveaus nodig zijn;
- welke data de HMI plugin nodig heeft vanuit Supervisor.

Voorbeelden van herbruikbare HMI-modules:

- start/stop/reset module;
- machine status module;
- robot status module;
- alarmoverzicht;
- handbediening;
- I/O monitor;
- recept/parameter scherm;
- service/diagnose scherm;
- communicatie-status scherm;
- productie/statistiek scherm.

Voorbeelden van output:

- HMI project/configuratie;
- Modbus mapping;
- schermstructuur;
- widget/component lijst;
- alarm mapping;
- gebruikersrechten/permissies;
- test- of commissioning checklist.

Belangrijk:

De HMI plugin moet zoveel mogelijk herbruikbare modules opslaan, zodat we bij een volgend project niet opnieuw vanaf nul beginnen.

---

## Deel 3 - Gezamenlijke Interface Tussen Plugins

Beschrijf ook welke data beide plugins delen.

Bijvoorbeeld:

- processtappen;
- robot status;
- robot commands;
- I/O signalen;
- alarmen;
- Modbus mappings;
- recepten;
- runtime states;
- commissioning tests.

Geef aan:

- welke data door Supervisor Core beheerd moet worden;
- welke data door de Fairino plugin beheerd wordt;
- welke data door de HMI plugin beheerd wordt;
- welke data alleen gegenereerde output is;
- welke data later in een release manifest moet komen.

---

## Deel 4 - Gevraagde Output Van Jou

Lever de analyse op in deze structuur:

1. `fairino-robot-controller-plugin.md`
2. `modbus-hmi-builder-plugin.md`
3. `shared-supervisor-data-requirements.md`
4. lijst met open vragen
5. lijst met herbruikbare modules
6. lijst met data die volgens jou in Supervisor Core moet komen
7. lijst met data die plugin-specifiek moet blijven

Schrijf praktisch en concreet.

Gebruik het eerste project als bron van waarheid voor wat we al ontdekt hebben.

Als iets onzeker is, markeer het als open vraag in plaats van het zelf in te vullen.

