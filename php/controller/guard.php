<?php

session_start();

if(!isset($_SESSION['username']) || (isset($needAdmin) && !isset($_SESSION['isadmin']))) {
    header("Location: ../index.php");    
}

?>
