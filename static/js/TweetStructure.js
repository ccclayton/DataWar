/**
 * @author:Danny Gillies
 * @author:Colin Clayton
 * @author:Weidong Yang
 */

"use strict";
var TweetStructure = function (sceneGraph) {

    var tweetOpacity = 0.75;
    var bgColor = "#121252";
    var lineColor = "#121252";
    var fontColor = "#FFFFFF";
    var linewidth = 5;
    var tweetsInScene = [];
    var count = 0;
    var maxNumUser = 150;
    var graph = sceneGraph;
    var lastTweetTime = new Date(Date.now() - 24 * 3600 * 1000); //seed date to 24 hours back
    var numNodes = 0;
    var storedTweets = [];
    var makeConnections = function (origin, dest) {
        graph.addEdge(origin, dest);
    };

    /**
     * @author:Danny Gillies
     */
    var drawTweet = function (tweet) {
        var user = tweet.user;
        var description = tweet.description;
        if (config.tweets.retweets == true) {
            var retweet = tweet.retweet;
        } else {
            var retweet = null;
        }
        var retweetText;

        if (retweet != null) {
            for (var i = 0; i < tweetsInScene.length; i++) {
                if (description == tweetsInScene[i].tweet) {
                    retweetText = graph.getNode(tweetsInScene[i].id);
                }
            }
            // Tweet exists in world, just add retweet node
            if (retweetText != null) {
                var retweetNode = createRetweetNode(user, retweetText);
                var retweetEdge = graph.addEdge(retweetNode, retweetText);
                retweetEdge.draw({linewidth: linewidth, color: lineColor, opacity: tweetOpacity});

                // Tweet does not exist in world, add tweet then retweet node
            } else {
                var retweetText = createTweetPanel(description);
                retweetText.retweeted++;
                var retweetNode = createRetweetNode(user, retweetText);
                var originalNode = createUserNode(retweet, retweetText);
                var tweetEdge = graph.addEdge(originalNode, retweetText);
                var retweetEdge = graph.addEdge(retweetNode, retweetText);

                tweetEdge.draw({linewidth: linewidth, color: lineColor, opacity: tweetOpacity});
                retweetEdge.draw({linewidth: linewidth, color: lineColor, opacity: tweetOpacity});
            }

        } else {
            var panel = createTweetPanel(description);
            var node = createUserNode(user, panel);

            var edge = graph.addEdge(node, panel);
            edge.draw({linewidth: linewidth, color: lineColor, opacity: tweetOpacity});
            storedTweets.push(description);
        }
    };

    /**
     * @author:Danny Gillies
     * @param tweet
     */
    var getASCIIvalue = function (tweet) {
        var value = 0;
        for (var i = 0; i < tweet.length; i++) {
            value += tweet.charCodeAt(i);
        }
        return value;
    }
    /**
     * @author:Colin Clayton
     * @param username: twitter username
     */
    var createUserNode = function (username, tweet) {
        tweet.position.y = 5;
        var location = tweet.position;
        var userNode = new TwitterNode(username, new THREE.BoxGeometry(10, 10, 10), "Cube", location, 0, {
            bgColor: bgColor,
            fontColor: fontColor,
            opacity: tweetOpacity
        });

        userNode.desired_y = 5;
        userNode.id = numNodes;
        graph.addNode(userNode);
        numNodes++;
        userNode.draw(location);

        return userNode;
    };

    /**
     * @author:Colin Clayton
     * @author:Danny Gillies
     */
    var createRetweetNode = function (username, tweet) {
        tweet.position.y = 65;
        var location = tweet.position;

        var userNode = new TwitterNode(username, null, null, location, 0, {
            bgColor: bgColor,
            fontColor: fontColor,
            opacity: tweetOpacity
        });
        userNode.desired_y = 65;
        userNode.id = numNodes;
        graph.addNode(userNode);
        numNodes++;
        userNode.draw(location);

        return userNode;
    };

    /**
     * @author:Colin Clayton
     */
    var createTweetPanel = function (tweet) {
        var location = lookupStartPosition(tweet);
        var tweetPanel = new TweetPanel(tweet, location, 0, {
            bgColor: bgColor,
            fontColor: fontColor,
            opacity: tweetOpacity
        });

        tweetPanel.id = numNodes;
        tweetPanel.desired_y = 35;
        graph.addNode(tweetPanel);
        tweetsInScene.push(tweetPanel); //Added by Danny Gillies
        numNodes++;
        tweetPanel.draw(location);

        return tweetPanel;
    };

    /**
     * @author:Danny Gillies
     */
    var processTweets = function (tweets) {
        tweets.forEach(function (tweet) {
            createTweetPanel(tweet);
        })
    };

    /**
     * @author: Weidong Yang
     * Modified by:Colin Clayton
     */
    var lookupStartPosition = function (twitterHandle) {
        var position = new THREE.Vector3((Math.random() - 0.5) * 1000,
            25,
            (Math.random() - 0.5) * 1000);
        return position;
    };

    /**
     * @author:Colin Clayton
     */
    var render = function () {
        // Generate layout if not finished
        if (!graph.layout.finished) {
            graph.layout.generate();
        }

        //Need to tell THREE.js to update each edge and vertice
        graph.edges.forEach(function (e) {
            e.line.geometry.verticesNeedUpdate = true;
            e.line.geometry.elementsNeedUpdate = true;
        })
    };


    var clear = function () {
        graph.removeAllNodes();
        storedTweets.length = 0;
    };

    return {
        graph: graph,
        render: render,
        resetLastTweetTime: function () {
            lastTweetTime = new Date(Date.now() - 24 * 3600 * 1000);
        },
        drawTweet: drawTweet,
        processTweets: processTweets,
        createUserNode: createUserNode,
        createTweetPanel: createTweetPanel,
        clear: clear,
        tweetsInScene: tweetsInScene
    }
};
