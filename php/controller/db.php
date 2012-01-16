<?php

$dbh = null;

try {
    $db_user="root";
    $db_password="fiat500";

    $dbh = new PDO('mysql:host=localhost;dbname=teamadmin', $db_user, $db_password);
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage() . "<br/>";
    die();
}

/*
  $query: string
  $params: array(p1, p2, p3)
 */
function execQuery($query, $params) {
    global $dbh;
    if($dbh != null) {
	$stmt = $dbh->prepare($query);
	$stmt->execute($params);
	return $stmt;
    }
    else {
	die("db handle is null");
    }
}

?>
