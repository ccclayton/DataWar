/**
 * @Author: Danny Gillies
 *
 * @Purpose: Set up the routes for our application
 */

'use strict';

var mongoose = require('mongoose');
var Tweet = require('../models/tweet.js');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var dt;


module.exports = function(app) {

  app.engine('html', require('ejs').renderFile);

  // Route that client calls to get tweets from database
  app.route('/api/tweets')
      .get(function (req, res) {
        console.log(req.query.date);
        dt = req.query.date;
        Tweet.find({created_at: {$gt: dt}}, function (err, tweets) {
          if (err) return handleError(err);
          res.json({tweets: tweets});
        }).limit(70);
      });


  // Route to clear out the database
  app.route('/fresh')
      .get(function (req, res) {
        Tweet.remove({}, function (err) {
          if (err) return handleError(err);
          res.render('datawar.html');
        });
      });

    // Route to load the main page (GO HERE)
    app.route('/')
        .get(function (req, res) {
            res.render('datawar.html');
        });
};