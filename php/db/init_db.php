<?
$user="root";
$password="fiat500";
$database="teamadmin";
mysql_connect(localhost,$user,$password);
@mysql_select_db($database) or die( "Unable to select database");

$query="DROP TABLE teamadmin.users";
mysql_query($query);
$query="DROP TABLE teamadmin.players";
mysql_query($query);
$query="DROP TABLE teamadmin.events";
mysql_query($query);
$query="DROP TABLE teamadmin.players_for_events";
mysql_query($query);
$query="DROP TABLE teamadmin.players_for_users";
mysql_query($query);



$query="CREATE TABLE teamadmin.users (id INT NOT NULL AUTO_INCREMENT, name TEXT NOT NULL, username TEXT NOT NULL, password TEXT NOT NULL, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP, last_seen TIMESTAMP, PRIMARY KEY (id)) ENGINE = MYISAM";
mysql_query($query) or die('Failed creating table users');

$query="CREATE TABLE teamadmin.players (id INT NOT NULL AUTO_INCREMENT, name TEXT NOT NULL, user_id INT NOT NULL, created DATE NOT NULL, PRIMARY KEY (id)) ENGINE = MYISAM";
mysql_query($query) or die('Failed creating table players');

$query="CREATE TABLE teamadmin.events (id INT NOT NULL AUTO_INCREMENT, description TEXT NOT NULL, date DATE NOT NULL, duration TIME NOT NULL, number_of_participants INT NOT NULL, PRIMARY KEY (id)) ENGINE = MYISAM";
mysql_query($query) or die('Failed creating table events');

$query="CREATE TABLE teamadmin.players_for_events (event_id INT NOT NULL, player_id INT NOT NULL) ENGINE = MYISAM";
mysql_query($query) or die('Failed creating table players_for_events');

$query="CREATE TABLE teamadmin.players_for_users (user_id INT NOT NULL, player_id INT NOT NULL) ENGINE = MYISAM";
mysql_query($query) or die('Failed creating table players_for_users');


$query="INSERT INTO teamadmin.users (name, username, password) VALUES (
 'Torben Lauritzen'
,'tl'
,'hest'
)";
mysql_query($query);


$query="DROP USER teamadmin";
mysql_query($query);
$query="CREATE USER 'teamadmin'@'%'";
mysql_query($query);


$query="GRANT USAGE ON teamadmin.events TO 'teamadmin'@'%' WITH MAX_QUERIES_PER_HOUR 0 MAX_CONNECTIONS_PER_HOUR 0 MAX_UPDATES_PER_HOUR 0 MAX_USER_CONNECTIONS 0";
mysql_query($query);


mysql_close();


print("HEj");

?>


