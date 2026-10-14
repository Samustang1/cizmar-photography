<?php
/**
 * booking.php — spracovanie rezervačného formulára
 * Cizmar Photography · ukážkový skript (vyžaduje PHP hosting)
 *
 * Pozn.: na GitHub Pages sa PHP nespúšťa, slúži ako ukážka kódu.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    exit(json_encode(['ok' => false, 'chyba' => 'Povolená je len metóda POST']));
}

$meno    = trim((string) ($_POST['name'] ?? ''));
$email   = filter_var($_POST['email'] ?? '', FILTER_VALIDATE_EMAIL);
$telefon = preg_replace('/\D+/', '', (string) ($_POST['phone'] ?? ''));
$predvolba = (string) ($_POST['phoneCode'] ?? '');
$auto    = trim((string) ($_POST['car'] ?? ''));
$datum   = (string) ($_POST['date'] ?? '');
$cas     = (string) ($_POST['time'] ?? '');
$miesto  = trim((string) ($_POST['location'] ?? ''));
$sluzba  = (string) ($_POST['package'] ?? '');
$sprava  = trim((string) ($_POST['message'] ?? ''));
$gdpr    = (string) ($_POST['gdpr'] ?? '');

// Povinné polia
if ($meno === '' || $email === false || $sprava === '' || $gdpr === '') {
    http_response_code(422);
    exit(json_encode(['ok' => false, 'chyba' => 'Chýbajú povinné polia']));
}

$komu    = 'cizsamko@gmail.com';
$predmet = 'Nová rezervácia fotenia — Cizmar Photography';

$telo = "Meno: {$meno}\n"
      . "E-mail: {$email}\n"
      . "Telefón: {$predvolba} {$telefon}\n"
      . "Auto: {$auto}\n"
      . "Dátum: {$datum} {$cas}\n"
      . "Lokalita: {$miesto}\n"
      . "Služba: {$sluzba}\n\n"
      . "Správa:\n{$sprava}\n";

$hlavicky = "From: Cizmar Photography <web@cizmar-photography.sk>\r\n"
          . "Reply-To: {$email}\r\n"
          . "Content-Type: text/plain; charset=utf-8\r\n";

$odoslane = mail($komu, $predmet, $telo, $hlavicky);

echo json_encode(['ok' => (bool) $odoslane]);
