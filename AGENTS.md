# FAIRINO project instructions

## Centrale shared-data-integratie

Gebruik voor iedere FAIRINO → elektrisch-schema-app-overdracht uitsluitend:

- repository: `https://github.com/daanlangelaan/SHARED_DATA_SCHEMA_FAIRINO`;
- tag: `v0.1.0-rc.23`;
- commit: `fd26d46cdb2bc23d41874e210aa2ed4791e793a7`;
- contract: `contracts/v4/fairino-field-device-handoff.schema.json`.

De volledige pin en centrale documentpaden staan in
`config/shared-data-release-lock.json`. Volg nooit stilzwijgend `main` of een
nieuwere release. Lokale historische overdrachtsdocumenten, YAML-bestanden en
Word-documenten in deze FAIRINO-repository zijn geen contract- of
eigenaarsbron.

Lees vóór het maken of wijzigen van een overdracht uit de gepinde centrale
release volledig:

1. `contracts/v4/fairino-field-device-handoff.schema.json`;
2. `docs/HANDOFF_OWNERSHIP.md`;
3. `docs/CONSUMER_INTEGRATION.md`;
4. `examples/fairino-field-device-handoff-v4-existing-project.example.json` voor de huidige cel;
5. `examples/fairino-field-device-handoff-v4.example.json` voor toekomstige nieuwbouw;
6. `catalog/catalog.json` voor permanente IDs, versies, poorten en assets.

## Huidige robotcel

- Gebruik `projectMode: existing-schema-project`.
- Robotplatform is uitsluitend `FAIRINO` / `FR5`.
- Lees of analyseer geen projectbestand van de elektrisch-schema-app.
- Selecteer uitsluitend procesgebonden veldapparaten uit de centrale catalogus.
- Een bestaande M31 mag alleen als controller-eindpunt in een I/O-toewijzing
  voorkomen, nooit als door FAIRINO geselecteerd veldapparaat.
- Lever geen kastinterne componenten, kastlocaties, IEC-klassen,
  definitieve apparaatcodes, kabelcodes, adercodes of klemnummers.
- Laat de elektrisch-schema-app de aangeleverde veldapparaten en I/O-data in de
  bestaande kast verwerken zonder de bestaande kastconfiguratie te vervangen.
- Wijs alle gewone proces-I/O van de definitieve machine uitsluitend toe aan de
  M31-host of M31-uitbreidingen. Gebruik geen directe FAIRINO-controller-I/O en
  geen `fairino-mirror`-adressen in de productieoverdracht.
- Safetyfuncties lopen niet via gewone M31-I/O. Een eventuele M31-ingang voor
  safetystatus is uitsluitend diagnose en blijft eigendom van de schema-app.

## Toegestane overdrachtsdata

Lever per werkelijk geselecteerd veldapparaat alleen de velden die het centrale
V4-contract toestaat, waaronder:

- vaste logische `id`;
- `deviceName` als fysiek apparaattype met een vast positief volgnummer, uniek
  binnen het project;
- functionele `processLocation`;
- permanente `libraryItemId` en `libraryVersion`;
- `functionDescription`;
- indien vereist `catalogReviewAcceptance: accepted-for-project-use`.

Lever ieder I/O-signaal rechtstreeks in `fieldDevices[].io`:

- `direction`, unieke `signalName` en zo nodig `signalDescription`;
- apparaatpoort via permanente `devicePortIds`;
- `assignmentStatus: assigned` voor de definitieve machine;
- M31-controller-eindpunt met `controllerId`, `channelId` en expliciet benoemde
  adresruimten;
- `safeState` indien relevant.

Neem geen onbevestigde of gereserveerde apparaten op en verzin geen
`pending-*`-IDs. Valideer iedere payload tegen het centrale V4 JSON Schema én
tegen de catalogus uit exact de gepinde release.
