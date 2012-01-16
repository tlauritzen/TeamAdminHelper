<?php

error_log("<pre>");

$new_array = array_map(create_function('$key, $value', 'return $key.":".$value." # ";'), array_keys($_REQUEST), array_values($_REQUEST));
error_log(implode($new_array));
error_log("</pre>");
$name = $_REQUEST['name'];
$username = $_REQUEST['username'];
$password = $_REQUEST['password'];
$isadmin = $_REQUEST['isadmin'];

$relpath = '..';
require $relpath . '/controller/db.php';
execQuery("INSERT INTO users (name, username, password, isadmin) values(?, ?, ?, ?)", array($name, $username, $password, $isadmin));

$result = execQuery("SELECT * FROM users WHERE username = ?", array($username));
$users = $result->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($users);

?>