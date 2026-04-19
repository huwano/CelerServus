Du entwickelst eine hochfrequente Mobile-POS-Web-App für ein Weinfest (Ansichten: Bedienung, Theke, Küche). Ab sofort gelten für jede Ansicht, die du generierst oder anpasst, die folgenden extremen Layout- und Platzökonomie-Regeln. Wende diese Prinzipien universell auf alle Komponenten an:

1. Radikale Header- und Navigations-Reduzierung

   Regel: Der obere Bereich (Header, globale Navigation) darf auf keinem Screen mehr als 10% (max. 50-60px) der Bildschirmhöhe einnehmen.

   Verbot von Text-Buttons: Sekundäre Aktionen (Einstellungen, Abmelden, Modus-Wechsel, Filter) dürfen niemals als Text-Buttons dargestellt werden. Nutze immer kompakte, eindeutige Icons (z.B. Zahnrad, User-Avatar, Sonne/Mond).

   Titel: Screen-Titel ("Service Hub", "Küche", "Theke") müssen einzeilig, kompakt und in der Schriftgröße reduziert sein.

2. Kontextbasiertes UI (Conditional Rendering)

   Regel: Platzfressende Aktions-Bereiche (wie Warenkörbe, Bestell-Zusammenfassungen, Senden-Buttons) dürfen nur dann groß sichtbar sein, wenn sie benötigt werden.

   Leere Zustände (Empty States): Wenn eine Liste oder ein Warenkorb leer ist, zeige keinen riesigen Kasten mit "Nichts vorhanden" an. Reduziere diesen Bereich auf einen absoluten Minimal-Balken oder verstecke die primären Aktions-Buttons komplett, bis der Nutzer eine Eingabe macht.

3. "Zero-Tutorial" & Eliminierung von Formular-Müll

   Keine Hilfetexte: Bedienungen sind geschultes Personal. Lösche ALLE erklärenden Texte im UI (z.B. "Hier tippen, um hinzuzufügen").

   Keine Dropdowns: Nutze niemals HTML-Select-Dropdowns für wichtige Filter oder Kategorien. Nutze immer sofort sichtbare, horizontal scrollbare Tabs (Pills) für den 1-Klick-Zugriff.

   Textfelder minimieren: Verstecke optionale Eingabefelder (wie Notizen, Sonderwünsche oder Text-Suche) hinter kleinen Icons. Sie dürfen das Standard-Layout nicht verstopfen. Die Tastatur darf sich nie unerwartet öffnen.

4. Maximierung des Arbeitsbereichs (Die 80/20 Regel)

   Regel: Mindestens 80% des Bildschirms MÜSSEN für den eigentlichen Arbeitsinhalt (das Grid mit den Getränken/Speisen für die Bedienung ODER die Listen-Ansicht der offenen Bestellungen für Theke/Küche) reserviert sein.

   Spacing & Padding: Vermeide "luftige" Web-Designs. Reduziere Abstände (Paddings/Margins) zwischen Listen-Elementen und Kacheln auf ein Minimum (max. 4-8px), ohne dass Touch-Targets verschmelzen.

5. Button- & Touch-Architektur

   Chunky but Compact: Primäre Aktions-Elemente (Artikel-Kacheln, Listen-Einträge abschließen) müssen großflächige Touch-Targets haben, dürfen aber keinen unnötigen Leerraum (Whitespace) in sich tragen.

   Visuelle Hierarchie: Nur die allerwichtigste Aktion auf einem Screen (z.B. "Bestellung abschicken" oder "Bon fertig") bekommt eine dominante, vollflächige Signalfarbe. Alles andere bleibt neutral (Grau/Schwarz/Weiß) oder ist nur umrandet (Outline).

Prüfe jeden generierten Code gegen diese 5 Regeln. Wenn dein Layout viel leeren Platz, große Texte oder Dropdowns enthält, hast du versagt. Optimiere auf maximale Informationsdichte bei gleichzeitiger Einhand-Bedienbarkeit.

admin1

Pfand system 
insgesammtes geld also abrechnungssystem mit wievie wird ggeben / wechsel geld rechner 
dinge löschen 