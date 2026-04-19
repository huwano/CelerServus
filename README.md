# CelerServus

Rollenbasierte Echtzeit-App fuer den Gastro-Betrieb mit Fokus auf schnelle, fehlertolerante Bedienung im laufenden Service.

Der aktuelle Stand ist kein Konzept mehr, sondern ein lauffaehiger Entwicklungsstand mit getrenntem Vue-Frontend und Node-/Express-Backend inklusive Session-Handling, Orders, Stationsboards und Realtime-Signalen.

## Starten

Die lokale Startanleitung liegt in [docs/start.md](/home/valle/Desktop/celerservus/CelerServus/docs/start.md:1).

Kurzform:

- ohne Datenbank: `BACKEND_STORAGE_MODE=memory ./dev.sh`
- mit PostgreSQL: `cp backend/.env.example backend/.env` und danach `./dev.sh`

## Aktueller Stack

- Frontend: Vue 3, Pinia, Vue Router, Vite, Vitest
- Backend: Node.js, Express, `express-session`, Socket.IO
- Persistenz: In-Memory fuer schnellen Dev-Start, PostgreSQL fuer echten Persistenzpfad
- Tests: `node:test` im Backend, Vitest im Frontend

## Fachlicher Zuschnitt

CelerServus arbeitet aktuell mit den kanonischen Rollen:

- `bedienung`
- `theke`
- `kueche`
- `admin`

Der derzeitige Produktkern:

- Login ueber serverseitige Sessions
- Orders mit mehreren Positionen
- stationsbezogene Verarbeitung fuer `theke` und `kueche`
- Nachrichten an `theke`, `kueche` oder `beide`
- Realtime-Refresh ueber `orders:changed`
- eigener Admin-Ueberblick auf Basis des neuen Order-Modells

## Projektstruktur

```text
.
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── db
│   │   ├── domain
│   │   ├── middleware
│   │   ├── realtime
│   │   ├── repositories
│   │   ├── routes
│   │   └── services
│   └── test
├── frontend
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── lib
│   │   ├── realtime
│   │   ├── router
│   │   ├── stores
│   │   └── views
└── docs
```

## Zentrale Dokumente

- Start: [docs/start.md](/home/valle/Desktop/celerservus/CelerServus/docs/start.md:1)
- Design-Richtlinie: [docs/design.md](/home/valle/Desktop/celerservus/CelerServus/docs/design.md:1)
- Engineering-Log und Architekturverlauf: [docs/engineering-log.md](/home/valle/Desktop/celerservus/CelerServus/docs/engineering-log.md:1)

## Entwicklungsstand

Der aktuelle Codezustand entspricht grob diesem Stand:

- pluralisierte Session- und Orders-API ist aktiv
- Frontend ist auf die kanonischen Rollen umgestellt
- Realtime fuer Bestellaenderungen ist verdrahtet
- Request-Validierung und Fehlerhuellen sind im Backend zentralisiert
- Frontend hat ein gemeinsames App-Shell-/Token-System

Weiter offen bzw. noch nicht voll gehaertet:

- echte End-to-End-Absicherung ueber komplette Nutzerfluesse
- Persistenz und Betriebsmodus jenseits lokaler Entwicklung
- weitere Härtung von Repo-, DB- und Deployment-Pfaden

## Verifikation

Zuletzt erfolgreich geprueft:

- `cd backend && npm test`
- `cd frontend && npm run test:unit -- --run`
- `cd frontend && npm run build`

## Arbeitsweise

Wenn du an diesem Projekt weiterarbeitest, sind die wichtigsten Quellen in dieser Reihenfolge:

1. [docs/start.md](/home/valle/Desktop/celerservus/CelerServus/docs/start.md:1) fuer den sauberen lokalen Start
2. [docs/engineering-log.md](/home/valle/Desktop/celerservus/CelerServus/docs/engineering-log.md:1) fuer Architektur- und Implementierungsstand
3. [docs/design.md](/home/valle/Desktop/celerservus/CelerServus/docs/design.md:1) fuer verbindliche Frontend- und UX-Leitlinien
