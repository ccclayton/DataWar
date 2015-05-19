/**
 * @Author: Danny Gillies
 * @Author: Weidong Yang
 *
 * Starts the web server
 */

'use strict';

var express = require('express');
var mongoose = require('mongoose');
var tweet = require('./models/tweet.js');
var path = require('path');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io=require('socket.io').listen(server, {log:false});
var osc=require('node-osc/lib/osc.js');

// Connect to database
mongoose.connect('mongodb://localhost/test');

// Setup server
require('./server/config/express');
require('./server/routes')(app);

io.set('log level', 1);
var oscServer, oscClient;
oscServer = new osc.Server(3334, '0.0.0.0'); //listening on 3333

var connectedSockets=[];

oscServer.on('message', function(msg, rinfo){
	// console.log(msg);
	switch(msg[0]){
		case '/wiibalanceboard':
			console.log("GOT IT");
			msg.shift();
			connectedSockets.forEach(function(s){
				s.emit("wiibalanceboard", msg);
			});
			break;
		case "#bundle":
			msg.shift();
			msg.shift();
			msg.shift();
			// console.log(msg);
			connectedSockets.forEach(function(s){
				s.emit("skeleton", msg);
			});
			break;
		default:
	}
})

io.sockets.on('connection', function(socket){
  connectedSockets.push(socket);
  console.log('a new connection, num of connections is '+(connectedSockets.length));

  socket.on('disconnect', function(){
    var idx = connectedSockets.indexOf(socket);
    connectedSockets.splice(idx,1);

    console.log('disconnected, remaining connections: '+ (connectedSockets.length));
  });


});


app.use(express.static('./'));

// Start server
server.listen(3000);
console.log('Listening on port 3000');

// Expose app
exports = module.exports = app;