<?php
/* ============================================================
   Anfrageformular -> E-Mail
   Polsterei Janssen, angelegt 11.09.2026 beim Umzug zu Hostinger

   Warum der Absender NICHT die Gmail-Adresse ist:
   Wenn der Server eine Mail verschickt und behauptet, sie käme von
   @gmail.com, erkennt Google das als Fälschung und wirft sie weg oder
   steckt sie in den Spam. Deshalb: Absender = eigene Domain,
   Antwort-an = der Kunde. Gigi kann also direkt auf "Antworten" drücken.
   ============================================================ */

declare(strict_types=1);
mb_internal_encoding('UTF-8');

const EMPFAENGER   = 'polstereijanssen@gmail.com';
const ABSENDER     = 'anfrage@polstereijanssen.de';
const ABSENDERNAME = 'Website Polsterei Janssen';
const MAX_FOTOS    = 6;
const MAX_FOTO     = 5  * 1024 * 1024;   // 5 MB je Bild
const MAX_GESAMT   = 15 * 1024 * 1024;   // 15 MB alle Bilder zusammen

header('Content-Type: application/json; charset=utf-8');

function raus(int $code, string $text, bool $ok = false): never {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'text' => $text], JSON_UNESCAPED_UNICODE);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    raus(405, 'Nur Absenden erlaubt.');
}

/* ---------- Spamschutz ----------
   1. Honigtopf: ein Feld, das im Browser unsichtbar ist. Menschen füllen es
      nie aus, automatische Skripte fast immer.
   2. Zeitprüfung: wer das Formular in unter drei Sekunden ausfüllt, tippt nicht. */
if (!empty($_POST['webseite'] ?? '')) {
    raus(200, 'Danke, Ihre Anfrage ist unterwegs.', true);   // still schlucken
}
$start = (int)($_POST['gestartet'] ?? 0);
if ($start > 0 && (time() * 1000 - $start) < 3000) {
    raus(200, 'Danke, Ihre Anfrage ist unterwegs.', true);
}

/* ---------- Eingaben einsammeln ---------- */
function feld(string $name, int $max = 500): string {
    $w = trim((string)($_POST[$name] ?? ''));
    // Zeilenumbrüche aus Kopfzeilen-Feldern entfernen: damit kann man sonst
    // fremde Empfänger in die Mail schmuggeln (Header-Injection).
    if (in_array($name, ['name', 'email', 'telefon', 'ort'], true)) {
        $w = str_replace(["\r", "\n", "%0a", "%0d"], ' ', $w);
    }
    return mb_substr($w, 0, $max);
}

$name    = feld('name', 120);
$email   = feld('email', 160);
$telefon = feld('telefon', 60);
$ort     = feld('ort', 120);
$nachricht = feld('nachricht', 4000);
$moebel   = feld('moebel', 120);
$leistung = feld('leistung', 400);
$zeit     = feld('zeit', 120);

if ($name === '')  raus(422, 'Bitte tragen Sie Ihren Namen ein.');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) raus(422, 'Diese E-Mail-Adresse sieht nicht richtig aus.');

/* ---------- Fotos prüfen ---------- */
$anhaenge = [];
$gesamt = 0;
if (!empty($_FILES['fotos']) && is_array($_FILES['fotos']['name'])) {
    $anzahl = min(count($_FILES['fotos']['name']), MAX_FOTOS);
    for ($i = 0; $i < $anzahl; $i++) {
        if ((int)$_FILES['fotos']['error'][$i] !== UPLOAD_ERR_OK) continue;
        $tmp  = $_FILES['fotos']['tmp_name'][$i];
        $gr   = (int)$_FILES['fotos']['size'][$i];
        if ($gr <= 0 || $gr > MAX_FOTO) continue;
        if ($gesamt + $gr > MAX_GESAMT) break;

        // Nicht dem Dateinamen vertrauen, sondern den Inhalt ansehen
        $info = @getimagesize($tmp);
        // HEIC kennt nicht jede PHP-Fassung - deshalb geprueft statt geraten,
        // sonst bricht die Datei auf aelteren Servern mit einem Fehler ab.
        $erlaubt = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];
        if (defined('IMAGETYPE_HEIC')) { $erlaubt[IMAGETYPE_HEIC] = 'heic'; }
        if ($info === false || !isset($erlaubt[$info[2]])) continue;

        $daten = @file_get_contents($tmp);
        if ($daten === false) continue;
        $gesamt += $gr;
        $anhaenge[] = [
            'name' => 'foto-' . ($i + 1) . '.' . $erlaubt[$info[2]],
            'typ'  => image_type_to_mime_type($info[2]),
            'daten'=> $daten,
        ];
    }
}

/* ---------- Text der Mail ---------- */
$zeilen = [
    'Neue Anfrage über die Website',
    str_repeat('=', 29),
    '',
    'Möbelstück:          ' . ($moebel   !== '' ? $moebel   : '-'),
    'Gewünschte Leistung: ' . ($leistung !== '' ? $leistung : '-'),
    'Zeitrahmen:          ' . ($zeit     !== '' ? $zeit     : '-'),
    '',
    'Name:     ' . $name,
    'Telefon:  ' . ($telefon !== '' ? $telefon : '-'),
    'E-Mail:   ' . $email,
    'PLZ/Ort:  ' . ($ort !== '' ? $ort : '-'),
    '',
    'Nachricht:',
    ($nachricht !== '' ? $nachricht : '-'),
    '',
    'Fotos: ' . (count($anhaenge) > 0 ? count($anhaenge) . ' im Anhang' : 'keine'),
    '',
    str_repeat('-', 29),
    'Eingegangen: ' . date('d.m.Y, H:i') . ' Uhr',
    'Zum Antworten einfach auf "Antworten" drücken, das geht direkt an ' . $email . '.',
];
$text = implode("\r\n", $zeilen);

/* ---------- Mail zusammensetzen ---------- */
$betreff = 'Anfrage: ' . ($moebel !== '' ? $moebel : 'Polsterarbeit') . ' – ' . $name;
$betreffKopf = '=?UTF-8?B?' . base64_encode($betreff) . '?=';
$absenderKopf = '=?UTF-8?B?' . base64_encode(ABSENDERNAME) . '?= <' . ABSENDER . '>';

$kopf = [
    'From: ' . $absenderKopf,
    'Reply-To: ' . '=?UTF-8?B?' . base64_encode($name) . '?= <' . $email . '>',
    'MIME-Version: 1.0',
    'X-Mailer: polstereijanssen.de',
];

if ($anhaenge) {
    $grenze = '=_' . bin2hex(random_bytes(16));
    $kopf[] = 'Content-Type: multipart/mixed; boundary="' . $grenze . '"';
    $rumpf  = "--$grenze\r\n"
            . "Content-Type: text/plain; charset=UTF-8\r\n"
            . "Content-Transfer-Encoding: base64\r\n\r\n"
            . chunk_split(base64_encode($text)) . "\r\n";
    foreach ($anhaenge as $a) {
        $rumpf .= "--$grenze\r\n"
               .  'Content-Type: ' . $a['typ'] . '; name="' . $a['name'] . "\"\r\n"
               .  "Content-Transfer-Encoding: base64\r\n"
               .  'Content-Disposition: attachment; filename="' . $a['name'] . "\"\r\n\r\n"
               .  chunk_split(base64_encode($a['daten'])) . "\r\n";
    }
    $rumpf .= "--$grenze--";
} else {
    $kopf[] = 'Content-Type: text/plain; charset=UTF-8';
    $kopf[] = 'Content-Transfer-Encoding: base64';
    $rumpf  = chunk_split(base64_encode($text));
}

$gesendet = @mail(EMPFAENGER, $betreffKopf, $rumpf, implode("\r\n", $kopf), '-f' . ABSENDER);

if (!$gesendet) {
    raus(500, 'Der Versand hat gerade nicht geklappt.');
}
raus(200, 'Danke, Ihre Anfrage ist unterwegs.', true);
