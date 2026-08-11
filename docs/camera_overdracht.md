# Overdracht camera en storingvideo

Status op 11 augustus 2026: de eerste lokale camera-integratie is geïmplementeerd,
op de Fairino MiniPC uitgerold en in de fysieke HMI visueel getest. Deze notitie is
bedoeld als startpunt voor een nieuwe Codex-taak op de MiniPC.

## Huidige werking

- De tab **Camera** toont het livebeeld van de aangesloten Jieli USB-camera.
- De camera wordt één keer geopend door `fairino-camera`; de HMI en recorder
  gebruiken de gedeelde MJPEG-bron via loopback op `127.0.0.1:8788`.
- Opname start bij de opgaande flank van `CELL_RUNNING`.
- Er blijft ongeveer 60 seconden video vóór een fout beschikbaar en er wordt na
  een opgaande `CELL_FAULT_ACTIVE` nog 10 seconden opgenomen.
- Een normale cyclus zonder fout wordt niet bewaard.
- Storingsopnamen worden als MP4 met JSON-metadata en normaal een thumbnail
  opgeslagen. De bibliotheek is begrensd op 50 opnamen en 30 dagen.
- Er wordt Full HD `1920x1080` opgenomen zonder audio.
- Camerafouten zijn uitsluitend diagnostisch en veranderen de robotbesturing niet.

## Bevestigde teststatus

- Livebeeld is fysiek zichtbaar gemaakt in de HMI. De camera kijkt tijdens deze
  test nog hoofdzakelijk naar het plafond/dakraam en moet later definitief worden
  gericht.
- De HMI rapporteerde tijdens de visuele test ongeveer 22 fps bij `1920x1080`.
- De Camera-tab kan rechtstreeks worden geopend met `?tab=camera`.
- De eerder vastgelopen laadweergave is verholpen door `.hidden` altijd
  `display: none !important` te laten toepassen en door versiegebonden CSS/JS te
  laden.
- De Lua-productiecyclus was bij de laatste test gestopt (`programState=1`). Start
  die niet automatisch: robotbeweging vereist lokale veiligheidscontrole en een
  bewuste bedienhandeling.

## Belangrijke bestanden

- `hmi/camera-source.mjs`: lokale camerabron en statuscontrole.
- `hmi/cycle-video-recorder.mjs`: ringbuffer, foutclip en retentie.
- `hmi/server.mjs`: camera-API, live proxy en read-only videobestanden.
- `hmi/app.js`, `hmi/index.html`, `hmi/styles.css`: Camera-tab en bibliotheek.
- `deploy/systemd/fairino-camera.service`: geharde, loopback-only cameraservice.
- `deploy/systemd/fairino-hmi.env.example`: alle camera-instellingen.
- `tests/camera-source.test.mjs` en `tests/cycle-video-recorder.test.mjs`: tests.

## MiniPC-runtime

De productie-instellingen en opnamen staan bewust niet in Git:

- `/etc/fairino-hmi.env`
- `/var/lib/fairino-hmi/camera`
- de geïnstalleerde systemd-units en browserprofielen

Controleer bij vervolgwerk eerst read-only:

```bash
systemctl status fairino-camera fairino-hmi --no-pager
journalctl -u fairino-camera -u fairino-hmi -n 100 --no-pager
curl -fsS http://127.0.0.1:8787/api/camera/status
curl -fsS http://127.0.0.1:8788/state
```

## Veiligheids- en netwerkgrenzen

- Livebeeld en storingvideo zijn geen veiligheidsfunctie en mogen nooit worden
  gebruikt om vast te stellen dat de cel veilig of vrij is.
- Laat zowel cameraservice als gecombineerde HMI op loopback gebonden. De HMI
  heeft bediening die toestand kan wijzigen en mag niet rechtstreeks worden
  geportforward of op een onbeveiligd netwerk worden gepubliceerd.
- Remote support vereist later versleuteling, persoonlijke accounts, rollen,
  sessie- en auditlogging en een aparte read-only videorol.
- Iedere remote handeling die beweging mogelijk maakt vereist een afzonderlijke
  risicoanalyse en lokale fysieke bevestiging.

## Logisch vervolg

1. Camera definitief richten met robot en actuatoren veilig stil.
2. Eén volledige testcyclus met gesimuleerde of gecontroleerde fout uitvoeren.
3. Controleren dat de clip circa 60 seconden vóór en 10 seconden na de fout bevat,
   afspeelbaar en doorzoekbaar is en de juiste datum, tijd en foutmetadata toont.
4. Opslagverbruik en retentie na meerdere clips controleren.
5. Remote toegang pas als apart beveiligingsontwerp toevoegen.
