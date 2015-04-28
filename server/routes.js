/**
 * Main application routes
 */

'use strict';

var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/test');

var Tweet = require('../models/tweet.js');

var db = mongoose.connection;

// var curdate = "Wed, 18 Oct 2000 13:00:00 EST"
var dt;

db.on('error', console.error.bind(console, 'connection error:'));


module.exports = function(app) {

    app.engine('html', require('ejs').renderFile);


  var options = {
    root: '/Users/ccclayton/Documents/Programming/School/Kinetech/DataWar'
  }

  // Insert routes below
  app.route('/aa')
    .get(function(req, res) {
      // var temp = options.root;
      // options.root += 'server/';
      res.sendFile('server/test.js', options)
      // options.root = temp;
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

  app.route('/api/tweets')
    .get(function(req, res) {
      console.log(req.query.date);
      dt = req.query.date;
      Tweet.find({created_at: { $gt: dt}}, function(err, tweets) {
        if (err) return handleError(err);
        // console.log(tweets.length);
        // res.json({tweets: tweets});
        res.json({tweets: tweets});
        // res.send("WEEEEEEEEE");
        // console.log("SDFWEFWEFWEF");
      })
  })
};
