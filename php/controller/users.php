<?php

$needAdmin = 1;
require 'guard.php';

$relpath = '..';
$title = "Brugere";

//require 'db.php';
//$result = execQuery("SELECT * FROM users", array());

//$users = $result->fetchAll(PDO::FETCH_ASSOC);

require $relpath . '/view/head.php';
require $relpath . '/view/users.php';
require $relpath . '/view/foot.php';

?>