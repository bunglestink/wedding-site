<?php
$body = file_get_contents('php://input');
$date = date('"Y-m-d H:i:s"');
$line = $date.','.$body;
file_put_contents('../../data/rsvp.txt', $line, FILE_APPEND);
header('HTTP/1.0 204 No Content');
