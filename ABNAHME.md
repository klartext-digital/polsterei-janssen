# Abnahme vor dem Livegang

Geprüft am 11.09.2026 auf dem neuen Hostinger-Server
(`mediumblue-rhinoceros-245596.hostingersite.com`).

---

## Technisch: bereit

| Prüfung | Ergebnis |
|---|---|
| Alle Seiten, Bilder, Videos | 200, nichts fehlt |
| Weiterleitungen der 8 alten Wix-Adressen | greifen, auch `/über-uns` in beiden Schreibweisen |
| 12 alte Vorlagen-Produktseiten + Shop-Kategorie | gehen auf die Startseite |
| Eigene Fehlerseite | greift statt Hostingers Standardseite |
| Kompression | **Brotli** aktiv |
| Zwischenspeicher | Bilder/Videos 1 Jahr, HTML 10 Minuten |
| Schutz-Kopfzeilen | alle drei gesetzt |
| PHP / Anfrageformular | läuft, Prüfungen und Spamschutz greifen |
| Projektnotizen (.md) | von aussen nicht erreichbar |
| Upload-Pakete und Hostinger-Platzhalter | entfernt |
| Darstellung Desktop + Handy | vollständig durchgesehen, keine Brüche |

### Nicht erschrecken: die Vorschau verfälscht zwei Dinge

1. **Die `robots.txt`** zeigt dort `Disallow: /` für Googlebot. Das setzt
   **Hostinger** für Vorschau-Adressen, damit Testseiten nicht in Google landen.
   Unsere eigene Datei liegt korrekt mit 304 Bytes auf dem Server.
2. **Der Domainname** wird im Flug ersetzt — alle 13 Vorkommen, auch im
   Impressum und in der Adress-Angabe für Google. Auf der Platte steht überall
   `www.polstereijanssen.de`.

**Beides muss direkt nach der Umstellung noch einmal geprüft werden.**
Falls die `robots.txt` auf der echten Domain weiterhin Google aussperrt, wäre
die Seite für die Suche unsichtbar — das wäre der einzige Fehler, der richtig
wehtut.

---

## Inhaltlich: das sollte vor dem Livegang geklärt sein

Bis jetzt lag die Seite auf einer Test-Adresse. Mit dem Umzug wird sie zum
offiziellen Auftritt eines echten Betriebs — damit gilt anderes Recht.

### 1. Erfundene Kundenstimmen und Bewertungen — dringend

Auf der Seite stehen:

- **„4,8" mit Sternen und dem Google-Logo**, dazu „Bewertungen bei Google"
- **„Über 2.000 zufriedene Kunden in Deutschland"**
- **fünf ausformulierte Kundenstimmen** mit Namen, Orten und Porträtfotos
  (Frank B. aus Krefeld-Uerdingen, Familie Legersdorf, M. Sanders,
  Familie Özdemir, R. Brinkmann) — alle **erfunden**, die Porträts KI-erzeugt

Als Entwurf war das ein Platzhalter. Auf einer echten Firmenseite ist es
Werbung mit erfundenen Bewertungen. Das ist in Deutschland abmahnfähig, und
eine fremde Google-Bewertungszahl darzustellen, die es nicht gibt, ist der
heikelste Punkt davon.

**Drei Wege:** echte Google-Rezensionen von Gigi holen und einsetzen · den
Bereich vorerst herausnehmen · oder klar als Beispiel kennzeichnen. Ich mache
keinen davon ohne deine Ansage.

### 2. Bilder sind alle KI-erzeugt

Sämtliche Fotos sind Platzhalter, auch die **Vorher/Nachher-Paare**. Gerade die
zeigen ein Arbeitsergebnis, das es so nie gab. Für einen Handwerksbetrieb ist
das der Bereich, wo echte Fotos am meisten bringen — und am wenigsten Ärger.

### 3. Widersprüchliche Adresse

Das alte Impressum sagt **Buschstraße 244, 47800 Krefeld**, der alte
Datenschutztext **Bruchstraße 14, 47829 Krefeld**. Ebenso **Ewaldstraße**
gegen **Elwaldstraße** bei der Zweigstelle.

Aktuell steht überall die erste Fassung — im Impressum, im Footer und in den
strukturierten Daten für Google. Eine falsche Impressumsadresse ist für sich
genommen schon ein Risiko. Muss Gigi bestätigen.

### 4. Impressum ist unvollständig

Übernommen von der alten Wix-Seite, nie geprüft. Es fehlen die Angaben, die
bei einem Handwerksbetrieb üblicherweise dazugehören:

- Umsatzsteuer-Identifikationsnummer (oder der Hinweis, dass keine vorliegt)
- Zuständige **Handwerkskammer**, Berufsbezeichnung und Verleihungsstaat
- Hinweis zur Verbraucherschlichtung
- Es steht nur die **Mobilnummer** drin, nicht der Festnetzanschluss
  02151 351 20 55

Ich bin kein Anwalt — das sollte jemand prüfen, der es ist.

### 5. „Über 10.000 Stoffe zur Auswahl"

Kommt von Gigi, ist aber nicht belegt. Sein Haus, seine Aussage — nur sollte
er wissen, dass sie auf der Seite steht.

### 6. Kleinigkeit: Rechtsseiten im alten Gewand

Impressum und Datenschutz laufen noch auf der grauen Palette, nicht auf
Creme/Gold wie der Rest.

---

## Reihenfolge für den Livegang

1. Vorschau anschauen und freigeben
2. Punkte 1 bis 4 oben klären
3. **DNS umstellen** (der eigentliche Umzug, nur du)
4. SSL ausstellen lassen
5. `robots.txt` und Impressum auf der echten Domain prüfen
6. Eine Testanfrage über das Formular, danach SPF-Eintrag setzen
7. Sitemap in der Google Search Console einreichen
8. Erst wenn alles läuft: Wix kündigen
