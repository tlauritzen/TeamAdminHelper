var http = require("http");
var url = require("url");

function start(route, handle) {
    function onRequest(request, response) {
	var pathname = url.parse(request.url).pathname;
	console.log("Request for " + pathname + " received.");


	//route(handle, pathname, response);
	
	request.addListener("end", function() {
	    route(handle, pathname, this, response);
	});
	
    }
    
    http.createServer(onRequest).listen(2293);
    console.log("Server has started.");
}

exports.start = start;