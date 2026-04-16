# CelerServus Engineering Log

Stand: 2026-04-16

## Handover für den nächsten Einstieg

### Aktueller Pause-Stand

Die Arbeit wurde mitten in Schritt 4 pausiert.

Schritt 4 bedeutet:

- neue pluralisierte Backend-API
- serverseitige Rollenprüfung
- saubere Trennung in Repository, Service, Controller, Routes
- Übergangskompatibilität für das bestehende Frontend bei den Session-Endpunkten

Wichtig:

- Der Workspace enthält bereits neue Dateien und Umbauten für diesen Schritt.
- Dieser Zwischenstand ist noch nicht vollständig verifiziert.
- Vor dem nächsten fachlichen Ausbau muss zuerst der aktuelle Stand geprüft und grün gezogen werden.

### Was beim nächsten Mal zuerst zu tun ist

Exakte Reihenfolge für die Wiederaufnahme:

1. `docs/engineering-log.md` lesen.
2. Workspace-Status prüfen.
3. `backend`-Tests ausführen.
4. Falls Tests fehlschlagen: den aktuellen Schritt erst stabilisieren, nicht direkt neue Features anfangen.
5. Danach prüfen, ob die neue API-Struktur fachlich und technisch konsistent ist.
6. Erst dann den nächsten bestätigten Umsetzungsschritt starten.

### Kritischer Hinweis zum aktuellen Zustand

Der Log beschreibt zwei Ebenen:

- bereits stabilisierte Änderungen
- bereits angelegte, aber möglicherweise noch ungeprüfte Änderungen

Für den aktuellen Stand gilt:

- Der erste TDD-Slice ist verifiziert.
- Der zweite größere API-Slice ist im Workspace angelegt, aber zum Zeitpunkt der Pause noch nicht abschließend geprüft.

Das heißt:

- Beim nächsten Einstieg nicht blind auf dem jetzigen Stand weiterbauen.
- Zuerst verifizieren, dann aufräumen, dann erst erweitern.

## Zweck

Diese Datei dokumentiert laufend:

- bestätigte fachliche Anforderungen
- technische Entscheidungen
- bereits umgesetzte Änderungen
- bewusst noch nicht umgesetzte Punkte
- nächste geplante Schritte

Ziel ist Nachvollziehbarkeit. Die Datei ist kein Marketing-Dokument, sondern ein Arbeitsprotokoll für Architektur, Refactoring und Implementierungsentscheidungen.

## Ausgangslage

Beim Start der Arbeit war das Projekt ein früher Prototyp:

- `backend/index.js` enthielt App-Setup, Session-Handling, Login, Orders und Socket-Setup in einer Datei.
- Das Backend hatte keine sinnvolle Testbasis.
- Rollen und Berechtigungen waren nur grob vorhanden.
- Order-Logik war noch flach und nicht an die geplanten Restaurant-Abläufe angepasst.
- Das Frontend war ein einfacher Proof of Concept und in der aktuellen Form noch nicht auf das neue Fachmodell ausgerichtet.

## Bestätigte Fachregeln

### Rollen

Die bestätigten Standardrollen sind:

- `bedienung`
- `theke`
- `kueche`
- `admin`

Fachliche Regeln:

- `theke` bearbeitet nur Getränke.
- `kueche` bearbeitet nur Speisen.
- `admin` darf alles sehen und verwalten.
- Rechte sollen auf Standardrollen basieren, später aber konfigurierbar sein.

### Bestellungen und Nachrichten

Bestätigte Regeln:

- Eine Bestellung kann Speisen und Getränke gleichzeitig enthalten.
- Jede Position gehört genau zu einer Station.
- Beim Erstellen gibt es eine `initialNote`.
- Im laufenden Betrieb können weitere Nachrichten angehängt werden.
- Diese laufenden Nachrichten werden nicht überschrieben, sondern chronologisch gespeichert.
- Nachrichten können gezielt an `theke`, `kueche` oder `beide` gesendet werden.
- Stationen sehen nur die für sie relevanten Nachrichten.
- `admin` sieht alle Nachrichten vollständig.

### Bearbeitung während laufender Order

Bestätigte Regel:

- Order-Bearbeitung nach Start der Bearbeitung ist standardmäßig ausgeschaltet.
- Diese Regel soll konfigurierbar bleiben.

## Architekturentscheidungen

### 1. TDD nur dort, wo es fachlich stabil ist

Es wurde bewusst nicht versucht, sofort alles testgetrieben über HTTP oder UI zu testen.

Stattdessen wurde zuerst die stabile Fachlogik testbar gemacht:

- Rollen und Permissions
- Order-Statusregeln
- Stationszuordnung
- Nachrichtenziel-Logik

Begründung:

- Diese Regeln sind bereits fachlich bestätigt.
- Sie schützen spätere Refactorings.
- Sie erzeugen keinen unnötigen technischen Overhead.

### 2. Schlanke Schichten statt Overengineering

Aktuell eingeführte Backend-Schichten:

- `config`
- `domain`
- `repositories`
- `services`
- `controllers`
- `routes`
- `middleware`

Begründung:

- Diese Trennung bringt jetzt schon echten Nutzen.
- Sie bleibt klein genug für den aktuellen Projektstand.
- Sie vermeidet eine zweite spätere Neuordnung, wenn mehr Features dazukommen.

### 3. REST-Ressourcen im Plural

Ab jetzt gelten für die neue API:

- `/orders`
- `/sessions`
- `/users`
- `/roles`
- `/permissions`
- `/messages`

Begründung:

- konsistente API-Namensgebung
- besser lesbar
- standardnah

### 4. Legacy-Kompatibilität nur dort, wo sie kurzfristig hilft

Es wurden Legacy-Session-Endpunkte beibehalten:

- `/api/login`
- `/api/me`
- `/api/logout`

Begründung:

- Das bestehende Frontend nutzt diese Pfade bereits.
- Die neue API läuft parallel über `/sessions/...`.

Wichtig:

- Diese Legacy-Kompatibilität ist nur ein Übergang.
- Das Frontend muss später auf die neue API und das neue Rollenmodell umgestellt werden.

## Bereits umgesetzte Änderungen

### Erster TDD-Slice

Bereits eingeführt:

- zentrales Permission-Modell für Standardrollen
- konfigurierbare Rollen-Overrides
- Order-Domain mit:
  - Kategorien
  - Stationszuordnung
  - Statusableitung
  - Nachrichtenziel-Logik
  - konfigurierbare Bearbeitungsregel
- minimales Testsetup mit `node:test`

Betroffene Dateien:

- [backend/src/config/role-permissions.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/config/role-permissions.js:1)
- [backend/src/config/order-rules.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/config/order-rules.js:1)
- [backend/src/domain/orders.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/domain/orders.js:1)
- [backend/src/domain/permissions.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/domain/permissions.js:1)
- [backend/test/orders.test.js](/home/valle/Desktop/celerservus/CelerServus/backend/test/orders.test.js:1)
- [backend/test/permissions.test.js](/home/valle/Desktop/celerservus/CelerServus/backend/test/permissions.test.js:1)

### Zweiter Slice: neue Backend-Struktur

Bereits angelegt:

- neue Rollen-Normalisierung
- HTTP-Fehlermodell
- In-Memory-Repositories für Users und Orders
- Services für Sessions und Orders
- Auth-Middleware
- Controller für Sessions und Orders
- neue pluralisierte Routes
- zentrales Error-Handling

Betroffene Dateien:

- [backend/src/config/roles.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/config/roles.js:1)
- [backend/src/http-error.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/http-error.js:1)
- [backend/src/repositories/in-memory-user-repository.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/repositories/in-memory-user-repository.js:1)
- [backend/src/repositories/in-memory-order-repository.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/repositories/in-memory-order-repository.js:1)
- [backend/src/services/session-service.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/services/session-service.js:1)
- [backend/src/services/order-service.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/services/order-service.js:1)
- [backend/src/middleware/auth.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/middleware/auth.js:1)
- [backend/src/controllers/sessions-controller.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/controllers/sessions-controller.js:1)
- [backend/src/controllers/orders-controller.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/controllers/orders-controller.js:1)
- [backend/src/routes/sessions-routes.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/routes/sessions-routes.js:1)
- [backend/src/routes/orders-routes.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/routes/orders-routes.js:1)
- [backend/src/app.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/app.js:1)
- [backend/index.js](/home/valle/Desktop/celerservus/CelerServus/backend/index.js:1)

Status dieses Slices zum Zeitpunkt der Pause:

- Code ist im Workspace angelegt.
- Verifikation dieses Slices ist noch offen.
- Es darf beim nächsten Einstieg erst nach Test- und Review-Lauf als stabil betrachtet werden.

### Bereits definierte neue API-Richtung

Neue API-Ressourcen:

- `POST /sessions`
- `GET /sessions/me`
- `DELETE /sessions/current`
- `GET /orders`
- `GET /orders/:orderId`
- `POST /orders`
- `POST /orders/:orderId/messages`
- `PATCH /orders/:orderId/items/:itemId`

## Teststrategie

Aktuell eingesetzte Tests:

- Domain-Tests für Order-Regeln
- Domain-Tests für Permissions
- Service-Tests für Sichtbarkeit, Nachrichten und Statusrechte
- Controller-Tests für HTTP-Statuscodes und Response-Hüllen

Betroffene Testdateien:

- [backend/test/orders.test.js](/home/valle/Desktop/celerservus/CelerServus/backend/test/orders.test.js:1)
- [backend/test/permissions.test.js](/home/valle/Desktop/celerservus/CelerServus/backend/test/permissions.test.js:1)
- [backend/test/order-service.test.js](/home/valle/Desktop/celerservus/CelerServus/backend/test/order-service.test.js:1)
- [backend/test/orders-controller.test.js](/home/valle/Desktop/celerservus/CelerServus/backend/test/orders-controller.test.js:1)
- [backend/test/sessions-controller.test.js](/home/valle/Desktop/celerservus/CelerServus/backend/test/sessions-controller.test.js:1)

Warum nicht sofort End-to-End?

- Das Frontend ist fachlich noch nicht auf dem neuen Modell angekommen.
- In dieser Umgebung sind gebundene lokale Ports eingeschränkt.
- Für den aktuellen Refactoring-Stand liefern Domain-, Service- und Controller-Tests mehr Nutzen bei weniger technischer Reibung.

## Bekannte Übergangspunkte

Diese Punkte sind bewusst noch nicht final:

- Das Frontend ist noch nicht an das neue Order-Modell angepasst.
- Legacy-Session-Endpunkte existieren noch parallel.
- Persistenz ist noch In-Memory und noch nicht datenbankbasiert.
- Rechte sind technisch bereits override-fähig, aber noch nicht administrativ über UI konfigurierbar.
- Rollen im Frontend und Rollen im neuen Backend-Modell sind noch nicht vollständig zusammengeführt.
- Die neue Orders-API ist noch nicht bis ins Frontend durchverdrahtet.

## Offene Verifikation beim nächsten Einstieg

Diese Punkte müssen als erstes geprüft werden:

- Laufen alle Backend-Tests grün?
- Ist `backend/index.js` nach dem Umbau syntaktisch und logisch konsistent?
- Stimmen Response-Hüllen und Statuscodes der neuen Controller mit der gewünschten API-Richtung überein?
- Funktionieren Legacy-Session-Endpunkte weiter, solange das Frontend noch nicht migriert wurde?
- Gibt es Namens- oder Rolleninkonsistenzen zwischen altem Frontend und neuem Backend?

## Nächste sinnvolle Schritte

Vorgeschlagene Reihenfolge:

1. Den aktuellen API-Slice verifizieren und stabilisieren.
2. Serverseitige Validierung für Payloads weiter schärfen.
3. Socket-Ereignisse auf das neue Order-Modell umstellen.
4. Frontend-Rollen und Views auf `bedienung`, `theke`, `kueche`, `admin` anpassen.
5. Frontend auf neue Response-Strukturen und pluralisierte Session-Endpunkte umstellen.
6. Danach Persistenzschnitt definieren und Datenbank sauber einziehen.

## Letzte bestätigte fachliche Richtung

Die nächste Umsetzung nach Stabilisierung des aktuellen Slices soll weiterhin sein:

- pluralisierte REST-Endpunkte
- serverseitige Autorisierung
- Orders als zentrale Ressource
- stationsbezogene Sicht für `theke` und `kueche`
- `admin` sieht alles
- `bedienung` arbeitet auf Bestellebene und kann Nachrichten an Stationen senden

## Konkreter Resume-Prompt für die nächste Sitzung

Wenn die Arbeit wieder aufgenommen wird, soll zuerst sinngemäß mit folgendem Auftrag weitergearbeitet werden:

`Lies docs/engineering-log.md, prüfe den aktuellen Backend-Umbau aus Schritt 4, stabilisiere den vorhandenen API-Slice mit Tests und Review, und beginne erst danach mit dem nächsten bestätigten Ausbau.`

## Arbeitsregel für kommende Schritte

Für weitere Arbeit an diesem Projekt gelten:

- zuerst Anforderung präzisieren
- Bestätigung einholen
- Tests nur dort zuerst schreiben, wo sie fachlich stabil und sinnvoll sind
- minimal implementieren
- danach Code, Struktur und Seiteneffekte erneut prüfen
- keinen unnötigen Overhead einführen

## Fortschreibung 2026-04-16

Diese Fortschreibung ersetzt nicht die ältere Historie, aber sie aktualisiert den faktischen Arbeitsstand.

Wichtig:

- Mehrere weiter oben als "noch offen" beschriebene Punkte sind inzwischen erledigt.
- Für den nächsten Einstieg ist dieser Abschnitt maßgeblich, nicht mehr der frühere Pause-Stand aus Schritt 4.

### Aktueller Ist-Stand

Der zuvor offene API-Slice wurde verifiziert und weitergezogen.

Aktuell gilt:

- Backend-Tests laufen grün.
- `backend/index.js` ist syntaktisch konsistent.
- Die pluralisierte Sessions- und Orders-API ist aktiv im Code verdrahtet.
- Das Frontend ist auf die neue Session-API und die kanonischen Rollen umgestellt.
- Das Frontend nutzt das neue Orders-Modell inklusive mehrerer Positionen pro Bestellung.
- Stationsnachrichten können aus der Bedienungsansicht gezielt an `theke`, `kueche` oder `beide` gesendet werden.
- Realtime-Signale für Bestelländerungen sind angebunden.
- Das Frontend hat inzwischen eine neue mobile-first App-Shell mit Burger-Menü und modularem Design-System.

### Seit dem alten Pause-Stand zusätzlich umgesetzt

#### 1. Backend-Verifikation und Validierung

Zusätzlich eingeführt:

- zentrale Request-Validierung für Session-, Order-, Message- und Status-Payloads
- konsistente `400 validation_error`-Antworten statt roher Laufzeit- oder Domain-Fehler
- zusätzliche Negativtests für unvollständige oder ungültige Payloads

Betroffene Dateien:

- [backend/src/validation.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/validation.js:1)
- [backend/src/services/session-service.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/services/session-service.js:1)
- [backend/src/services/order-service.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/services/order-service.js:1)
- [backend/test/session-service.test.js](/home/valle/Desktop/celerservus/CelerServus/backend/test/session-service.test.js:1)
- [backend/test/order-service.test.js](/home/valle/Desktop/celerservus/CelerServus/backend/test/order-service.test.js:1)
- [backend/test/orders-controller.test.js](/home/valle/Desktop/celerservus/CelerServus/backend/test/orders-controller.test.js:1)
- [backend/test/sessions-controller.test.js](/home/valle/Desktop/celerservus/CelerServus/backend/test/sessions-controller.test.js:1)

#### 2. Realtime auf das neue Order-Modell

Zusätzlich eingeführt:

- dediziertes Realtime-Modul für Bestelländerungen
- schlankes Socket-Ereignis `orders:changed`
- Emission bei erfolgreicher Order-Erstellung, Nachrichtenerstellung und Item-Statusänderung
- Frontend lädt daraufhin die rollenabhängig gefilterten Orders neu

Betroffene Dateien:

- [backend/src/realtime/order-events.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/realtime/order-events.js:1)
- [backend/src/controllers/orders-controller.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/controllers/orders-controller.js:1)
- [backend/index.js](/home/valle/Desktop/celerservus/CelerServus/backend/index.js:1)
- [frontend/src/realtime/orders.js](/home/valle/Desktop/celerservus/CelerServus/frontend/src/realtime/orders.js:1)

#### 3. Frontend-Migration auf neue API und Rollen

Zusätzlich eingeführt:

- Frontend-Login über `POST /sessions`
- Session-Refresh über `GET /sessions/me`
- Logout über `DELETE /sessions/current`
- Routing und Role-Handling auf `bedienung`, `theke`, `kueche`, `admin`
- Weiterleitungen von alten Frontend-Pfaden `/waiter` und `/kitchen` auf die neuen Pfade

Betroffene Dateien:

- [frontend/src/stores/api.js](/home/valle/Desktop/celerservus/CelerServus/frontend/src/stores/api.js:1)
- [frontend/src/stores/auth.js](/home/valle/Desktop/celerservus/CelerServus/frontend/src/stores/auth.js:1)
- [frontend/src/router/index.js](/home/valle/Desktop/celerservus/CelerServus/frontend/src/router/index.js:1)
- [frontend/src/lib/home-by-role.js](/home/valle/Desktop/celerservus/CelerServus/frontend/src/lib/home-by-role.js:1)

#### 4. Frontend-Fachmodell für Bedienung und Stationen

Zusätzlich eingeführt:

- Bedienungsansicht für mehrere Positionen pro Bestellung
- gezielte Stationsnachrichten pro Order
- Stationsboards für `theke` und `kueche`
- Admin-Leitstand auf dem neuen Order-Modell

Betroffene Dateien:

- [frontend/src/views/WaiterView.vue](/home/valle/Desktop/celerservus/CelerServus/frontend/src/views/WaiterView.vue:1)
- [frontend/src/components/StationBoard.vue](/home/valle/Desktop/celerservus/CelerServus/frontend/src/components/StationBoard.vue:1)
- [frontend/src/views/ThekeView.vue](/home/valle/Desktop/celerservus/CelerServus/frontend/src/views/ThekeView.vue:1)
- [frontend/src/views/KitchenView.vue](/home/valle/Desktop/celerservus/CelerServus/frontend/src/views/KitchenView.vue:1)
- [frontend/src/views/AdminView.vue](/home/valle/Desktop/celerservus/CelerServus/frontend/src/views/AdminView.vue:1)

#### 5. Neues Frontend-Design-System

Zusätzlich eingeführt:

- App-Shell mit Drawer/Burger-Menü
- gemeinsame Navigationsmetadaten pro Rolle
- globales Design-System mit Tokens, Oberflächen, Karten, Metriken und responsiven Layouts
- überarbeiteter Login-Screen im App-Stil

Betroffene Dateien:

- [frontend/src/App.vue](/home/valle/Desktop/celerservus/CelerServus/frontend/src/App.vue:1)
- [frontend/src/components/AppShell.vue](/home/valle/Desktop/celerservus/CelerServus/frontend/src/components/AppShell.vue:1)
- [frontend/src/components/MetricCard.vue](/home/valle/Desktop/celerservus/CelerServus/frontend/src/components/MetricCard.vue:1)
- [frontend/src/assets/main.css](/home/valle/Desktop/celerservus/CelerServus/frontend/src/assets/main.css:1)
- [frontend/src/lib/navigation.js](/home/valle/Desktop/celerservus/CelerServus/frontend/src/lib/navigation.js:1)
- [frontend/src/views/LoginView.vue](/home/valle/Desktop/celerservus/CelerServus/frontend/src/views/LoginView.vue:1)

### Verifikationsstand jetzt

Zuletzt erfolgreich ausgeführt:

- `cd backend && npm test`
- `cd frontend && npm run build`

Damit ist aktuell bestätigt:

- Backend-Testbasis grün
- Frontend kompiliert nach den UI-Umbauten grün

Nicht bestätigt in dieser Sitzung:

- manueller End-to-End-Lauf mit mehreren offenen Browser-Sessions
- echtes UI-Feintuning auf realen Geräten
- Persistenz außerhalb von In-Memory

### Bekannte verbleibende Lücken

Diese Punkte sind aktuell noch offen:

- Persistenz ist weiterhin In-Memory.
- Legacy-Session-Endpunkte existieren weiterhin als Übergang für alte Frontend-Pfade/Kompatibilität.
- Rollen- und Rechte-Overrides sind backendseitig vorbereitet, aber nicht administrativ per UI pflegbar.
- Es gibt noch keine echte End-to-End-Testabdeckung für den neuen Frontend-Flow.
- Das neue Design ist funktionsfähig, aber Feinschliff für Mikrointeraktionen und UX-Polish ist noch möglich.

### Demo-Zugänge zum lokalen Testen

Aktuelle In-Memory-Logins:

- `kellner1` / `test123` für `bedienung`
- `theke1` / `test123` für `theke`
- `kueche1` / `test123` für `kueche`
- `admin1` / `test123` für `admin`

Quelle:

- [backend/src/repositories/in-memory-user-repository.js](/home/valle/Desktop/celerservus/CelerServus/backend/src/repositories/in-memory-user-repository.js:1)

### Nächste sinnvolle Schritte ab jetzt

Aktuell sinnvolle Reihenfolge:

1. UI manuell im Browser durchgehen und grobe mobile UX-Brüche finden.
2. Feinschliff für Touch-Komfort, Menü-Interaktionen und visuelle Konsistenz ergänzen.
3. Optional: Bedienungsansicht um noch stärkere Order-Details oder kompaktere Listenmodi erweitern.
4. Danach Persistenzschnitt definieren und Datenbank sauber einziehen.
5. Erst nach klarer Persistenzentscheidung breitere End-to-End-Tests und tiefere Workflow-Absicherung ausbauen.

### Konkreter Resume-Prompt ab jetzt

Wenn die Arbeit wieder aufgenommen wird, soll zuerst sinngemäß mit folgendem Auftrag weitergearbeitet werden:

`Lies docs/engineering-log.md, orientiere dich am Abschnitt "Fortschreibung 2026-04-16", prüfe den aktuellen UI- und Realtime-Stand kurz mit Build/Test, und arbeite dann am nächsten bestätigten Slice weiter.` 
