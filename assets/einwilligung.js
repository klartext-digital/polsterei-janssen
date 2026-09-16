/* Einwilligung (Cookie-Banner) + Google Consent Mode v2 + Google Tag Manager
   ------------------------------------------------------------------------
   EINRICHTEN: nur die Container-ID unten eintragen (z. B. 'GTM-ABC1234').
   Solange sie leer ist, laedt nichts, und es erscheint kein Banner.
   Vorschau ohne ID: Seite mit ?einwilligung-test aufrufen.

   Arbeitsweise ("Basic Consent Mode"): Der Tag Manager wird erst geladen,
   wenn der Besucher Statistik oder Marketing zustimmt. Vorher geht keine
   Verbindung zu Google. Standard fuer alle Signale ist "denied".

   Ereignisse fuer den Tag Manager (dataLayer):
   - kontakt_klick     kontakt_art: telefon | whatsapp | email, link_bereich: Abschnitt
   - anfrage_gesendet  moebel, leistung, zeitrahmen, fotos_anzahl
                       + user_data {email, phone_number} nur bei Marketing-Zustimmung
                         (fuer erweiterte Conversions, GTM hasht die Werte)
   - anfrage_mailprogramm  Formular fiel auf das Mailprogramm zurueck (keine sichere Conversion)
   - einwilligung_aktualisiert  statistik, marketing
*/
(function () {
  'use strict';

  var GTM_ID = '';

  var SCHLUESSEL = 'pj-einwilligung';
  var VERSION = 1;
  var GUELTIG_TAGE = 365;
  var test = /[?&]einwilligung-test\b/.test(location.search);
  var aktiv = !!GTM_ID || test;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  });
  gtag('set', 'ads_data_redaction', true);
  gtag('set', 'url_passthrough', false);

  function lesen() {
    try {
      var w = JSON.parse(localStorage.getItem(SCHLUESSEL) || 'null');
      if (!w || w.v !== VERSION) return null;
      if (Date.now() - w.zeit > GUELTIG_TAGE * 864e5) return null;
      return w;
    } catch (e) { return null; }
  }
  function schreiben(w) {
    try { localStorage.setItem(SCHLUESSEL, JSON.stringify(w)); } catch (e) {}
  }

  var gtmGeladen = false;
  function ladeGtm() {
    if (gtmGeladen || !GTM_ID) return;
    gtmGeladen = true;
    window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(GTM_ID);
    document.head.appendChild(s);
  }

  function anwenden(w) {
    var st = w.statistik ? 'granted' : 'denied';
    var mk = w.marketing ? 'granted' : 'denied';
    gtag('consent', 'update', {
      analytics_storage: st,
      ad_storage: mk,
      ad_user_data: mk,
      ad_personalization: mk
    });
    window.dataLayer.push({ event: 'einwilligung_aktualisiert', statistik: !!w.statistik, marketing: !!w.marketing });
    if (w.statistik || w.marketing) ladeGtm();
  }

  function googleCookiesLoeschen() {
    var teile = location.hostname.split('.');
    var domains = ['', location.hostname];
    for (var i = 1; i < teile.length - 1; i++) domains.push('.' + teile.slice(i).join('.'));
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (!/^(_ga|_gid|_gat|_gcl|_gac|_uet|FPID|FPLC)/.test(name)) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  var gespeichert = lesen();
  if (aktiv && gespeichert) anwenden(gespeichert);

  /* Oeffentliche Schnittstelle fuer die Seite */
  window.pjEinwilligung = {
    aktiv: aktiv,
    stand: function () { return lesen() || { statistik: false, marketing: false }; },
    ereignis: function (name, daten) {
      var o = { event: name };
      for (var k in daten) if (Object.prototype.hasOwnProperty.call(daten, k)) o[k] = daten[k];
      window.dataLayer.push(o);
    },
    oeffnen: function () { zeigeBanner(true); }
  };

  /* Klicks auf Telefon, WhatsApp, E-Mail */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var h = a.getAttribute('href');
    var art = /^tel:/i.test(h) ? 'telefon' : /wa\.me|whatsapp\.com/i.test(h) ? 'whatsapp' : /^mailto:/i.test(h) ? 'email' : null;
    if (!art) return;
    var bereich = a.closest('section[id], footer, header, .wa');
    window.pjEinwilligung.ereignis('kontakt_klick', {
      kontakt_art: art,
      link_bereich: bereich ? (bereich.id || bereich.tagName.toLowerCase() === 'footer' && 'fusszeile' || bereich.classList.contains('wa') && 'whatsapp-knopf' || 'kopf') : 'sonstiges',
      link_text: (a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 60)
    });
  }, true);

  /* ---------------- Banner ---------------- */
  var CSS = '' +
    '.ew{position:fixed;z-index:95;left:16px;right:16px;bottom:16px;max-width:560px;' +
    'background:#221F1B;color:#F4EFE7;border:1px solid rgba(193,160,51,.45);border-radius:20px;' +
    'box-shadow:0 24px 60px rgba(0,0,0,.35);padding:22px 22px 20px;font:inherit;font-size:14.5px;line-height:1.55;' +
    'max-height:calc(100svh - 32px);overflow-y:auto;overscroll-behavior:contain}' +
    '@media (max-width:420px){.ew{left:10px;right:10px;bottom:10px;padding:18px 18px 16px;font-size:14px}}' +
    '@media (min-width:700px){.ew{left:24px;bottom:24px;right:auto;padding:26px 28px 24px}}' +
    '.ew[hidden]{display:none}' +
    '.ew h2{font-size:18px;font-weight:600;letter-spacing:-.01em;margin:0 0 8px;color:#F6F1E9;text-transform:none}' +
    '.ew p{margin:0;color:rgba(246,241,233,.78)}' +
    '.ew a{color:#E3C06A;text-decoration:underline;text-underline-offset:3px}' +
    '.ew-knoepfe{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}' +
    '.ew-knoepfe button{flex:1 1 150px;min-height:46px;padding:0 18px;border-radius:999px;font:inherit;font-size:14px;font-weight:500;cursor:pointer;' +
    'border:1px solid rgba(246,241,233,.4);background:transparent;color:#F6F1E9;transition:background .2s,border-color .2s,color .2s}' +
    '.ew-knoepfe button:hover{border-color:#F6F1E9}' +
    '.ew-knoepfe .ew-ja{background:#C1A033;border-color:#C1A033;color:#221E19}' +
    '.ew-knoepfe .ew-ja:hover{background:#E3C06A;border-color:#E3C06A}' +
    '.ew-knoepfe .ew-nein{background:#F4EFE7;border-color:#F4EFE7;color:#221E19}' +
    '.ew-knoepfe .ew-nein:hover{background:#fff}' +
    '.ew-mehr{margin-top:12px;background:none;border:0;color:rgba(246,241,233,.72);font:inherit;font-size:13.5px;text-decoration:underline;text-underline-offset:3px;cursor:pointer;padding:8px 0}' +
    '.ew-wahl{margin-top:14px;border-top:1px solid rgba(246,241,233,.14)}' +
    '.ew-wahl[hidden]{display:none}' +
    '.ew-zeile{display:flex;gap:14px;align-items:flex-start;padding:14px 0;border-bottom:1px solid rgba(246,241,233,.14)}' +
    '.ew-zeile div{flex:1}' +
    '.ew-zeile b{display:block;font-weight:600;color:#F6F1E9;margin-bottom:2px}' +
    '.ew-zeile small{display:block;font-size:13px;color:rgba(246,241,233,.66);line-height:1.5}' +
    '.ew-schalter{position:relative;flex:none;width:46px;height:28px;margin-top:2px}' +
    '.ew-schalter input{position:absolute;inset:0;opacity:0;margin:0;cursor:pointer;z-index:1}' +
    '.ew-schalter span{position:absolute;inset:0;border-radius:999px;background:rgba(246,241,233,.22);transition:background .2s}' +
    '.ew-schalter span::after{content:"";position:absolute;left:3px;top:3px;width:22px;height:22px;border-radius:50%;background:#F6F1E9;transition:transform .2s}' +
    '.ew-schalter input:checked + span{background:#C1A033}' +
    '.ew-schalter input:checked + span::after{transform:translateX(18px)}' +
    '.ew-schalter input:disabled + span{opacity:.55}' +
    '.ew-schalter input:focus-visible + span{outline:2px solid #E3C06A;outline-offset:2px}' +
    '.ew button:focus-visible{outline:2px solid #E3C06A;outline-offset:2px}' +
    'body.einwilligung-offen .wa{opacity:0!important;pointer-events:none!important}' +
    '@media (prefers-reduced-motion: reduce){.ew *{transition:none!important}}';

  var box = null;

  function baue() {
    var st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    var datenschutz = /datenschutz\.html$/.test(location.pathname) ? '#tracking' : 'datenschutz.html#tracking';
    box = document.createElement('div');
    box.className = 'ew';
    box.hidden = true;
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-labelledby', 'ewTitel');
    box.setAttribute('aria-describedby', 'ewText');
    box.innerHTML =
      '<h2 id="ewTitel">Ihre Privatsphäre</h2>' +
      '<p id="ewText">Mit Ihrer Einwilligung nutzen wir Google Analytics, um die Website zu verbessern, und Google Ads, um den Erfolg unserer Anzeigen zu messen. ' +
      'Dabei werden Cookies gesetzt und Daten an Google übermittelt, auch in die USA. Ohne Einwilligung funktioniert die Website genauso. ' +
      'Sie können Ihre Wahl jederzeit über „Cookie-Einstellungen“ unten auf der Seite ändern. <a href="' + datenschutz + '">Mehr in der Datenschutzerklärung</a></p>' +
      '<div class="ew-wahl" id="ewWahl" hidden>' +
        '<div class="ew-zeile"><div><b>Notwendig</b><small>Speichert nur Ihre Auswahl in diesem Browser. Immer aktiv.</small></div>' +
          '<label class="ew-schalter"><input type="checkbox" checked disabled aria-label="Notwendig, immer aktiv"><span></span></label></div>' +
        '<div class="ew-zeile"><div><b>Statistik</b><small>Google Analytics 4: anonyme Auswertung, welche Inhalte genutzt werden.</small></div>' +
          '<label class="ew-schalter"><input type="checkbox" id="ewStatistik" aria-label="Statistik erlauben"><span></span></label></div>' +
        '<div class="ew-zeile"><div><b>Marketing</b><small>Google Ads: Messung, ob eine Anzeige zu einer Anfrage oder einem Anruf geführt hat, und Remarketing.</small></div>' +
          '<label class="ew-schalter"><input type="checkbox" id="ewMarketing" aria-label="Marketing erlauben"><span></span></label></div>' +
      '</div>' +
      '<div class="ew-knoepfe">' +
        '<button type="button" class="ew-nein" data-ew="nein">Nur notwendige</button>' +
        '<button type="button" class="ew-ja" data-ew="ja">Alle akzeptieren</button>' +
        '<button type="button" data-ew="speichern" hidden>Auswahl speichern</button>' +
      '</div>' +
      '<button type="button" class="ew-mehr" data-ew="mehr" aria-expanded="false" aria-controls="ewWahl">Einstellungen</button>';
    document.body.appendChild(box);

    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-ew]');
      if (!b) return;
      var was = b.getAttribute('data-ew');
      if (was === 'ja') entscheiden(true, true);
      else if (was === 'nein') entscheiden(false, false);
      else if (was === 'speichern') entscheiden(box.querySelector('#ewStatistik').checked, box.querySelector('#ewMarketing').checked);
      else if (was === 'mehr') {
        var wahl = box.querySelector('#ewWahl');
        wahl.hidden = !wahl.hidden;
        b.setAttribute('aria-expanded', String(!wahl.hidden));
        box.querySelector('[data-ew="speichern"]').hidden = wahl.hidden;
      }
    });
  }

  function zeigeBanner(mitWahl) {
    if (!box) baue();
    var w = lesen() || { statistik: false, marketing: false };
    box.querySelector('#ewStatistik').checked = !!w.statistik;
    box.querySelector('#ewMarketing').checked = !!w.marketing;
    var wahl = box.querySelector('#ewWahl');
    wahl.hidden = !mitWahl;
    box.querySelector('[data-ew="mehr"]').setAttribute('aria-expanded', String(!!mitWahl));
    box.querySelector('[data-ew="speichern"]').hidden = !mitWahl;
    box.hidden = false;
    document.body.classList.add('einwilligung-offen');
    /* Fokus nur, wenn der Besucher das Fenster selbst geoeffnet hat - sonst wirkt ein Knopf vorausgewaehlt */
    if (mitWahl) box.querySelector('#ewStatistik').focus({ preventScroll: true });
  }

  function entscheiden(statistik, marketing) {
    var vorher = lesen();
    var neu = { v: VERSION, statistik: !!statistik, marketing: !!marketing, zeit: Date.now() };
    schreiben(neu);
    box.hidden = true;
    document.body.classList.remove('einwilligung-offen');
    var zurueckgenommen = vorher && ((vorher.statistik && !neu.statistik) || (vorher.marketing && !neu.marketing));
    anwenden(neu);
    if (zurueckgenommen && gtmGeladen) {
      googleCookiesLoeschen();
      location.reload();
    } else if (zurueckgenommen) {
      googleCookiesLoeschen();
    }
  }

  function start() {
    var links = document.querySelectorAll('[data-einwilligung-oeffnen]');
    for (var i = 0; i < links.length; i++) {
      links[i].hidden = !aktiv;
      links[i].addEventListener('click', function (e) { e.preventDefault(); zeigeBanner(true); });
    }
    var nurMit = document.querySelectorAll('[data-nur-mit-tracking]');
    var nurOhne = document.querySelectorAll('[data-nur-ohne-tracking]');
    for (var j = 0; j < nurMit.length; j++) nurMit[j].hidden = !aktiv;
    for (var k = 0; k < nurOhne.length; k++) nurOhne[k].hidden = aktiv;
    if (aktiv && (!gespeichert || test)) zeigeBanner(false);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
