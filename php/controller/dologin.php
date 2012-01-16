<?php

require 'db.php';

$username = $_REQUEST['username'];
$password = $_REQUEST['password'];

$result = execQuery("SELECT * FROM users WHERE username = ? AND password = ?", array($username, $password));

if($result->rowCount() > 0) {
    session_start();
    $_SESSION['username'] = $username;

    $row = $result->fetch(PDO::FETCH_ASSOC);
    $isadmin = $row['isadmin'];
    $_SESSION['isadmin'] = $isadmin;
    header("Location: ../controller/main.php");
}
else {
    header("Location: ../index.php");
}

?>
