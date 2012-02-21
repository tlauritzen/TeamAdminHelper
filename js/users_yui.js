YAHOO.util.Event.onDOMReady(function(){
    initView();    
    loadUsers();
});


var initView = function () {

    var displayStyle = YAHOO.util.Dom.getStyle('addUserBox', 'display');
    YAHOO.util.Dom.setStyle('addUserBox', 'display', 'none');
    YAHOO.util.Dom.setStyle('addUserBox', 'width', '300px');
    YAHOO.util.Dom.setStyle('addUserBox', 'text-align', 'right');
    

    YAHOO.util.Event.addListener('addUser', "click", function(e) {
	currentStyle = YAHOO.util.Dom.getStyle('addUserBox', 'display');
	newStyle = currentStyle == 'none' ? displayStyle : 'none';
	YAHOO.util.Dom.setStyle('addUserBox', 'display', newStyle);
    });

    YAHOO.util.Event.addListener('addUser', "mouseover", function(e) {
	YAHOO.util.Dom.setStyle('addUser', 'cursor', 'pointer');
    });

    YAHOO.util.Event.addListener('doCreate', "click", function(e) {
	saveUser();
    });
}


var loadUsers = function() {
    var mySuccessHandler = function(o) {
        var users = []; 
	try { 
	    users = YAHOO.lang.JSON.parse(o.responseText); 
            for (var i = 0, len = users.length; i < len; ++i) {
		populateUserEntry(users[i]);
            }
	} 
	catch (x) { 
	    alert("JSON Parse failed!"); 
	    return; 
	} 
    };
    
    var myFailureHandler = function(o) {
	alert('Error fetching userdata');
    };
    
    var callback = {
        success : mySuccessHandler,
        failure : myFailureHandler
    };

    var cObj = YAHOO.util.Connect.asyncRequest('GET', '/getUsers.json', callback);
}


var saveUser = function(name, username, password, isadmin) {
    var mySuccessHandler = function(o) {
        var users = []; 
	try { 
	    users = YAHOO.lang.JSON.parse(o.responseText); 
            for (var i = 0, len = users.length; i < len; ++i) {
		populateUserEntry(users[i]);
            }
	    document.getElementById('addUserForm').reset();

	} 
	catch (x) { 
	    alert("JSON Parse failed!"); 
	    return; 
	} 
    };
    
    var myFailureHandler = function(o) {
	alert('Error fetching userdata');
    };
    
    var callback = {
        success : mySuccessHandler,
        failure : myFailureHandler
    };

    var formObject = document.getElementById('addUserForm');
    YAHOO.util.Connect.setForm(formObject);
    var cObj = YAHOO.util.Connect.asyncRequest('GET', '/saveUser.json', callback);
}


var populateUserEntry = function(user) {    
    var elUserList = new YAHOO.util.Element('userList');
    var elRow = new YAHOO.util.Element(document.createElement('tr')); 
    elUserList.appendChild(elRow);

    var elCell = new YAHOO.util.Element(document.createElement('td')); 
    var cell_text = document.createTextNode(user['name']);
    elCell.appendChild(cell_text); 
    elRow.appendChild(elCell);

    elCell = new YAHOO.util.Element(document.createElement('td')); 
    cell_text = document.createTextNode(user['username']);
    elCell.appendChild(cell_text); 
    elRow.appendChild(elCell);
}
