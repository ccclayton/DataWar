var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var Tweet = require('../models/tweet.js');

var db = mongoose.connection;

var curdate = "Wed, 18 Oct 2000 13:00:00 EST"
var dt = Date.parse(curdate)

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {

	findTweets(db, function() {
      db.close();
      console.log("CLOSED");
  	});

});

exports.findTweets = function(db, callback) {

	setTimeout(function() {findTweets(db, null)}, 6000);

	var collection = db.collection('tweets');

	Tweet.find({created_at: { $gt: dt}}, function(err, tweets) {
		if (err) return handleError(err);
		console.log(tweets.length);
		var temp = tweets[tweets.length-1];
		if (temp != null) {
			dt = Date.parse(temp.created_at);
		}
	})
}