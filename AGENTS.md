# FAIRINO project instructions

## Centrale shared-data-integratie

Gebruik voor iedere FAIRINO → elektrisch-schema-app-overdracht uitsluitend:

- repository: `https://github.com/daanlangelaan/SHARED_DATA_SCHEMA_FAIRINO`;
- tag: `v0.1.0-rc.21`;
- commit: `c80b519b553f996b1710b2f7cbcb91b39b75d8bb`;
- contract: `contracts/v3/fairino-io-handoff.schema.json`.

De volledige pin en centrale documentpaden staan in
`config/shared-data-release-lock.json`. Volg nooit stilzwijgend `main` of een
nieuwere release. Lokale historische overdrachtsdocumenten, YAML-bestanden en
Word-documenten in deze FAIRINO-repository zijn geen contract- of
eigenaarsbron.

Lees vóór het maken of wijzigen van een overdracht uit de gepinde centrale
release volledig:

1. `contracts/v3/fairino-io-handoff.schema.json`;
2. `docs/HANDOFF_OWNERSHIP.md`;
3. `docs/CONSUMER_INTEGRATION.md`;
4. `examples/fairino-io-handoff-v3-existing-project.example.json` voor de huidige cel;
5. `examples/fairino-io-handoff-v3.example.json` voor toekomstige nieuwbouw;
6. `catalog/catalog.json` voor permanente IDs, versies, poorten en assets.

## Huidige robotcel

- Gebruik `flow.mode: existing-schema-project`.
- Gebruik `schemaAppAction: apply-field-device-data-preserve-existing-cabinet`.
- Robotplatform is uitsluitend `FAIRINO` / `FR5`.
- Lees of analyseer geen projectbestand van de elektrisch-schema-app.
- Selecteer uitsluitend procesgebonden veldapparaten uit de centrale catalogus.
- Een bestaande M31 mag alleen als controller-eindpunt in een I/O-toewijzing
  voorkomen, nooit als door FAIRINO geselecteerd veldapparaat.
- Lever geen kastinterne componenten, locaties, apparaatnamen, IEC-klassen,
  definitieve apparaatcodes, kabelcodes, adercodes of klemnummers.
- Laat de elektrisch-schema-app de aangeleverde veldapparaten en I/O-data in de
  bestaande kast verwerken zonder de bestaande kastconfiguratie te vervangen.

## Toegestane overdrachtsdata

Lever per werkelijk geselecteerd veldapparaat alleen de velden die het centrale
V3-contract toestaat, waaronder:

- vaste logische `id`;
- permanente `libraryItemId` en `libraryVersion`;
- `functionDescription`;
- indien vereist `catalogReviewAcceptance: accepted-for-project-use`.

Lever per I/O-toewijzing:

- vaste logische `id`;
- `direction`, `signalName` en `description`;
- apparaatpoort via permanente `portIds`;
- bestaand controller-eindpunt met `controllerId`, `channelId` en expliciet
  benoemde adresruimten;
- `safeState` indien relevant.

Neem geen onbevestigde of gereserveerde apparaten op en verzin geen
`pending-*`-IDs. Valideer iedere payload tegen het centrale V3 JSON Schema én
tegen de catalogus uit exact de gepinde release.
