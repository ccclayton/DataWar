/**
 * @Author: Danny Gillies
 *
 * @Purpose: Set up the express file to make the routing easier
 */

'use strict';

var express = require('express');
var path = require('path');
var parent = __dirname.substring( 0, __dirname.lastIndexOf( "/" ) + 1);

module.exports = function(app) {
  app.set('views', parent + '/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
}