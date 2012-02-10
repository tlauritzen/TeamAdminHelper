$(document).ready(function(){
    initView();
    loadUsers();
});


var initView = function () {
    $('#addUserBox').hide();
    $('#addUserBox').css('width', '300px');
    $('#addUserBox').css('text-align', 'right');
    $('#docreate').click(
	function() {
	    name = $('#name').val();
	    $('#name').val('');
	    username = $('#username').val();
	    $('#username').val('');
	    password = $('#password').val();
	    $('#password').val('');
	    isadmin = $('#isadmin').val();
	    $('#isadmin').val('');
	    saveUser(name, username, password, isadmin);
	    $('#addUserBox').hide();	    
	}
    );

    $('.clickable').mouseenter(
        function() {
            $(this).css('cursor', 'pointer');
        }
    );
    
    $('#addUser').toggle(
        function() {
            $('#addUserBox').show();
        },
	function() {
            $('#addUserBox').hide();	    
	}
    );
}

var saveUser = function(name, username, password, isadmin) {
    // Only used for .json files - move to server for php files
    $.ajaxSetup({
	beforeSend: 
        function(xhr){
            if (xhr.overrideMimeType)
            {
                xhr.overrideMimeType("application/json");
            }
        }
    });
    
    $.getJSON(
        '../model/saveUser.php', 
	{
	    "name": name,
	    "username": username,
	    "password": password,
	    "isadmin": isadmin
	},
        function(data) {
            $.each(data, function(dummy_key, val_array) {
		populateUserEntry(val_array);
            });
        }
    );
};

var loadUsers = function() {
    // Only used for .json files - move to server for php files
    $.ajaxSetup({
	beforeSend: 
        function(xhr){
            if (xhr.overrideMimeType)
            {
                xhr.overrideMimeType("application/json");
            }
        }
    });
    
    $.getJSON(
        '/getUsers.json', 
        function(data) {

            $.each(data, function(dummy_key, val_array) {
		populateUserEntry(val_array);
            });
        }
    );
};

var populateUserEntry = function(user) {    
    var userRow = $("<tr></tr>").appendTo("#userList");
    $("<td></td>").html(user['name']).appendTo(userRow);
    $("<td></td>").html(user['username']).appendTo(userRow);
}



