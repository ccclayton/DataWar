/**
 * Main application file
 */

'use strict';

var express = require('express');
var mongoose = require('mongoose');
var tweet = require('./models/tweet.js');
var path = require('path');
var app = express();

// Connect to database
mongoose.connect('mongodb://localhost/test');

// Setup server
require('./server/config/express');
require('./server/routes')(app);

app.use(express.static('./'));
// app.use(express.static('/home/danny/Documents/Kinetech/DataWar'));

// Start server
app.listen(3000);
console.log('Listening on port 3000');

// Expose app
exports = module.exports = app;