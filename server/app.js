// node express
// node mongoose
// rest api using node js express and mongodb
var Twit = require('twit');

var T = new Twit({
    consumer_key:         'Em2k68ft24TM9ngeNjOqyD3Nn'
  , consumer_secret:      'viFqJBbVDt0DygZV6pI5UzpsBR5GkLQYBLdHQnKASSSUmFMynl'
  , access_token:         '416540180-SX6iJGrZZ3dfe7Y7Te6D8iRo8yAXHmxVb1vcIywI'
  , access_token_secret:  'h7raMD2P8mfODYCeElvTTQVHdJbrmNcEhX0dlkN8xUhHA'
})

// celebratearts
//  search twitter for all tweets containing the word 'banana' since Nov. 11, 2011
//
// T.get('search/tweets', { q: 'banana since:2011-11-11', count: 100 }, function(err, data, response) {
//   console.log(data.statuses[99].text)
// });

var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://localhost:27017/';
// Use connect method to connect to the Server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  waitForTweets(db, function() {
  	console.log("INSERT DOCUMENTS");
    findDocuments(db, function() {
      db.collection('tweets').remove({});
      console.log("REMOVED TWEETS");
      db.close();
      console.log("CLOSED");
    });
  });
  // getTweet(db, function() {
  //   db.close();
  // })
});

var getTweet = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('tweets');
  // Insert some documents
  	T.get('search/tweets', { q: 'banana since:2011-11-11', count: 1}, function(err, data, response) {
			console.log(data);
			callback(response);
	  });
};

// var updateDocument = function(db, callback) {
//   // Get the documents collection
//   var collection = db.collection('tweets');
//   // Update document where a is 2, set b equal to 1
//   collection.update({ a : 2 }
//     , { $set: { b : 1 } }, function(err, result) {
//     assert.equal(err, null);
//     assert.equal(1, result.result.n);
//     console.log("Updated the document with the field a equal to 2");
//     callback(result);
//   });  
// }

// var removeDocument = function(db, callback) {
//   // Get the documents collection
//   var collection = db.collection('tweets');
//   // Insert some documents
//   collection.remove({ a : 3 }, function(err, result) {
//     assert.equal(err, null);
//     console.log("Removed the document with the field a equal to 3");
//     callback(result);
//   });    
// }

//From whatever time give me 10 tweets

var waitForTweets = function(db, callback) {
	var collection = db.collection('tweets');
	var i = 0;

	// Track tweets with the keyword '#apple'
	var stream = T.stream('statuses/filter', { track: '#apple', language: 'en' })

	// Start the stream, and store the JSON information in data
	stream.on('tweet', function (data) {
		var res = data.text.split(" ");
		// Checking if it was a retweet
		if (res[0] == "RT") {
			// Get rid of the '@' at the beginning and the ':' at the end of the username that it was retweeted from
			var retweetFrom = res[1].substring(1, res[1].length - 1);
			console.log("----------RETWEET FROM " + retweetFrom + "------------")
		}
		collection.insert([
		{user : data.user.screen_name, tweet : data.text, retweet : retweetFrom}
		], function(err, result) {
			console.log(data.user.screen_name + ": " + data.text);
			console.log("");
			i++;
			if (i == 10) {
				stream.stop();
				callback(result);
			}
		})
	})

}

var findDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('tweets');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.dir(docs);
    callback(docs);
  });
};