<script type="text/javascript" src="<?=$relpath?>/js/users_jquery.js"></script>
<h1><?=$title?></h1>

<!-- div id="userList" / -->

<div class="clickable" id="addUser">Create User</div>

<div id="addUserBox">
Name <input type="text" class="field" name="name" id="name" /><br /> 
Username <input type="text" class="field" name="username" id="username" /><br /> 
Password <input type="password" class="field" name="password" id="password" /><br /> 
Admin <input type="checkbox" class="field" name="isadmin" id="isadmin" /><br /> 
<button name="docreate" id="docreate">Create</button><br /> 
</div>

<table id="userList">
<th>Name</th>
<th>Username</th>
</table>