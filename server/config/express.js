/**
 * @Author: Danny Gillies
 *
 * Set up the express file to make the routing easier
 */

'use strict';

var express = require('express');
var path = require('path');
var parent = __dirname.substring( 0, __dirname.lastIndexOf( "/" ) + 1);
console.log(parent);

module.exports = function(app) {
  // Sets the view directory of our html page
  //app.set('views', parent + '/views');
  // Tells the browser how to render the file
  //app.engine('html', require('ejs').renderFile);
  //app.set('view engine', 'html');
};