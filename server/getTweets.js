var fs = require('fs');
var Twit = require('twit');

var T = new Twit({
    consumer_key:         'Em2k68ft24TM9ngeNjOqyD3Nn'
  , consumer_secret:      'viFqJBbVDt0DygZV6pI5UzpsBR5GkLQYBLdHQnKASSSUmFMynl'
  , access_token:         '416540180-SX6iJGrZZ3dfe7Y7Te6D8iRo8yAXHmxVb1vcIywI'
  , access_token_secret:  'h7raMD2P8mfODYCeElvTTQVHdJbrmNcEhX0dlkN8xUhHA'
});

// Read in all the models
// fs.readdirSync(__dirname + '/../models').forEach(function(filename) {
// 	if (~filename.indexOf('.js')) require(__dirname + "/../models/" + filename);
// })

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

// var tweetSchema = mongoose.Schema({
// 	id : Number,
// 	raw : JSON,
//     user : String,
//     description : String, 
//     retweet : String,
//     timestamp : Number,
//     created_at : String
// })

var Tweet = require('../models/tweet.js')

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
	console.log("Connected to database, waiting for tweets...");

	waitForTweets(db, function() {
      db.close();
      console.log("CLOSED");
  	});

});



var waitForTweets = function(db, callback) {
	var collection = db.collection('tweets');
	var i = 0;

	// Track tweets with the keyword '#apple'
	//var stream = T.stream('statuses/filter', { track: ['#3DWeb', '#3dwebfest', "#webfest", "#autodesk"], language: 'en' })
	var stream = T.stream('statuses/filter', { track: ['apple'], language: 'en' })


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