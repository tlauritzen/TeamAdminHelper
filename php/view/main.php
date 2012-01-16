<h1>Velkommen til holdadministration for TRIF U7</h1>

<a class="menu" href="users.php">Brugere</a>
<a class="menu" href="players.php">Spillere</a>
<a class="menu" href="events.php">Arrangementer</a>
<?php
if($_SESSION['isadmin']) {
    echo '<a class="menu" href="admin.php">Administration</a>';
}
?>
