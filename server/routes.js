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
    // root: '/home/danny/Documents/Kinetech/DataWar/'
     root: '../'
  };


  // Insert routes below
  app.route('/api/tweets')
      .get(function (req, res) {
        console.log(req.query.date);
        dt = req.query.date;
        Tweet.find({created_at: {$gt: dt}}, function (err, tweets) {
          if (err) return handleError(err);
          // console.log(tweets.length);
          // res.json({tweets: tweets});
          res.json({tweets: tweets});
          // res.send("WEEEEEEEEE");
          // console.log("SDFWEFWEFWEF");
        }).limit(50);
      });


  // Route to clear out the database
  app.route('/')
      .get(function (req, res) {
        Tweet.remove({}, function (err) {
          if (err) return handleError(err);
          // res.set('Content-Type', 'text/html');
          // var temp = options.root;
          // options.root += 'src/';
          // console.log(options.root);
          res.render(options.root + 'src/datawar.html');
          // options.root = temp;
        });
      });

    // Just load the page
    //app.route('/')
    //    .get(function (req, res) {
    //        if (err) return handleError(err);
    //        // res.set('Content-Type', 'text/html');
    //        // var temp = options.root;
    //        // options.root += 'src/';
    //        // console.log(options.root);
    //        res.render(options.root + 'src/datawar.html');
    //        // options.root = temp;
    //    });
};