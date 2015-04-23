/**
 * Express configuration
 */

'use strict';

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');

module.exports = function(app) {
  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
}