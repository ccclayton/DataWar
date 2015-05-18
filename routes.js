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

    app.set('views', __dirname + '/views'); //optional since express defaults to CWD/views

  var options = {
    // root: '/home/danny/Documents/Kinetech/DataWar/'
<<<<<<< HEAD:routes.js
     root: 'views/'
=======
     root: '../views/datawar.html'
>>>>>>> f751e70a26cc3687f3e57051612301bc2e2a1820:server/routes.js
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
  app.route('/fresh')
      .get(function (req, res) {
        Tweet.remove({}, function (err) {
          if (err) return handleError(err);
          // res.set('Content-Type', 'text/html');
          // var temp = options.root;
          // options.root += 'src/';
          // console.log(options.root);
          res.render('datawar.html');
          // options.root = temp;
        });
      });

    // Just load the page
    app.route('/')
        .get(function (req, res) {
            // res.set('Content-Type', 'text/html');
            // var temp = options.root;
            // options.root += 'src/';
            // console.log(options.root);
            res.render('datawar.html');
            // options.root = temp;
        });
};