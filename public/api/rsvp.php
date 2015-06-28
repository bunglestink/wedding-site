<?php
$body = file_get_contents('php://input');
$date = date('"Y-m-d H:i:s"');
$line = $date.','.$body.PHP_EOL;
file_put_contents('../../data/rsvp.txt', $line, FILE_APPEND);
// Return success after written to file.
ob_start();
header($_SERVER['SERVER_PROTOCOL'].' 204 No Content');
header('Content-Length: '.ob_get_length());
header('Connection: close');
ob_end_flush();
ob_flush();
flush();
// Mail after output is finished.
mail(
    'kwt104@gmail.com, jca322@gmail.com', 'julieandkirk.com wedding rsvp',
    $line, 'From: system@julieandkirk.com');
