ENDURANCE — GEMEINSAM BIS LE MANS
Version 1.0.0 | Deutsch | Stand: 18.09.2026

STARTEN
=======
Am Computer: ZIP vollständig entpacken und index.html in einem aktuellen
Browser öffnen. Die separat gelieferte ENDURANCE-Spiel.html enthält das
Spiel ebenfalls vollständig. JavaScript muss aktiviert sein.
Fürs Spielen sind weder Node.js noch Python, ein Konto oder ein API-Schlüssel
nötig. Der Spielcode lädt keine Bibliotheken, Schriftarten oder Bilder aus
externen Quellen nach.

Auf dem iPhone und für einen Link zum Teilen: Die Dateien index.html,
manifest.webmanifest, sw.js, icon-192.png und icon-512.png gemeinsam bei
einem statischen HTTPS-Webhost veröffentlichen. Danach die Website im
Browser aufrufen. Eine Dateivorschau im Chat oder in einer Datei-App ist
nicht derselbe Startweg wie eine veröffentlichte Website.
Dieses Paket ist NICHT bereits im Internet veröffentlicht.

Für Entwicklung/Tests kann im entpackten Verzeichnis ein lokaler Server
laufen: python -m http.server 8000
Danach http://localhost:8000 im Browser aufrufen. Dieser lokale Server ist
kein öffentlicher Spiel-Link und kein Server auf dem Handy.

DEIN ERSTES SPIEL
================
Fahrerkarriere: Du beginnst in GT4 mit einer eigenen Fahrerfigur und zwei
Teamkollegen. Name, Alter und Nationalität lassen sich ändern.
Managerkarriere: Du wählst GT4, GT3, LMP3, LMP2 oder Hypercar als Startklasse.
24h-Challenge: Direkt in ein Hypercar bei Le Mans einsteigen. Auch hier
stehen Fahrer- und Managerrolle zur Wahl. Ein eigener Speicherplatz wird
angeboten; belegte Plätze werden erst nach Rückfrage ersetzt.

Vor dem Rennen: Eine kostenlose Vorbereitung auswählen, Stintplan,
Reifenstrategie und Qualifying-Risiko festlegen. Dann Qualifying & Rennen
starten. Im Rennen eine Entscheidung wählen. Ohne Entscheidung steht die
Spielzeit still; Tabellen, Kalender und Teamseiten lassen sich jederzeit
ansehen. Tasten 1, 2 und 3 wählen die sichtbaren Rennoptionen. Escape
schließt ein Dialogfenster.

Rennzeit ist simuliert, nicht echte Wartezeit. Schnell simuliert je nach
Rennen 20 oder 60 Minuten pro Entscheidung, Standard 10 oder 30 Minuten.
Der letzte Abschnitt wird auf die verbleibende Renndauer begrenzt. Ein
24h-Rennen dauert also nicht 24 echte Stunden. Änderungen am Spieltempo
gelten ab dem nächsten Rennen.

WAS BEREITS SPIELBAR IST
=======================
- Fahrer- und Managerkarriere, mehrere Saisonen, Verträge, Klassenwechsel,
  garantierte Fortsetzung, Karrierechronik und Erfolge.
- GT4/GT3 sowie LMP3/LMP2/Hypercar als verzweigte Karrierewege. Auch GT3
  (als LMGT3-Spielklasse) und LMP2 erreichen Le Mans.
- Ein gemeinsames Auto: Tank, Reifen und Schäden gehören dem Fahrzeug.
  Der nächste Fahrer übernimmt dessen Zustand. Fahrer haben individuelle
  Werte für Tempo, Konstanz, Regen, Nacht, Reifen und Teamwork.
- Autonome Teamkollegen, eigene Fahrzeit, Ermüdung und Erholung. Kurze
  Rennen mit zwei aktiven Fahrern, längere mit drei. Die automatische
  Boxencrew plant Tankstopps und Wechsel. Manuelle Aufträge sind möglich.
- Qualifying, Startaufstellung, Wetterwechsel, Tag/Nacht, vereinfachte
  Neutralisierungen, Mehrklassenfelder, Reifenwahl, Reparaturen, Zeitverlust,
  Fahrer- und Teamwertung sowie individuelle Stintbeiträge im Ergebnis.
- Manager: Fahrer verpflichten, zulässige Aufstellungen beachten,
  Fahrzeugqualität, Haltbarkeit und Boxencrew verbessern, Sponsor wählen.
- Fahrer: Fähigkeiten trainieren, den eigenen Stint beeinflussen, in der
  Pause regenerieren oder das Team unterstützen. Kritische Boxenentscheidungen
  bleiben gemeinsame Teamentscheidungen.
- Saisonabschluss mit Vertrag; optional dauerhafter Wechsel vom Fahrer
  zum Manager ohne Verlust der bisherigen Chronik.
- Drei lokale Speicherplätze, automatische Speicherung, JSON-Export und
  geprüfter JSON-Import. Ein unterbrochenes Rennen lässt sich fortsetzen.

SPIELSTÄNDE SCHÜTZEN
===================
Unter 'Speichern & Hilfe' regelmäßig eine JSON-Sicherung exportieren.
Speicherplätze sind an den Browser und den Speicherort/die Website gebunden.
Ein anderes Gerät, ein anderer Browser, das Löschen der Browserdaten oder
das Verschieben einer lokalen HTML-Datei kann die bisherigen lokalen
Speicherplätze unzugänglich machen. Zum Umziehen exportieren/importieren.
Nicht denselben Speicherplatz gleichzeitig in mehreren Tabs spielen.
Ist lokales Speichern blockiert, wird eine Warnung eingeblendet. Spielen
in der geöffneten Sitzung bleibt möglich; vor dem Schließen exportieren.
Es gibt keine automatische Cloud-Synchronisierung.

OFFLINE / WEB-APP
=================
Das lokale HTML-Spiel benötigt zum Spielen kein Internet. Die Website-
Version enthält außerdem ein Manifest und einen Service Worker für die
Offline-Zwischenspeicherung nach dem ersten erfolgreichen Online-Aufruf.
Installation/Startbildschirm und dauerhafte Speicherung hängen vom Browser
und dessen Einstellungen ab. Die PWA benötigt HTTPS oder localhost.
Die Anwendung setzt keinen Server, keine Datenbank und keine KI-API voraus.
Die weiterführenden Quellenlinks in der Hilfe benötigen Internet.

BEWUSSTE VEREINFACHUNGEN
=======================
Dies ist ein eigenständiges Entscheidungsspiel, keine lizenzierte oder
regelgetreue FIA-/ACO-/SRO-Simulation. Teams, Fahrer, Herstellerbezeichnungen,
Preise, Fähigkeiten und Saisonkalender sind fiktiv. Die Saison startet in
einer Spielwelt 2027; sie ist kein offizieller Kalender.

Bronze, Silber, Gold und Platin sind vereinfachte Spieleinstufungen, keine
von der FIA erteilten Einstufungen. Die Entwicklung im Spiel entspricht
keiner allgemeinen realen Aufstiegsregel. Besetzungsprüfungen und Stintlängen
sind vereinfachte Regeln; reale Mindest-/Höchstfahrzeiten, Lizenzierung,
Einladungen, Homologation und veranstaltungsspezifische Sonderregeln werden
nicht vollständig nachgebildet. Le Mans liegt in den entsprechenden
Spielkalendern, ohne separates reales Einladungsverfahren.

GT2 und das historische GT1 sind keine weiteren automatischen Stufen.
24h-Rennen geben im Spiel doppelte Punkte. Safety Car/FCY verlangsamen das
Feld und verändern die Boxenverluste, ohne das vollständige reale Verfahren.
Mehrklassenfelder und Überrundungsentscheidungen sind abstrahiert, nicht als
3D-Physiksimulation umgesetzt. Schäden sind ein gemeinsamer Gesamtwert,
keine separat simulierten Fahrzeugteile. Herstellerverbundenheit wird als
Karrierewert geführt; es gibt noch keinen eigenen Herstellermodus oder
Fahrzeugkonstruktor. Keine Online-Liga und kein Mehrspielerbetrieb.

QUELLCODE / WEITERENTWICKLUNG
===========================
src/data.js     Klassen, Kalender, Teams, Personen, Spielwerte.
src/engine.js   Deterministische, JSON-speicherbare Karrieresimulation.
src/app.js      Oberfläche, Bedienung und lokale Speicherplätze.
src/style.css   Responsive Gestaltung.
src/shell.html  HTML-Vorlage.
build.cjs       Bündelt die Quellen in index.html.
sw.js           Offline-Cache für veröffentlichte Website.

Nach Änderungen: node build.cjs
Logik-/Offline-Cache-Tests: node --test tests/*.cjs
Oberflächenprüfung: python tests/browser_test.py
Letztere benötigt Python Playwright und Chromium; sie verwendet in dieser
Prüfumgebung eingespeistes HTML und einen isolierten Speicheradapter,
weil die verwaltete Browsernavigation gesperrt ist. Für das reine Spielen
sind diese Entwicklungsprogramme nicht erforderlich.

Prüfumfang und Grenzen stehen in PRUEFBERICHT.txt.
