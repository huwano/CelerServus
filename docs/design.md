# CelerServus Design Guide

Stand: 2026-04-19

## Zweck

Dieses Dokument ist die verbindliche Design- und Frontend-Richtlinie fuer CelerServus.

Es beschreibt:

- die visuelle Richtung der App
- die Layout- und Interaktionsmuster
- die Geraetestrategie pro Rolle
- die Theme-Strategie fuer Dark und Light Mode
- den modularen Vue-Aufbau
- die Regeln fuer konfigurierbare, nicht hartcodierte UI-Daten
- die Regeln fuer CSS-Variablen und Design-Tokens

Dieses Dokument ist bewusst auf reale Nutzung im hektischen Gastro-Betrieb ausgelegt und nicht auf generische SaaS-Optik.

## Produktkontext

CelerServus ist eine rollenbasierte Echtzeit-App fuer den Gastro-Betrieb mit den Rollen:

- `bedienung`
- `theke`
- `kueche`
- `admin`

Einsatzkontext:

- stark frequentiertes Weinfest
- laute Umgebung
- teils dunkel, teils direkte Sonne
- Nutzer haben oft nur eine Hand frei
- Finger koennen nass oder verschmutzt sein
- Aktionen muessen schnell, eindeutig und fehlertolerant sein

## Designprinzip

Leitlinie: `Radical Functionality`

Das bedeutet:

- Geschwindigkeit ist wichtiger als Dekoration.
- Sichtbarkeit ist wichtiger als Weissraum.
- Ein klarer Touch-Schritt ist besser als mehrere schoene Zwischenschritte.
- Mobile Nutzung ist der Standard, nicht eine Nebenbedingung.
- Die UI muss auch unter Stress ohne Nachdenken bedienbar bleiben.

## Verbindliche Designregeln

### 1. Zero Bullshit

Nicht verwenden:

- keine Gradients
- keine Glassmorphism-Effekte
- keine weichen Schatten
- keine verspielten Pill-Komponenten
- keine luftigen Marketing-Layouts
- keine Hover-Muster als primaere Interaktion
- keine blockierenden Modals fuer Kernablaeufe
- keine komplexen Ladeanimationen

Erlaubt:

- harte Flaechen
- klare Linien
- minimale Radien
- sofortige visuelle Press-States
- direkte Inline-Interaktion

### 2. Dark Mode als Standard, Light Mode als gleichwertige Alternative

Die Standarddarstellung ist dunkel.

Begruendung:

- besser fuer Abendbetrieb
- besserer Kontrast bei heller Akzentfarbe
- ruhiger im hektischen Umfeld
- gute Lesbarkeit auf OLED- und LCD-Geraeten

Light Mode ist trotzdem kein spaeterer Sonderfall, sondern eine verbindlich mitgedachte Theme-Variante.

Verbindliche Regeln:

- Dark Theme ist der Default beim Erststart.
- Light Theme wird ueber dieselben Komponenten und dieselbe Token-Struktur getragen.
- Themes duplizieren keine Komponenten.
- Farben, Border, Flaechen und Fokuszustaende werden ausschliesslich ueber Theme-Tokens umgeschaltet.
- Komponenten enthalten keine fachlich motivierten `if dark else light`-Sonderfaelle fuer Farben.
- Der Theme-Wechsel muss global und austauschbar sein, zum Beispiel ueber `data-theme` auf App-Ebene.

### 3. Thumb-Zone First

Primaere Aktionen muessen im unteren Drittel des Bildschirms liegen.

Das gilt besonders fuer:

- `Bestellung senden`
- `Fertig melden`
- `Starten`
- `Storno`
- `Nachricht`
- `Split`
- `Neuer Tisch`

### 4. Touch vor Praezision

Alle interaktiven Elemente muessen gross, robust und fehlertolerant sein.

Verbindliche Mindestwerte:

- Mindest-Touchflaeche: `60px x 60px`
- grosse, fette Beschriftung
- hohe Kontraste
- kein Vertrauen auf feine Linien oder kleine Icons allein

## Geraetestrategie pro Rolle

### Bedienung

Primaergeraet:

- Smartphone im Hochformat

Designziel:

- Einhandbedienung
- schneller Bestellfluss
- grosse Produkt- und Aktionsflaechen
- minimale Kopfbereiche

Layout:

- einspaltig
- Bottom-Action-Bar permanent sichtbar
- Inhalte auf schnelle Erfassung und Senden optimiert

### Theke

Primaergeraet:

- Smartphone nutzbar
- iPad ausdruecklich unterstuetzt und bevorzugt

Designziel:

- viele gleichzeitige Getraenke-Tickets sichtbar
- schnelle Statuswechsel
- Wischaktionen und grosse Ticketkarten

Layout:

- Smartphone: Listen- oder Ticket-Stack
- iPad: Mehrspalten-Board mit Status-Lanes wie `Neu`, `In Arbeit`, `Fertig`
- iPad Portrait: kompakte 2-Spalten-Verdichtung mit klaren Lane-Ueberschriften
- iPad Landscape: 3 oder mehr Lanes nur dann, wenn Ticketbreite und Touch-Flaechen robust bleiben
- primaere Aktionen bleiben auch auf dem iPad im unteren Greifraum oder direkt auf dem Ticket erreichbar

### Kueche

Primaergeraet:

- Smartphone nutzbar
- iPad ausdruecklich unterstuetzt und bevorzugt

Designziel:

- konzentrierte Ticketbearbeitung
- Speisenstatus klar sichtbar
- Nachrichten und Prioritaeten sofort erkennbar

Layout:

- Smartphone: fokussierte Ticketliste
- iPad: breiter Pass mit mehreren Tickets gleichzeitig sichtbar
- iPad Portrait: priorisierte Ticketliste oder 2 Lanes
- iPad Landscape: Lane- oder Passlayout mit hoher Ticketdichte, ohne Desktop-Muster zu imitieren
- Statuswechsel muessen ohne kleine Toolbar-Trefferflaechen funktionieren

### Admin

Primaergeraet:

- mobil lesbar
- funktional auf Tablet und Desktop erweiterbar

Designziel:

- Uebersicht statt operativer Haupteinsatz
- keine visuelle Dominanz gegenueber den operativen Rollen
- Konfigurationsoberflaechen muessen auf Tablet brauchbar bleiben

## Informationsarchitektur

Die App wird nicht als generische Shell mit Burger-Menue entworfen.

Stattdessen bekommt jede Rolle eine fokussierte Arbeitsoberflaeche.

### Bedienung

Kernbereiche:

- `Tische`
- `Bestellung`
- `Laufende Orders`

### Theke

Kernbereiche:

- `Neu`
- `In Arbeit`
- `Fertig`

### Kueche

Kernbereiche:

- `Neu`
- `In Arbeit`
- `Fertig`

### Admin

Kernbereiche:

- `Betrieb`
- `Orders`
- `Stationen`

## Layout-Regeln

### Allgemein

- Kein grosser Hero-Bereich.
- Kein dekorativer Header.
- Vertikaler Raum gehoert Listen, Tickets, Grids und Aktionen.
- Oberer Bereich zeigt nur Kontext, nicht Marketing.

### Smartphone

- Einspaltiges Layout
- dichter Informationsaufbau
- untere fixe Aktionsleiste
- oberer Bereich nur fuer Rollenlabel, Tisch, Filter oder Status

### iPad fuer Theke und Kueche

- Mehrspalten-Layout erlaubt
- Tickets koennen in Lanes nach Status geordnet sein
- Touch-Bedienung bleibt gleich
- keine Desktop-Hover-Muster
- keine winzigen Toolbar-Elemente
- Verdichtung darf nur ueber Spaltenzahl, nicht ueber kleinere Targets entstehen
- Split-Layouts sind erlaubt, wenn primaere Aktionen im unteren Bereich erreichbar bleiben

## Typografie

Verbindliche Vorgaben:

- Systemschrift verwenden
- nur `Regular`, `SemiBold`, `Bold`
- keine Light- oder Thin-Schnitte
- Zahlen muessen `tabular-nums` nutzen
- Schriftgroessen lieber etwas groesser als zu klein

Empfohlene Prioritaet:

- `font-family: Inter, Roboto, "SF Pro Text", "Segoe UI", sans-serif;`

Typografische Regeln:

- grosse numerische Werte sofort lesbar
- Tickettitel und Tischnummern fett
- Meta-Information kleiner, aber kontrastreich
- nicht mehr als noetig differenzieren

## Farb- und Token-System

Farben und visuelle Konstanten duerfen nicht hart in Komponenten codiert werden.

Alle Farben und Designwerte laufen ueber CSS-Variablen.

### Verbindliche Regel

- Keine Hex-Werte direkt in Komponenten-CSS.
- Keine Inline-Styles fuer Farben.
- Alle UI-Farben werden ueber Tokens in `:root` oder Theme-Scopes definiert.
- Dark und Light Theme nutzen dieselben semantischen Token-Namen.

### Basisstruktur fuer Tokens

```css
:root[data-theme="dark"] {
  color-scheme: dark;

  --color-bg: #111111;
  --color-bg-elevated: #181818;
  --color-surface: #1f1f1f;
  --color-surface-strong: #262626;
  --color-surface-muted: #171717;

  --color-text: #f5f5f5;
  --color-text-muted: #c7c7c7;
  --color-text-dim: #9a9a9a;

  --color-border: #343434;
  --color-border-strong: #4a4a4a;

  --color-accent: #8f1d2c;
  --color-accent-strong: #741723;
  --color-accent-contrast: #ffffff;

  --color-success: #1fbf5b;
  --color-success-strong: #179447;
  --color-success-contrast: #08140c;

  --color-warning: #ffb000;
  --color-warning-strong: #d49100;
  --color-warning-contrast: #1a1300;

  --color-danger: #e53935;
  --color-danger-strong: #b82c29;
  --color-danger-contrast: #ffffff;

  --color-info: #2f80ed;
  --color-focus: #ffcf33;

  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;

  --border-width: 1px;
  --border-width-strong: 2px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;

  --touch-min: 60px;
  --bottom-bar-height: 84px;

  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 20px;
  --font-size-xl: 24px;

  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}

:root[data-theme="light"] {
  color-scheme: light;

  --color-bg: #f3f4f6;
  --color-bg-elevated: #ffffff;
  --color-surface: #ffffff;
  --color-surface-strong: #f3f4f6;
  --color-surface-muted: #e5e7eb;

  --color-text: #101214;
  --color-text-muted: #30343a;
  --color-text-dim: #5b616a;

  --color-border: #c7ccd1;
  --color-border-strong: #9aa3ad;

  --color-accent: #8f1d2c;
  --color-accent-strong: #741723;
  --color-accent-contrast: #ffffff;

  --color-success: #178f45;
  --color-success-strong: #126c34;
  --color-success-contrast: #ffffff;

  --color-warning: #d49100;
  --color-warning-strong: #a06f00;
  --color-warning-contrast: #181200;

  --color-danger: #c9312d;
  --color-danger-strong: #9f2421;
  --color-danger-contrast: #ffffff;

  --color-info: #1f6fda;
  --color-focus: #b77900;

  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 8px;

  --border-width: 1px;
  --border-width-strong: 2px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;

  --touch-min: 60px;
  --bottom-bar-height: 84px;

  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 20px;
  --font-size-xl: 24px;

  --font-weight-regular: 400;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
}
```

### Akzentfarbe

Die primaere Akzentfarbe soll ueber Variable austauschbar bleiben.

Aktuelle Richtungsentscheidung:

- modernes Burgunderrot fuer Weinfest-Charakter

Wenn spaeter ein Gruenton gewuenscht ist, darf nur das Token-System geaendert werden, nicht die Komponentenlogik.

### Statusfarben

Verbindliche Zuordnung:

- `success` fuer fertig, serviert, abgeschlossen
- `warning` fuer wartet, offen, in Bearbeitung
- `danger` fuer Storno, Problem, Achtung

Keine Pastelltoene.
Keine uneindeutigen Zwischenfarben fuer kritische Status.

## Komponentenrichtlinien

### Buttons

- mindestens `60px` hoch
- eckig oder minimal gerundet
- fette Labels
- keine kleinen Textlinks fuer Kernaktionen
- gedrueckter Zustand muss sofort sichtbar sein

Erlaubte Press-Reaktion:

- dunkler werden
- minimal skalieren

Nicht erlaubt:

- springende Animationen
- verspielte Transition-Ketten

### Karten und Tickets

- blockartig
- klar getrennt
- deutliche Titelhierarchie
- Status als Farbe und Text
- Nachrichten im Ticket sichtbar, nicht hinter Unterseiten versteckt

### Listen

Fuer `theke` und `kueche` werden Bestellungen als starke Ticketlisten oder Kacheln dargestellt.

Jedes Ticket zeigt mindestens:

- Tisch
- Zeit oder Wartezeit
- Positionen
- aktuelle Nachricht
- Status
- naechste moegliche Aktion

### Eingaben

- Inline statt Modal, wenn fachlich moeglich
- klare Labels
- ausreichend hohe Felder
- keine filigranen Controls

## Interaktionsmuster

### Bedienung

Primaerer Flow:

1. Tisch waehlen oder aufrufen
2. Artikel ueber grosse Grid-Buttons hinzufuegen
3. laufende Order unten oder als feste Zusammenfassung sehen
4. mit einer unteren Hauptaktion senden

Sekundaere Aktionen:

- Notiz
- Split
- Storno
- Rueckfrage

Diese Aktionen muessen ohne tief verschachtelte Menues erreichbar sein.

### Theke und Kueche

Primaerer Flow:

- Ticket sehen
- Ticket antippen oder wischen
- Status aendern
- fertig melden

Wischmuster:

- Swipe nach rechts: weiter oder fertig
- optional Swipe nach links: Problem, Rueckfrage oder Storno

Wischgesten muessen visuell stark bestaetigt werden.

### Benachrichtigungen

Keine blockierenden Pop-ups fuer Kernbetrieb.

Stattdessen:

- Inline-Banner
- markierte neue Tickets
- farbliche Zustandsaenderung
- kompakte Ereignisleiste

## Modulare Vue-Architektur

Das Frontend soll fuer spaetere Skalierung, neue Felder und neue Funktionen modular aufgebaut werden.

Es wird ausdruecklich nicht als grosse monolithische View-Struktur umgesetzt.

### Zielstruktur

```text
frontend/src/
  assets/
    main.css
    tokens.css
  components/
    app/
    ui/
  composables/
  config/
  features/
    auth/
    orders/
    waiter/
    station/
    admin/
  views/
  router/
  stores/
  lib/
```

### Rollen der Schichten

`views/`

- nur Screen-Komposition
- keine grosse Fachlogik
- keine verstreuten Stil-Sonderregeln

`components/ui/`

- generische UI-Bausteine
- zum Beispiel `BaseButton`, `BaseCard`, `StatusBadge`, `BottomActionBar`

`components/app/`

- app-spezifische zusammengesetzte Bausteine
- zum Beispiel `OrderTicket`, `StationLane`, `TablePicker`, `ItemGrid`

`features/`

- fachlich gruppierte Module
- enthalten Subkomponenten, Composables und Konfigurationen fuer eine Funktion
- enthalten nur modulare, austauschbare Funktionseinheiten statt global verteilter Sonderlogik

`composables/`

- wiederverwendbare Interaktions- und Datenlogik
- keine duplizierte Ticket- oder Formularlogik in mehreren Views

`config/`

- Fallback-Defaults fuer Statusdefinitionen
- Fallback-Defaults fuer Rollen-Mappings
- Fallback-Defaults fuer Felddefinitionen
- Fallback-Defaults fuer Aktionsdefinitionen
- Design-Konfigurationen

### Feste UX-Struktur vs. konfigurierbare Fachdaten

Die UI darf nicht mit fest eincodierten Gastro-Domaenen wachsen.

Verbindlich fest in der UX:

- Touch-Ziele
- Bottom-Action-Bar
- Ticket-Grundlayout
- Listen- und Lane-Muster
- Press-States
- Theme-Tokens
- generische Formular- und Grid-Bausteine

Konfigurierbar und spaeter durch Admin oder API austauschbar:

- Kategorien
- Artikel
- Artikelgruppen
- Stationsarten
- Statuslisten
- Filteroptionen
- Feldschemas
- Aktionslabels
- Prioritaetsstufen
- Zusatzoptionen und Modifier

Regel:

- Komponenten arbeiten gegen semantische Datenstrukturen und Schemas, nicht gegen hartcodierte Strings wie `wein`, `speise` oder `dessert`.

## Erweiterbarkeit fuer neue Felder und Funktionen

Neue Felder muessen so integrierbar sein, dass nicht jede Rolle neu verdrahtet werden muss.

### Verbindliche Regeln

- Felddefinitionen zentral als Konfiguration oder Schema verwalten
- Komponenten fuer Eingabebloecke wiederverwendbar bauen
- keine hart eingebackenen Sonderfelder direkt in mehreren Views
- neue Status, Kategorien und Rollen ueber Mappings erweiterbar halten
- Katalogdaten nicht in Vue-Komponenten hinterlegen
- fachliche Defaults duerfen in `config/` liegen, muessen aber spaeter durch Admin- oder API-Daten ersetzbar sein
- Rollenansichten konsumieren dieselben semantischen Datenmodelle mit unterschiedlichen Layouts

### Ziel

Spaetere Felder wie zum Beispiel:

- Allergene
- Gang
- Rabatt
- Bon-Notiz
- Prioritaet
- Zahlungsart
- Lieferstatus

sollen ueber dieselbe modulare Struktur ergaenzt werden koennen, ohne die Grundarchitektur umzubauen.

Das gilt explizit auch fuer:

- neue Getraenkearten
- neue Speisenarten
- saisonale Kategorien
- temporaere Festartikel
- stationsspezifische Status

## Screen-Richtung pro Rolle

### Bedienung

Zielbild:

- obere schmale Kontextzone
- grosser Produktbereich
- feste Order-Zusammenfassung
- permanente Bottom-Action-Bar

Wichtige Komponenten:

- `TablePicker`
- `CategoryTabs`
- `ItemGrid`
- `DraftOrderPanel`
- `BottomActionBar`
- `InlineMessageEditor`

Hinweis:

- `CategoryTabs` ist nur ein moegliches Darstellungsmuster.
- Die zugrunde liegenden Kategorien muessen aus konfigurierbaren Daten kommen.
- Auf iPad darf fuer die Bedienung optional ein 2-Zonen-Layout aus Artikelauswahl und Draft-Order verwendet werden, solange die Hauptaktion unten bleibt.

### Theke

Zielbild:

- Ticket-Board fuer Getraenke
- schnelle Statuswechsel
- neue Tickets deutlich hervorgehoben
- auf iPad als Mehrspalten-Lane moeglich

Wichtige Komponenten:

- `StationHeader`
- `StationFilters`
- `StationLane`
- `OrderTicket`
- `SwipeActionOverlay`

Hinweis:

- `StationFilters` und Lanes duerfen keine fest verdrahteten Statuslisten erwarten.
- Die Lane-Struktur muss aus Stations- oder Statuskonfiguration aufgebaut werden koennen.

### Kueche

Zielbild:

- Ticket-Board fuer Speisen
- Fokus auf Priorisierung und Fertigmeldung
- Nachrichten sofort sichtbar
- auf iPad mit breiterem Passlayout

Wichtige Komponenten:

- `KitchenLane`
- `KitchenTicket`
- `ItemStatusAction`
- `TicketMessageStrip`

Hinweis:

- `KitchenLane` ist ein UI-Muster, keine harte Domaintypisierung.
- Speisenarten, Prioritaeten und Teilstatus muessen datengetrieben erweiterbar bleiben.

### Admin

Zielbild:

- sachliche Betriebsansicht
- reduzierte Uebersicht ueber alle Stationen
- kein dekoratives Dashboard

## Responsive Regeln

### Breakpoints

Breakpoints dienen der Verdichtung, nicht einem kompletten Designwechsel.

Richtung:

- `phone`: Standard bis ca. `767px`
- `tablet`: ab ca. `768px`, mehr Spalten, mehr sichtbare Tickets
- `desktop`: optional spaeter, keine Prioritaet fuer Kernbetrieb

### Grundsatz

Die Bedienlogik bleibt auf allen Geraeten touch-first.

Das heisst:

- keine nur mit Maus sinnvollen Muster
- keine winzigen Targets auf groesseren Displays
- keine Hover-Abhaengigkeit
- keine schleichende Rueckkehr zu Desktop-Navigation auf dem iPad

## Styling-Regeln

### Verbindlich

- CSS-Variablen fuer Farben, Abstaende, Radien, Groessen
- Komponenten referenzieren nur Tokens
- keine hartcodierten Farben in Einzeldateien
- keine Einzelfall-Optik pro View, wenn das Designsystem es loesen kann

### Bevorzugt

- globale Tokens in `tokens.css`
- Basisregeln in `main.css`
- komponentennahe Styles nur fuer Struktur, nicht fuer neue Farbsysteme
- Theme-Umschaltung zentral ueber ein Theme-Modul oder Store, nicht verteilt ueber Einzelkomponenten

## No-Go-Liste

Nicht einfuehren:

- Burger-Menue fuer Kernnavigation
- grosse Hero-Panels
- Glassmorphism
- Schatten-Design
- bunte Gradient-Flaechen
- Hover-zentrierte UX
- modale Kernprozesse
- kleine Textlinks als Hauptaktion
- unnoetige Leerflaechen
- filigrane Statusmarkierungen ohne Text

## Umsetzungsstrategie

Empfohlene Reihenfolge fuer den Frontend-Umbau:

1. Design-Tokens fuer Dark und Light Theme aufsetzen
2. zentrales Theme-Switching ohne Komponenten-Duplikation einfuehren
3. `BaseButton`, `BaseCard`, `StatusBadge`, `BottomActionBar` als UI-Grundbausteine bauen
4. eine einzige mobile Kernansicht fuer `bedienung` inkrementell umbauen
5. diese Ansicht auf konfigurierbare Kategorien und Artikelstrukturen umstellen
6. danach `theke` als erstes Ticket-Board in kleiner Iteration aufbauen
7. dann `kueche` mit denselben Ticket-Prinzipien erweitern
8. iPad-Verdichtung je Rolle erst nach stabiler Phone-Basis ergaenzen
9. `admin` fuer Konfiguration und Leitstand modular anschliessen

Arbeitsregel:

- keine grossen Komplettumbauten in einem Schritt
- jede Iteration soll klein genug sein, um sichtbar pruefbar zu bleiben
- erst Basis stabilisieren, dann neue Rolle oder neues Layout anfassen
- keine Vermischung von Theme-Umbau, Navigationsumbau und fachlicher Komplexitaet in einem PR

## Teststrategie

Wenn Interaktion, Austauschbarkeit oder Theme-Verhalten geaendert werden, sind Tests Teil der Umsetzung.

Verbindliche Testschwerpunkte:

- Komponenten-Tests fuer Varianten von `BaseButton`, `StatusBadge`, `BottomActionBar` und Ticket-Komponenten
- Tests fuer Theme-Umschaltung zwischen Dark und Light
- Tests fuer schema- oder konfigurationsgetriebene Renderpfade
- Responsive-Tests fuer Smartphone- und Tablet-Viewport
- Interaktionstests fuer Press-State, Bottom-Action-Erreichbarkeit und Swipe-Aktionen

Regel:

- bei kleinen strukturellen UI-Schritten genuegen gezielte Unit- oder Component-Tests
- bei neuen Kernablaeufen kommen zusaetzlich View- oder E2E-Tests dazu

## Status dieses Dokuments

Diese Richtlinie gilt ab jetzt als Design-Basis fuer weitere Frontend-Arbeit.

Wenn spaeter Farben, Felder oder Rollen erweitert werden, soll dieses Dokument zuerst angepasst werden, bevor die UI inkonsistent weiterwachsen kann.
