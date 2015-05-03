/**
 * Main application file
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
// oscClient = new osc.Cliend('127.0.0.1', 3333);

// oscClient.send('/connection', 1);

var connectedSockets=[];

oscServer.on('message', function(msg, rinfo){
	// console.log(msg);
	switch(msg[0]){
		case '/wiibalanceboard':
			msg.shift();
			connectedSockets.forEach(function(s){
				s.emit("wiibalanceboard", msg);
			})
		default:
	}
})

// oscServer.on('wiibalanceboard', function(msg, rinfo){
//   console.log(msg[2]);
//   connectedSockets.forEach(function(s){
//     s.emit("oscdata", msg[2]);
//   })
// })


io.sockets.on('connection', function(socket){
  connectedSockets.push(socket);
  console.log('a new connection, num of connections is '+(connectedSockets.length));

  socket.on('disconnect', function(){
    var idx = connectedSockets.indexOf(socket);
    connectedSockets.splice(idx,1);

    console.log('disconnected, remaining connections: '+ (connectedSockets.length));
  });


})




app.use(express.static('./'));
// app.use(express.static('/home/danny/Documents/Kinetech/DataWar'));

// Start server
// app.listen(3000);
server.listen(3000);
console.log('Listening on port 3000');

// Expose app
exports = module.exports = app;