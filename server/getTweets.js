/**
 * @Author: Danny Gillies
 *
 * @Purpose: Pulls live tweets from twitter and stores them in a local mongodb database
 * @Keywords: The list of words we are tracking from twitter
 */

var keywords = ['#dataviz', '#3dwebfest', '#autodesk', '#webgl', '#threejs'];

var fs = require('fs');
var Twit = require('twit');

var T = new Twit({
    consumer_key:         'n37Pkz2GxSTsd9WCalaKLrHhQ'
  , consumer_secret:      'qYXPpzvzDSzpgqpt0gEF4e4TkmuF3p06I7eofIBIrM6bZJKmpg'
  , access_token:         '3219700082-ZHK1alLaY1GQPHGYPPlGwFAN9G1Yys6qzQIcRaN'
  , access_token_secret:  'Wj9eCdaofbO7HhXgocio0KpjAg02pASq1oZ2bEiWThtKD'
});

var Tweet = require('../models/tweet.js');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');
var config = require('../js/config.js');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
	console.log("Connected to database, waiting for tweets...");

	waitForTweets(db, function() {
      db.close();
      console.log("CLOSED");
  	});

});



var waitForTweets = function(db, callback) {
	var collection = db.collection('tweets');

	// Track tweets with the keyword '#apple'
	var stream = T.stream('statuses/filter', { track: keywords , language: 'en' })

	// Start the stream, and store the JSON information in data
	stream.on('tweet', function (data) {
		var res = data.text.split(" ");
		// Checking if it was a retweet
		if (res[0] == "RT") {
			// Get rid of the '@' at the beginning and the ':' at the end of the username that it was retweeted from
			var retweetFrom = res[1].substring(1, res[1].length - 1);
			console.log("----------RETWEET FROM " + retweetFrom + "------------")
			data.text = data.text.substring(data.text.indexOf(':') + 2);
		}

		// Create the tweet object
		var tweet = new Tweet({
			id: data.id,
			raw: data,
			user: data.user.screen_name,
			description: data.text,
			retweet: retweetFrom,
			timestamp: data.timestamp_ms,
			created_at: data.created_at
		});

		// Store the tweet in the database
		tweet.save(function (err, tweet) {
			if (err) return console.error(err);
			console.log("(" + tweet.created_at + ") " + tweet.user + ": " + tweet.description);
			console.log("");
		})
	})

}