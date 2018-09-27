/*
* Title: Homework Assignment #1 in Node.js Master Class, Building a RESTful API
* Description: A RESTful JSON API that listens on a port of your choice
*              When someone post anything to the route/hello, you should return a welcome mesage in JSON format. 
* Author: Solveig Løvhaug
* Date: 09/27/18
*/

// Run code in strict mode
'use strict';

// Dependencies
const http = require('http'),
  url = require('url'),
  StringDecoder = require('string_decoder').StringDecoder,
  myPort = 3000,
  myWelcomeJSON = {'message' : 'Welcome everyone!'},
  okStatus = 200,
  notFoundStatus = 404;

// Instatiate the HTTP server
const httpServer = http.createServer(function(req,res){
	unifiedServer(req,res);
});

// Start the HTTP server
httpServer.listen(myPort,function(){
	console.log("The server is listening on port " + myPort + " now");
});

// All the server logic
const unifiedServer = function(req,res){
	// Get the URL and parse it
	const parsedUrl = url.parse(req.url,true);

	// Get the path
	const path = parsedUrl.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g,'');

	// Get the payLoad, if any
	const decoder = new StringDecoder('utf-8');
	var buffer = '';
	req.on('data',function(data){
		buffer += decoder.write(data);
	});

	// Get the payLoad, if any
	req.on('end',function(){
		// Choose the handler the request should go to. If one is not found, use the notFound handler
		var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

		// Construct the data object to send to the handler
		const data = {
			'welcome' : myWelcomeJSON
		};

		// Route the request to the handler specified in the router
		chosenHandler(data,function(statusCode,payload){
			// Use the statuscode called back
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			payload = typeof(payload) == 'object' ? payload : {};

			// Convert the payload to a s tring
			const payloadString = JSON.stringify(payload);

			// Return the response
			res.setHeader('Content-Type','application/json');
			res.writeHead(statusCode);
			res.end(payloadString);
		}); // end chosenHandler
	}); // end req.on
}; // end unifiedServer

// Define the handlers
const handlers = {
	hello: function(data,callback){
		callback(okStatus,data.welcome);
	},
	notFound: function(data,callback){
		callback(notFoundStatus);
	}
};

// Define a request loader
const router = {
	'hello' :handlers.hello
};

