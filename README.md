# CelerServus – Real-Time Restaurant Management System

## Projektübersicht

CelerServus ist ein modernes, webbasiertes Restaurant-Management-System, das Echtzeit-Kommunikation und effiziente Bestellabwicklung in einem zentralen Tool vereint. Ziel ist es, den Arbeitsablauf zwischen Kellnern, Küche und Bar zu optimieren und gleichzeitig eine einfache, intuitive Bedienung für das Personal zu gewährleisten.

---

## Kernfunktionen

### Bestellmanagement
- Bestellungen werden digital erfasst mit:
    - Tischnummer
    - Menüartikeln und Mengen
    - Sonderwünschen als Notiz für die gesamte Bestellung
- Bestellungen können nachträglich vom zuständigen Kellner geändert oder storniert werden.
- Getrennte Bezahlung möglich, indem einzelne Artikel ausgewählt und abgerechnet werden können (nach der Bestellaufnahme).

### Echtzeit-Benachrichtigungen
- Neue Bestellungen werden sofort an Küche und Bar (Weinausschank) übermittelt.
- Fertiggestellte Bestellungen lösen eine Benachrichtigung an den zuständigen Kellner aus.
- Direktes Rufsystem von Küche zu Kellner zur schnellen Kommunikation.
- Systemweite Inventarwarnungen informieren zuständiges Personal über niedrige Bestände.
- Benachrichtigungen erfolgen in Form von Pop-up-Fenstern für eine unmittelbare und sichtbare Information.

### Benutzerverwaltung und Rollen
- Mehrbenutzer-System mit differenzierten Rollen:
    - Kellner sehen und bearbeiten ausschließlich ihre eigenen Bestellungen.
    - Admin hat Vollzugriff auf alle Bestellungen und Systemfunktionen.
- Benutzer-Authentifizierung erfolgt via Login mit Benutzername und Passwort.
- Temporäre Gast-Accounts können für Aushilfen eingerichtet werden.
- Rollenbasierte Zugriffsrechte sind modular und erweiterbar.

---

## Technische Architektur

- **Frontend:**
    - Webanwendung mit React (oder Vue.js) für ein modernes und dynamisches Nutzererlebnis.
    - Echtzeit-Updates über WebSockets (Socket.IO).
    - Intuitive Bedienoberfläche mit Pop-up-Fenstern für schnelle Aktionen wie Bestellaufnahme und Benachrichtigungen.

- **Backend:**
    - Node.js mit Express als Webserver.
    - WebSocket-Kommunikation mit Socket.IO für Echtzeit-Datenfluss.
    - Authentifizierungs- und Autorisierungslogik für sichere Mehrbenutzerumgebung.

- **Datenbank:**
    - PostgreSQL als relationale Datenbank.
    - Speicherung von Bestellungen, Benutzerdaten, Inventar, und Systemlogs.
    - **[Platz für zukünftige Detailplanung der Datenbankstruktur]**

---

## Entwicklungsstand und ToDos

- Detaillierte Anforderungen sind definiert und das Grundkonzept steht.
- Benutzerrollen und Rechteverwaltung festgelegt.
- Erste Konzepte für Bestellmanagement und Echtzeit-Benachrichtigungen entworfen.
- Technologiestack (Node.js, Express, Socket.IO, React/Vue, PostgreSQL) ist ausgewählt.
- **[Platz für weitere ToDos, z.B. Datenbank-Schema-Design, UI/UX-Design, Testing-Plan]**

---

## Nächste Schritte

- Entwicklung und Feinplanung der Datenbanktabellen und Beziehungen.
- Umsetzung der Benutzer-Authentifizierung und Rollenkonzepte.
- Implementierung des Order-Managements mit Echtzeit-Funktionalitäten.
- UI-Design und Frontend-Entwicklung für eine effiziente Benutzerführung.
- Umfangreiche Tests für Usability, Performance und Sicherheit.

---

## Mitwirkung & Kontakt

Das Projekt ist offen für Beiträge und Anregungen. Bei Interesse oder Fragen bitte Kontakt aufnehmen.
