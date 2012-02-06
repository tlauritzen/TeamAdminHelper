var fs = require('fs');
var textutils = require('./textutils');
var url = require('url');
var querystring = require('querystring');
var exec = require("child_process").exec;

function start(request, response) {
    console.log("Request handler 'start' was called.");

    exec("ls -lah", function (error, stdout, stderr) {
	response.writeHead(200, {"Content-Type": "text/plain"});
	response.write(stdout);
	response.end();
    });
}

function login(request, response) {
    console.log("Request handler 'login' was called.");
    data = {title: 'Login teamadmin'};
    render('views/login.html', response, data, 'text/html');
}


userinfo = {
    username: 'torben',
    password: 'hest'
}

function doLogin(request, response) {
    console.log("Request handler 'doLogin' was called.");
    url_parts = querystring.parse(url.parse(request.url).query);
    console.log(url_parts);
    username = url_parts.username;
    password = url_parts.password;
    // Username & password ok
    if(username == userinfo.username && password == userinfo.password) {
	console.log('Redirecting to main');
	data = {title: 'Login teamadmin'};
	render('views/main.html', response, data, 'text/html');
    }
    else {
	// Username & password not ok
	login(request, response);
    }
}

function generic(request, response, pathname) {
    console.log("Request handler 'generic' was called.");
    
    type = '';
    encoding = '';
    suffix = pathname.match("\.[a-zA-Z]+$")[0].toLowerCase();
    switch(suffix) {
    case '.css':
	type = 'text/css';
	encoding = 'utf-8';
	console.log(type);
	break;
    case '.html':
	type = 'text/html';
	encoding = 'utf-8';
	console.log(type);
	break;
    case '.ico':
	type = 'image/x-icon';
	encoding = 'binary';
	console.log(type);
	break;
    default: 
	type = 'text/html';
	encoding = 'utf-8';
    }

    render("." + pathname, response, null, type, encoding);
}

function render(page, response, data, type, encoding) {
    fs.readFile(page, 'utf-8', function(err, template) {
	if (err) {
	    console.log("No request handler found for " + page);
	    response.writeHead(404, {"Content-Type": "text/plain"});
	    response.write("404 Not found");
	    response.end();
	}
	else {
	    output = textutils.getModifiedText(template, data);
	    response.writeHead(200, {"Content-Type": type});
	    
	    response.write(output, encoding);
	    response.end();
	}
    });
}

exports.generic = generic;
exports.start = start;
exports.login = login;
exports.doLogin = doLogin;