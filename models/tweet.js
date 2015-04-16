var mongoose = require('mongoose');

var tweetSchema = mongoose.Schema({
	id : String,
	raw : JSON,
    user : String,
    description : String, 
    retweet : String,
    timestamp : String,
    created_at : String
})

mongoose.model('Tweet', tweetSchema)