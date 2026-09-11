# Umzug von Wix zu Hostinger — Ablaufplan

Stand 11.09.2026. Domain: **polstereijanssen.de**

---

## Was ich vorher geprüft habe

**Zwei Befunde, die den Umzug deutlich entspannen:**

1. **Es hängt keine E-Mail an der Domain.** Ich habe die MX-Einträge abgefragt:
   es gibt keine. Gigi nutzt GMX und Gmail, beides unabhängig von dieser Domain.
   Beim DNS-Wechsel kann also keine Post verlorengehen — das ist sonst das
   grösste Risiko bei so einem Umzug.

2. **Die Seite selbst musste nicht umgebaut werden.** Alle Pfade sind relativ,
   sie läuft auf jeder Adresse. Es fehlten nur die Dateien, die eine echte
   Domain braucht (Serverregeln, Weiterleitungen, Suchmaschinen-Dateien).
   Die sind jetzt da.

**Was auf der alten Wix-Seite steht** (aus deren Sitemap gezogen):

| Alte Adresse | Landet künftig auf |
|---|---|
| `/` | Startseite |
| `/impressum` | `/impressum.html` |
| `/datenschutz` | `/datenschutz.html` |
| `/cookies` | `/datenschutz.html` |
| `/kontakt` | Startseite, Abschnitt Anfrage |
| `/projekte` | Startseite, Vorher/Nachher |
| `/über-uns` | Startseite, Werkstatt |
| `/inquiry-services-page` | Startseite, Anfrage |
| `/product-page/…` (12 Stück) | Startseite |
| `/category/all-products` | Startseite |

Die zwölf Produktseiten heissen alle „Das ist ein Produkt 1–11" — das sind
unbenutzte Reste der Wix-Vorlage, die Google trotzdem indexiert hat. Die
verschwinden mit dem Umzug, das ist ein Gewinn.

**Ohne diese Weiterleitungen landet jeder bisherige Google-Treffer auf einer
Fehlerseite.** Sie stecken in der Datei `.htaccess` und werden automatisch
mit hochgeladen.

---

## Stand: was schon erledigt ist

**Auf Hostinger eingerichtet (11.09.2026):**

- Website unter **polstereijanssen.de** angelegt, Serverstandort **Frankfurt**
  (13 ms, Sicherungen innerhalb der EU)
- Alle 57 Dateien liegen in `public_html` und laufen
- **PHP ist aktiv** und das Anfrageformular verschickt jetzt selbst E-Mails
- Hostingers Platzhalterseite und die Upload-Pakete wieder entfernt
- Vorschau-Adresse: **https://mediumblue-rhinoceros-245596.hostingersite.com**

**Geprüft, alles in Ordnung:**

| Prüfung | Ergebnis |
|---|---|
| Alle Seiten, Bilder, Videos | 200 |
| Weiterleitungen der alten Wix-Adressen | greifen, auch `/über-uns` in beiden Schreibweisen |
| Eigene Fehlerseite statt Hostinger-Standard | greift |
| Formular: ungültige E-Mail / fehlender Name | wird abgewiesen |
| Formular: Spamschutz (Honigtopf, Zeitprüfung) | greift, ohne Mail auszulösen |

**Das Formular verschickt jetzt echte E-Mails:**

- Empfänger: `polstereijanssen@gmail.com`
- Absender: `anfrage@polstereijanssen.de` — **nicht** die Gmail-Adresse. Würde der
  Server behaupten, die Mail käme von @gmail.com, würfe Google sie als Fälschung
  weg oder steckte sie in den Spam.
- Antwort-an: die Adresse des Kunden. Gigi drückt einfach auf „Antworten".
- **Fotos reisen jetzt mit** (bis 6 Stück, 5 MB je Bild, 15 MB gesamt).
  Vorher hiess es auf der Seite, Bilder müssten per WhatsApp nachgereicht werden.
- Klappt der Versand einmal nicht, fällt das Formular automatisch auf den alten
  Weg über das Mailprogramm zurück. Es geht also nie eine Anfrage verloren.

---

## Was du tun musst

### Der einzige verbleibende Schritt: DNS umstellen
Die Domain wird aktuell von **Wix** verwaltet — die Nameserver sind
`ns12.wixdns.net` und `ns13.wixdns.net`.

Zwei Wege, Hostinger nennt dir in Schritt 1 die nötigen Werte:

- **Weg A (sauberer):** Im Wix-Konto bei der Domain die **Nameserver** auf die
  von Hostinger ändern. Danach verwaltet Hostinger alles.
- **Weg B (kleiner Eingriff):** Nameserver bei Wix lassen und dort nur den
  **A-Eintrag** und den **www-Eintrag** auf die Hostinger-Adresse zeigen lassen.

**Das ist der Moment, in dem die alte Seite verschwindet.** Deshalb erst nach
Schritt 3. Die Umstellung braucht je nach Anbieter zwischen zehn Minuten und
ein paar Stunden.

> Ich stelle DNS grundsätzlich nicht selbst um — das ist eine Live-Schaltung
> und gehört in deine Hand.

### Schritt 5 — SSL einschalten
Sobald die Domain auf Hostinger zeigt, im hPanel unter **SSL** das kostenlose
Zertifikat ausstellen lassen. Das dauert ein paar Minuten. Vorher zeigt der
Browser eine Warnung — das ist normal und verschwindet von selbst.

### Schritt 6 — Google Bescheid geben
In der **Google Search Console** die neue `sitemap.xml` einreichen:
`https://www.polstereijanssen.de/sitemap.xml`

Ein Adresswechsel muss **nicht** gemeldet werden — die Domain bleibt ja
dieselbe, nur der Server dahinter ändert sich.

### Schritt 7 — Wix erst danach kündigen
**Nicht vorher.** Solange die neue Seite nicht nachweislich läuft, ist Wix die
Rückfalllösung. Wenn alles steht und ein paar Tage sauber läuft, kann das
Wix-Abo weg.

Falls die Domain **bei Wix registriert** ist: nicht einfach das Abo kündigen,
sonst ist die Domain weg. Dann vorher zu Hostinger umziehen (Transfer) oder
die Domain-Verlängerung bei Wix separat weiterlaufen lassen.

---

## Was danach noch offen ist

- **Das Anfrageformular verschickt noch keine E-Mail selbst.** Es öffnet das
  Mailprogramm des Besuchers (`mailto:`). Auf einem echten Server mit PHP
  kann es die Anfrage direkt zustellen — deutlich weniger Absprünge. Dafür
  muss feststehen, an welche Adresse die Anfragen gehen sollen
  (`polstereijanssen@gmail.com` oder Gigis GMX-Adresse).
- **Die Adresse widerspricht sich in den alten Unterlagen**: Impressum sagt
  „Buschstrasse 244, 47800 Krefeld", der Datenschutztext „Bruchstrasse 14,
  47829 Krefeld". Beim Umzug steht die erste Fassung in den strukturierten
  Daten für Google. Das muss Gigi bestätigen — eine falsche Adresse schadet
  bei lokaler Suche mehr als gar keine.
- **Impressum und Datenschutz laufen noch auf der alten grauen Gestaltung**,
  nicht auf Creme/Gold wie der Rest.
- Die Platzhalter aus `PLATZHALTER.md` (4,8 Sterne, „über 2.000 Kunden",
  „über 10.000 Stoffe", die erfundenen Kundenstimmen) stehen weiterhin drin.
