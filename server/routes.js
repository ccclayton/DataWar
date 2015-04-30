/**
 * Main application routes
 */

'use strict';

var mongoose = require('mongoose');
var Tweet = require('../models/tweet.js');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var dt;

module.exports = function(app) {

    app.engine('html', require('ejs').renderFile);


  var options = {
    root: '/Users/ccclayton/Documents/Programming/School/Kinetech/DataWar/'
  }

  // Insert routes below
  app.route('/api/tweets')
    .get(function(req, res) {
      dt = req.query.date;
      Tweet.find({created_at: { $gt: dt}}, function(err, tweets) {
        if (err) return handleError(err);
        // console.log(tweets.length);
        // res.json({tweets: tweets});
        var temp = [];
        for (var i = 0; i < tweets.length; i++) {
          temp[i] = {user: tweets[i].user, description: tweets[i].description};
        }
        res.json({tweets: temp});
        // res.send("WEEEEEEEEE");
        // console.log("SDFWEFWEFWEF");
      })
  })

  // All other routes should redirect to the index.html
  app.route('/')
    .get(function(req, res) {
      // res.set('Content-Type', 'text/html');
      // var temp = options.root;
      // options.root += 'src/';
      // console.log(options.root);
      res.render(options.root + 'src/datawar.html');
      // options.root = temp;
    });
};
