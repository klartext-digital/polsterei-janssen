# Tracking einrichten (Google Tag Manager, GA4, Google Ads)

Stand 16.09.2026. Die Seite ist statisches HTML ohne CMS. Alles Tracking läuft über **einen Google-Tag-Manager-Container**; im Code muss nur dessen ID eingetragen werden.

## Was vorbereitet ist
- `assets/einwilligung.js`, eingebunden im `<head>` aller Seiten (Startseite, Impressum, Datenschutz).
- Eigenes Einwilligungsfenster: „Nur notwendige" / „Alle akzeptieren" / Einstellungen (Statistik, Marketing). Link „Cookie-Einstellungen" in der Fusszeile zum Ändern und Widerrufen. Beim Widerruf werden `_ga`/`_gcl`-Cookies gelöscht und die Seite neu geladen.
- **Google Consent Mode v2**, Standard für alle vier Signale `denied`, `ads_data_redaction: true`.
  - Statistik → `analytics_storage`
  - Marketing → `ad_storage`, `ad_user_data`, `ad_personalization`
- **Basic Consent Mode**: Der GTM-Container wird erst geladen, wenn Statistik oder Marketing erlaubt wurde. Ohne Zustimmung gibt es keine Verbindung zu Google, also auch keine cookielosen Pings und keine Modellierung aus Nicht-Zustimmern.
- Datenschutzerklärung: Die Abschnitte zu GTM, GA4 und Google Ads erscheinen automatisch, sobald die ID eingetragen ist.

## Schritt 1: ID eintragen (macht KLARTEXT)
GTM-Container-ID (Web, `GTM-XXXXXXX`) schicken. Sie kommt in `assets/einwilligung.js`, Zeile `var GTM_ID = '';`. Mehr ist im Code nicht nötig.
Vorschau des Fensters ohne ID: `https://www.polstereijanssen.de/?einwilligung-test`

## Schritt 2: dataLayer-Ereignisse (im GTM nutzen)
| event | Parameter | Zweck |
|---|---|---|
| `anfrage_gesendet` | `moebel`, `leistung`, `zeitrahmen`, `fotos_anzahl`; bei Marketing-Zustimmung zusätzlich `user_data.email`, `user_data.phone_number` (E.164) | Primäre Conversion: Formular vom Server bestätigt |
| `anfrage_mailprogramm` | wie oben, ohne user_data | Server nicht erreichbar, Mailprogramm geöffnet. Keine verlässliche Conversion, höchstens sekundär |
| `kontakt_klick` | `kontakt_art` = `telefon` / `whatsapp` / `email`, `link_bereich`, `link_text` | Sekundäre Conversions (Klick, kein bestätigter Anruf) |
| `einwilligung_aktualisiert` | `statistik`, `marketing` | Info |

Es gibt **keine Danke-Seite**. Das Formular sendet per fetch, also Conversions per **Benutzerdefiniertes Ereignis** auslösen, nicht per Seitenaufruf.

## Schritt 3: Tags im GTM (Vorschlag)
1. **Google-Tag** (GA4 `G-…`), Trigger: Initialization – All Pages.
2. **GA4-Ereignisse** `generate_lead` (Trigger `anfrage_gesendet`) und `kontakt_klick` (mit Parameter `kontakt_art`).
3. **Conversion Linker**, All Pages.
4. **Google Ads Conversion-Tracking** (`AW-…` + Label) für `anfrage_gesendet`; optional eigene Aktionen je `kontakt_art`.
   - Erweiterte Conversions: Variable „Vom Nutzer bereitgestellte Daten" → manuell → E-Mail = DLV `user_data.email`, Telefon = DLV `user_data.phone_number`. GTM hasht selbst. Die Daten stehen nur bei Marketing-Zustimmung im dataLayer.
   - In Google Ads die Kundendatenbedingungen für erweiterte Conversions akzeptieren.
5. Optional **Google Ads Remarketing**.
6. Einwilligungsprüfung im GTM aktivieren. Tags brauchen zusätzlich `analytics_storage` bzw. `ad_storage` (Consent Mode ist schon gesetzt).

## Einstellungen, auf die sich die Datenschutzerklärung verlässt
- GA4: Datenaufbewahrung **14 Monate** (Verwaltung → Datenerfassung → Datenaufbewahrung).
- GA4: Google-Signale nur, wenn gewünscht (sonst Datenschutztext anpassen).
- GA4 und Ads: Datenverarbeitungsbedingungen akzeptieren.
- Werden weitere Dienste eingebaut (Meta-Pixel, Hotjar, Microsoft Ads …), müssen Einwilligungsfenster und Datenschutzerklärung vorher erweitert werden.

## Anruf-Conversions
`kontakt_klick` mit `kontakt_art: telefon` misst nur das Antippen der Nummer. Echte Anrufe von der Website misst Google Ads nur mit Google-Weiterleitungsnummern (Website-Anrufe). Die brauchen ein zusätzliches Script, das die Nummer auf der Seite austauscht; das wäre ein Umbau und muss vorher abgesprochen werden. Anrufe direkt aus der Anzeige (Anruferweiterung) laufen ohne Website.

## Zugang
Für GTM, GA4 und Ads braucht der Experte keinen Hosting-Zugang. Er legt Container und Konten an und gibt der Polsterei Janssen Inhaber- bzw. Admin-Rechte darauf.
