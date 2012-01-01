<?php

$username = $_REQUEST['username'];
$password = $_REQUEST['password'];

$dbh = null;

$rowCount = 0;
try {
    $db_user="root";
    $db_password="fiat500";

    $dbh = new PDO('mysql:host=localhost;dbname=teamadmin', $db_user, $db_password);
    $stmt = $dbh->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
    $stmt->execute(array($username, $password));
    $rowCount = $stmt->rowCount();
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
}

if($rowCount > 0) {
  header("Location: ../controller/main.php");
}
else {
  header("Location: ../index.php");
}

?>
