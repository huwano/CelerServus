# CelerServus Startanleitung

Stand: 2026-04-19

## Zweck

Diese Anleitung beschreibt den lokalen Start von CelerServus fuer die Entwicklung.

Es gibt zwei sinnvolle Modi:

- schnell und unkompliziert mit In-Memory-Backend
- vollstaendig mit PostgreSQL und Seed-Daten

## Voraussetzungen

- Node.js in einer aktuellen Version, passend zu den Projektdefinitionen
- `npm`
- optional: lokales PostgreSQL fuer den Datenbankmodus

Abhaengigkeiten installieren:

```bash
cd backend && npm install
cd ../frontend && npm install
```

Oder jeweils getrennt im passenden Ordner spaeter nachholen.

## Schnellstart ohne Datenbank

Das ist der beste Startpfad fuer UI-, Routing- und allgemeine Entwicklungsarbeit.

Vom Projekt-Root:

```bash
BACKEND_STORAGE_MODE=memory ./dev.sh
```

Verhalten:

- Backend startet mit In-Memory-Repositories
- es ist keine `backend/.env` noetig
- alle Daten gehen bei Neustart verloren

Standard-URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Start mit PostgreSQL

Das ist der richtige Modus fuer Persistenz, Schema- und Repository-Arbeit.

### 1. Env-Datei anlegen

Beispiel kopieren:

```bash
cp backend/.env.example backend/.env
```

Danach mindestens diese Werte pruefen:

- `BACKEND_STORAGE_MODE=postgres`
- `DATABASE_URL=...`
- `SESSION_SECRET=...`
- `FRONTEND_ORIGIN=http://localhost:5173`

### 2. PostgreSQL erreichbar machen

`DATABASE_URL` muss auf eine lokale oder erreichbare Datenbank zeigen.

Beispiel:

```text
postgres://postgres:postgres@localhost:5432/celerservus
```

### 3. Anwendung starten

Vom Projekt-Root:

```bash
./dev.sh
```

`dev.sh` macht dabei automatisch Folgendes:

- liest `backend/.env`, falls vorhanden
- initialisiert Schema und Seed-Daten per `npm run db:init`
- startet Backend und Frontend

Wenn die DB-Initialisierung fehlschlaegt, bricht das Script bewusst ab.

## Wichtige Umgebungsvariablen

Backend:

- `BACKEND_STORAGE_MODE`
- `DATABASE_URL`
- `DATABASE_SSL`
- `SESSION_SECRET`
- `SESSION_COOKIE_SECURE`
- `SESSION_COOKIE_SAME_SITE`
- `PORT`
- `FRONTEND_ORIGIN`

Frontend:

- `FRONTEND_PORT`
- `VITE_API_URL`
- `VITE_BACKEND_PORT`
- `VITE_FRONTEND_PORT`

## Nuetzliche Startvarianten

Anderer Backend-Port:

```bash
PORT=3010 VITE_API_URL=http://localhost:3010 BACKEND_STORAGE_MODE=memory ./dev.sh
```

Anderer Frontend-Port:

```bash
FRONTEND_PORT=5174 FRONTEND_ORIGIN=http://localhost:5174 BACKEND_STORAGE_MODE=memory ./dev.sh
```

## Einzelne Teilprojekte starten

Backend allein:

```bash
cd backend
npm run dev
```

Frontend allein:

```bash
cd frontend
npm run dev
```

Hinweis:

- Wenn du die Teilprojekte einzeln startest, musst du die noetigen Env-Variablen selbst setzen.
- Fuer den kompletten lokalen Standard-Workflow ist `./dev.sh` der bevorzugte Einstieg.

## Tests und Build

Backend-Tests:

```bash
cd backend
npm test
```

Frontend-Unit-Tests:

```bash
cd frontend
npm run test:unit -- --run
```

Frontend-Production-Build:

```bash
cd frontend
npm run build
```

## Typische Probleme

Port bereits belegt:

- `dev.sh` prueft Backend- und Frontend-Port vor dem Start.
- In dem Fall anderen Port waehlen oder laufenden Prozess beenden.

PostgreSQL startet nicht:

- `backend/.env` pruefen
- `DATABASE_URL` pruefen
- testweise mit `BACKEND_STORAGE_MODE=memory ./dev.sh` weiterarbeiten

Session/Cookie-Probleme im Cross-Origin-Setup:

- `FRONTEND_ORIGIN` und `VITE_API_URL` muessen zusammenpassen
- bei HTTPS-/Proxy-Setups `SESSION_COOKIE_SECURE` und `SESSION_COOKIE_SAME_SITE` passend setzen
