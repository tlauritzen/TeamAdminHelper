var fs = require('fs');
var textutils = require('./textutils');
var url = require('url');
var querystring = require('querystring');
var crypto = require('crypto');
var exec = require("child_process").exec;
var UserProvider = require('./model/UserProvider').UserProvider;

var sessions = {};  

var userProvider;
  
var SID_STRING = 'SESSIONID';  
var TIMEOUT = 3*60*1000;  


function start(request, response) {
    console.log("Request handler 'start' was called.");

    exec("ls -lah", function (error, stdout, stderr) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write(stdout);
	response.end();
    });
}


function init(callback)  {
    if( !userProvider ) {
	tmpUserProvider = new UserProvider();
	tmpUserProvider.openDb('localhost', 27017, function(err, db) {
	    if(err) console.log(err);
	    else {
		userProvider = tmpUserProvider;
		callback();
	    }
	});
    }
    else {
	callback();
    }
}
			      

function login(request, response) {
    console.log("Request handler 'login' was called.");

    init(function() {
	data = {title: 'Login TeamAdmin'};
	
	cookies = getCookies(request);
	sid = cookies[SID_STRING];
	
	render('views/login.html', response, data, 'text/html', 'utf-8', sid);	
    });
}

function logout(request, response) {
    console.log("Request handler 'logout' was called.");
    cookies = getCookies(request);
    sid = cookies[SID_STRING];
    delete sessions[sid];
    redirect(request, response, '', null);
}

/*
var userinfo = [
    {
	'name': 'Torben Lauritzen',
	'username': 'torben',
	'password': 'hund'
    },
    {
	'name': 'Stine Nielsen',
	'username': 'stine',
	'password': 'hest'
    }    
];
*/


function users(request, response) {
    console.log("Arguments callee name: " + arguments.callee.name);
    console.log("Request handler 'users' was called.");

    grantAccess(request, response, function(sid, err) {
	if(err) {
	    console.log(err);
	}	    
	else {
	    data = {title: 'TeamAdmin - Users'};
	    type = 'text/html';
	    encoding = 'utf-8';
	    render('views/users.html', response, data, 'text/html', 'utf-8', sid);
	}
    });
}

function getUsersJSON(request, response) {
    grantAccess(request, response, function(sid, err) {
	if(err) {
	    console.log(err);
	}	    
	else {
	    userProvider.findAll(function(error, result) {
		console.log('FindAll called');
		if( error ) console.log(error);
		else {
		    type = 'application/json';
		    encoding = 'utf-8';
		    header = sid != null ? {'Set-Cookie': 'SESSIONID=' + sid, 'Content-Type': type} : {'Content-Type': type}; 
		    response.writeHead(200, header);
		    response.end(JSON.stringify(result), encoding);
		}
	    });		
	}
    });
}

function saveUserJSON(request, response) {
    grantAccess(request, response, function(sid, err) {
	if(err) {
	    console.log(err);
	}	    
	else {
	    url_parts = querystring.parse(url.parse(request.url).query);    
	    user = {
		'name': url_parts.name,
		'username': url_parts.username,
		'password': url_parts.password,
		'isadmin': url_parts.isadmin
	    }
	    userProvider.save(user, function(err, users) {
		type = 'application/json';
		encoding = 'utf-8';
		header = sid != null ? {'Set-Cookie': 'SESSIONID=' + sid, 'Content-Type': type} : {'Content-Type': type}; 
		response.writeHead(200, header);
		response.end(JSON.stringify(users), encoding);
	    });
	}
    });
}

function deleteUserJSON() {}


function doLogin(request, response) {
    console.log("Request handler 'doLogin' was called.");
    url_parts = querystring.parse(url.parse(request.url).query);    
    username = url_parts.username;
    password = url_parts.password;

    userProvider.verifyLogin(username, password, function(error, result) {
	console.log('verifyLogin called');
	if( error || !result ) redirect(request, response, '', null);
	else {
	    sessionId = startSession(request, response);
	    console.log('Redirecting to main ' + result);
	    data = {title: 'Login teamadmin'};
	    redirect(request, response, 'views/main.html', sessionId);
	}
    });

    /*
    // Username & password ok
    if(username == userinfo[0].username && password == userinfo[0].password) {

	sessionId = startSession(request, response);
	console.log('Redirecting to main');
	data = {title: 'Login teamadmin'};
	redirect(request, response, 'views/main.html', sessionId);
    }
    else {
	// Username & password not ok
	redirect(request, response, '', null);
    }
    */
}


var redirect = function(request, response, pathname, sessionId) {
    host = request.headers.host;
    header = {'Location': 'http://' + host + '/'+ pathname}; 
    if(sessionId != null) header['Set-Cookie'] = 'SESSIONID=' + sessionId;
    response.writeHead(302, header);
    response.end();
}

var grantAccess = function(request, response, callback) {
    cookies = getCookies(request);
    sid = cookies[SID_STRING];
    if(sid && sessions[sid] && sessions[sid]['__timeout'] && sessions[sid]['__timeout'] > Date.now()) {  
	sessions[sid]['__timeout'] = Date.now() + TIMEOUT;  
	callback(sid, null);
    }
    else {
	redirect(request, response, '', null);
	callback(null, 'Not a valid session');
    }
}


function generic(request, response, pathname) {
    console.log("Request handler 'generic' was called.");
   
    type = '';
    encoding = '';
    sid = null;
    suffix = pathname.match("\.[a-zA-Z]+$")[0].toLowerCase();
    if(suffix == '.html') {
	// Synchronous callback
	grantAccess(request, response, function(sid, err) {
	    if(err) {
		console.log(err);
	    }	    
	    else {
		type = 'text/html';
		encoding = 'utf-8';
		render("." + pathname, response, null, type, encoding, sid);
	    }
	});
    }
    else {
	switch(suffix) {
	case '.css':
	    type = 'text/css';
	    encoding = 'utf-8';
	    break;
	case '.js':
	    type = 'text/javascript';
	    encoding = 'utf-8';
	    break;
	case '.ico':
	    type = 'image/x-icon';
	    encoding = 'binary';
	    break;
	case '.png':
	    type = 'image/png';
	    encoding = 'binary';
	    break;
	default: 
	    type = 'text/html';
	    encoding = 'utf-8';
	}
	render("." + pathname, response, null, type, encoding, sid);
    }


}

function render(page, response, data, type, encoding, sessionId) {
    fs.readFile(page, encoding, function(err, template) {
	if (err) {
	    console.log("No request handler found for " + page);
	    response.writeHead(404, {"Content-Type": "text/plain"});
	    response.write("404 Not found");
	    response.end();
	}
	else {
	    output = data != null ? textutils.getModifiedText(template, data) : template;
	    header = sessionId != null ? {'Set-Cookie': 'SESSIONID=' + sessionId, 'Content-Type': type} : {'Content-Type': type}; 
	    response.writeHead(200, header);
	    
	    response.write(output, encoding);
	    response.end();
	}
    });
}


var getCookies = function(request) {
    cookies = {};
    request.headers.cookie && request.headers.cookie.split(';').forEach(function( cookie ) {
	var parts = cookie.split('=');
	cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    return cookies;
}
  
var startSession = function(request, response) {  
    sid = createNew(request);

    return sid;
/*
    var setSid = function(sid) {  
        sessions[sid]['__timeout'] = Date.now() + TIMEOUT;  
        res.cookies[SID_STRING] = sid;  
    }  
  
    if(req.cookies[SID_STRING] != undefined) {  
        sid = req.cookies[SID_STRING];  
    } else {  
        createNew(req, setSid);  
        return;  
    }  
  
    if(sessions[sid] == undefined) {  
        createNew(req, setSid);  
    } else if(sessions[sid]['__timeout'] < Date.now()) {  
        delete sessions[sid];  
        createNew(req, setSid);  
    } else {  
        setSid(sid);  
    }  
  */
}  
  


var createNew = function(request) {  
    // MD5
    md5Hash = crypto.createHash('MD5');
    md5Hash.update(request.connection.remoteAddress + "" + Date.now(), 'utf8');  
    sid = md5Hash.digest('hex');  
    sessions[sid] = {'__timeout': Date.now() + TIMEOUT};  
    return sid;
}  
  
exports.endSession = function(request) {  
    delete sessions[getCookies(request)[SID_STRING]];  
}  
  


exports.generic = generic;
exports.start = start;
exports.login = login;
exports.logout = logout;
exports.doLogin = doLogin;
exports.users = users;
exports.getUsersJSON = getUsersJSON;
exports.saveUserJSON = saveUserJSON;
exports.deleteUserJSON = deleteUserJSON;
