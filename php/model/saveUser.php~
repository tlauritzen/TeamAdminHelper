<?php


$relpath = '..';

require $relpath . '/controller/db.php';
$result = execQuery("SELECT * FROM users", array());

$users = $result->fetchAll(PDO::FETCH_ASSOC);


echo json_encode($users);

?>