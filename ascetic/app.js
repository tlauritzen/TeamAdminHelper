var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");

var handle = {}
handle["generic"] = requestHandlers.generic;
handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/login"] = requestHandlers.login;
handle["/doLogin"] = requestHandlers.doLogin;

server.start(router.route, handle);
