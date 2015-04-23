var mongoose = require('mongoose');

var tweetSchema = mongoose.Schema({
	id : Number,
	raw : JSON,
    user : String,
    description : String, 
    retweet : String,
    timestamp : Number,
    created_at : Date
})

module.exports = mongoose.model('Tweet', tweetSchema)