# Schrift- und Ausrichtungsregeln

Eine Schrift: **Switzer**. Kein zweiter Schriftschnitt, keine zweite Familie.
Maßgeblich ist die Zahlen-Sektion — alles andere folgt ihr.

## Die sechs Rollen

| Rolle | Größe | Schnitt | Laufweite | Ausrichtung | Farbe |
|---|---|---|---|---|---|
| **Label** `[ Text ]` | 13 px | 500 | +.02em | **links** | Ink, Klammern orange |
| **Sektionstitel** | clamp 42 → 116 px | **700** | −.045em | **rechts** | Ink |
| **Aussage** (große Zeile) | clamp 26 → 52 px | **700** | −.03em | **rechts** | Ink, Aufbau Wort für Wort |
| **Zwischentitel** (Karten, Kacheln) | clamp 17 → 27 px | 600 | −.018em | **links** | Ink |
| **Fließtext** | 16 px | 300 | 0 | **links** | Ink 62 % |
| **Zahl** | clamp 54 → 96 px | **700** | −.045em | links | Ink, Einheit orange |

Dazu: **Knopf** 13 px / 600 / +.13em / Versalien.

## Ausrichtung

- **Nichts auf der Seite ist zentriert.** Ausgenommen sind nur Beschriftungen *innerhalb* von Knöpfen.
- **Label immer links**, in derselben Zeile wie der Titel.
- **Titel, Aussage und Sektionsbeschreibung immer rechtsbündig** — sie bilden zusammen einen rechten Block.
- **Fließtext in Karten und Kacheln immer linksbündig.**
- Titel und Fließtext stehen **nie** auf gleicher Höhe links gegen rechts. Der Titel steht oben rechts, der Text darunter — ebenfalls rechts.

## Labels

Alle Unterüberschriften tragen dieselbe Form: `[ Unsere Zahlen ]`, `[ Vorher / Nachher ]`,
`[ Die Werkstatt ]`, `[ Was wir können ]`, `[ Wer wir sind ]`, `[ Kundenstimmen ]`, `[ Verlässlich ]`.
Klammern in Orange, Text in Ink. Keine Punkte, keine Quadrate, keine Versalien mehr.

## Radien

Sektionen **26 px** (Token `--r`), Karten und Kacheln **20 px** (Token `--rk`). Sonst nichts.

## Farbe

Orange (`#E8500A`) nur als Signal: Klammern, Einheiten hinter Zahlen, hervorgehobene
Begriffe, Auswahl und Fortschritt im Formular, Fokus, Hover. Nie flächig, nie als Textfarbe
für ganze Absätze. Für kleine Schrift auf Weiß `--orange-d`, auf Graphit `--orange-h`.

## Knopf (CTA)

**Ein einziges Knopfbild auf der ganzen Seite** — auf hellem Grund und auf Fotos exakt
gleich: weisse Pille, hauchduenner Rand, orangefarbener Kreis links, weisser Pfeil darin.
Keine Glas-/Transparenzvariante mehr, kein dunkler Zwilling.

Groessen ueber `--h`: Seite 58 px, Navigation 46 px. Der Kreis ist immer `--h` minus 10 px,
der Pfeilkasten `--h` minus 14 px. Beschriftung 13 px / 600 / Versalien / 0.13em.

**Hover (1:1 nach der Framer-Vorlage Viper):**
1. Der orange Kreis **waechst nach rechts zur vollen Pille** — Radius bleibt 999 px,
   die Vorderkante ist also rund. Nie ein Balken mit gerader Kante.
2. Die Fuellung ringsum 5 px innerhalb des Knopfes, der helle Rand bleibt als Ring sichtbar.
3. Die Beschriftung faehrt nach oben aus dem Fenster, eine zweite, weisse Kopie
   kommt von unten nach — deshalb steht der Text doppelt im HTML (zweite Kopie `aria-hidden`).
4. Der Pfeil wandert nach rechts hinaus, ein zweiter kommt von links nach.
5. Farbe der Fuellung wechselt von `--orange` auf `--orange-d`, damit weisse Versalien
   darauf 5.1:1 Kontrast haben.

Zeit 0.62 s, `cubic-bezier(.22,1,.36,1)`. Alles reines CSS, kein JS, keine Breitenmessung.

## Abstände zwischen den Sektionen

Zwischen zwei Inhalten liegt **immer genau `--sec-y`** (bis 170 px). Damit das
aufgeht, gibt es zwei Fälle:

- **Zwei helle Sektionen** teilen sich den Abstand: jede bringt `--sec-halb` mit
  (`--sec-y / 2`). Zusammen ergibt das wieder eine volle Einheit.
- **Ein farbiger Block** (Vorher/Nachher, Ablauf, Kontakt) trägt seinen vollen
  Innenabstand selbst. Weil seine Kante wie Inhalt wirkt, legt der Nachbar
  ebenfalls die volle `--sec-y` an — nicht die Hälfte.

Reihenfolge und Werte: hero 86/0 · stats 170/170 · ba 170/170 · svc 170/85 ·
werk 85/85 · wwa 85/170 · proc 170/170 · tst 170/170 · kontakt 112/74 (geht in
den Footer über). Keine Sektion darf ohne oberen Abstand auf der vorherigen kleben.

## Bewegung auf grossen Flächen

Grosse Karten (Kundenstimmen) werden beim Hover **nicht verschoben**. Ein
animiertes `transform` legt das Element auf eine eigene Ebene, die zwischen zwei
Pixeln neu gezeichnet wird — davon werden die runden Ecken während der Bewegung
unsauber. Das Anheben übernimmt der Schatten. Der Rand wechselt von hell zu
dunkel (nie zu transparent), damit an der Kante kein heller Saum aufblitzt.

## Schriftschnitte – Stand 31.08.2026 geprüft

Eine einzige Schrift auf der ganzen Seite: **Switzer**. Kein zweiter Font, nirgends.
Die Schnitte sind nach Rolle vergeben, quer über alle Sektionen gleich:

| Rolle | Grösse | Schnitt | Laufweite | Beispiel |
|---|---|---|---|---|
| Titel | clamp 40–116 | **700** | −.045em | „Leistungen", „Wir polstern Ihr Lieblingsstück neu" |
| Aussage | clamp 27–58 | **700** | −.03em | „Eigene Werkstatt…", „Sprechen wir darüber.", „Sprechen wir.", Leistungs-Titel |
| Zahl | clamp 54–150 | **700** | −.045em | 2.500+, 98 %, die 01–04 im Ablauf |
| Zwischentitel | clamp 17–35 | **600** | −.018em | „Formular ausfüllen", „Was dürfen wir polstern?", Zahlen-Beschriftungen |
| Fliesstext | 16 | 300 | normal | alle Absätze |
| Label | 13 | 500 | .02em | `[ Was wir können ]`, auch die Punkte im Kopfbild |

Eigene, bewusst leichtere Rollen: **Zitat** (22 / 400) in den Kundenstimmen,
**Navigation** (24 / 400 im Footer, 13 / 400 in Versalien oben) und der
**Vorspann** auf den Leistungsbildern (20 / 400).

## Radien

Grosse Flächen `--r` = `clamp(26px, 2.6vw, 40px)` — Kopfbild, graue Fläche,
Ablauf, Kontakt. Auf grossen Blöcken muss der Radius mitwachsen, sonst wirkt
die Ecke eckig. Karten und Kacheln bleiben bei `--rk` = 20 px.

## Knopf-Grösse

Es gibt **eine** Knopfgrösse: 58 px hoch, Beschriftung 13 px. Auch in der
Navigation. Auf dem Handy (≤ 860 px) verschwindet der Knopf aus der Kopfzeile,
weil er dort das Logo erdrücken würde — der Weg zur Anfrage steht im Menü
und im Kopfbild.

## Kopfzeile beim Scrollen

Oben liegt die Leiste über die volle Breite auf dem Seitengrund. Ab 40 px Scroll
zieht sie sich in **einer Bewegung** (0,6 s, weiches Ausrollen) zu einer
schwebenden Pille zusammen: Breite auf max. 1180 px, Höhe 88 → 74 px, Radius auf
999 px, Grund milchig (`rgba(244,244,244,.78)` plus 20 px Weichzeichner), feiner
Rand und weicher Schatten. Das Logo geht von 48 auf 39 px mit.

Die Kopfzeile blendet sich beim Runterscrollen **nicht** mehr weg — sonst
bekäme man den Übergang nie zu sehen und der Weg zur Anfrage wäre weg.
Bei `prefers-reduced-motion` bleibt die Leiste unverwandelt stehen.
