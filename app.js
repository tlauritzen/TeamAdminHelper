var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["generic"] = requestHandlers.generic;
handle["/"] = requestHandlers.login;
handle["/login"] = requestHandlers.login;
handle["/logout"] = requestHandlers.logout;
handle["/doLogin"] = requestHandlers.doLogin;
handle["/users"] = requestHandlers.users;
handle["/getUsers.json"] = requestHandlers.getUsersJSON;
handle["/saveUser.json"] = requestHandlers.saveUserJSON;

server.start(router.route, handle);
