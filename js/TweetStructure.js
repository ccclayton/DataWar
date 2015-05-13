// RkqqvYKque
"use strict";
var TweetStructure=function(sceneGraph){

    var tweetOpacity = 0.75;
    var bgColor = "#121252";
    var lineColor = "#121252";
    var fontColor = "#FFFFFF";
    var linewidth = 5;
    var count = 0;

    var maxNumUser = 150;
    //this.Layout = options.layout; //Check
    //var scene = sceneGraph.scene;
    var graph = sceneGraph;
    var lastTweetTime=new Date(Date.now() - 24*3600*1000); //seed date to 24 hours back
    var numNodes = 0;
    var storedTweets = [];


    // var tweetsInContext=[];
    // tweetsInContext = tweetsInContext;

    //graph.layout = new Layout.ForceDirected(graph, layoutOptions);
    //graph.layout.init(); //TODO: CALL WHEN EVERYTHING IS READY

    // options = {scene:drawing.scene};
    // var graph = new Graph(options);

    var makeConnections = function(origin,dest){
        graph.addEdge(origin,dest);
    };

    var drawTweet=function(tweet){
        //console.log("batch processing usernames");
        var user = tweet.user;
        var description = tweet.description;
        var retweet = tweet.retweet;

        if (retweet != null) {
            // var node_id = getASCIIvalue(description);
            // var retweetText = graph.getNode(node_id);
            // Tweet exists in world, add retweet node
            // if (retweetText != null) {
                // retweetText.retweeted++;
                // var retweetNode = createRetweetNode(user, retweetText);
                // var retweetEdge = graph.addEdge(retweetNode, retweetText);

                // retweetEdge.draw({linewidth:linewidth, color:lineColor, opacity:tweetOpacity});

                // Tweet does not exist in world, add tweet then retweet node
            // } 
            // // else {
            //     var retweetText = createTweetPanel(description);
            //     retweetText.retweeted++;
            //     var retweetNode = createRetweetNode(user, retweetText);
            //     var originalNode = createUserNode(retweet, retweetText);
            //     var tweetEdge = graph.addEdge(originalNode, retweetText);
            //     var retweetEdge = graph.addEdge(retweetNode, retweetText);

            //     tweetEdge.draw({linewidth:linewidth, color:lineColor, opacity:tweetOpacity});
            //     retweetEdge.draw({linewidth:linewidth, color:lineColor, opacity:tweetOpacity});
            // }

        } else {
            var panel = createTweetPanel(description);
            var node = createUserNode(user, panel);

            var edge = graph.addEdge(node, panel);
            edge.draw({linewidth:linewidth, color:lineColor, opacity:tweetOpacity});
            storedTweets.push(description);

            //for(var i = 0; i < 2; i++){
            //    var node = createUserNode(usernames[i]);  //Small number of nodes for debugging animation.
            //}
        }
    };

    var getASCIIvalue = function(tweet) {
        var value = 0;
        for (var i = 0; i < tweet.length; i++) {
            value += tweet.charCodeAt(i);
        }
        return value;
    }

    var createUserNode = function(username, tweet){
        //var location = lookupStartPosition(username);
        tweet.position.y = 5;
        var location = tweet.position;
        //location.x = 158;

        //console.log("tweet position " + tweet.position.x);
        //console.log("location = " + location.x + " " + location.y);
        var userNode = new TwitterNode(username,new THREE.BoxGeometry(10, 10, 10), "Cube",location,0, {bgColor:bgColor,fontColor:fontColor, opacity:tweetOpacity});
        userNode.desired_y = 5;
        userNode.id = numNodes; //NOT SURE
        graph.addNode(userNode);
        // userNode.mesh.position.copy(location); //CHECK
        // userNode.mesh._dirtyPosition = true;
        //userNode.mesh.geometry =  new THREE.SphereGeometry(6, 32, 32);

        //userNode.id = numNodes; //NOT SURE
        numNodes++; //NOT SURE.

        userNode.draw(location);

        return userNode;//Testing


    };

    var createRetweetNode = function(username, tweet) {
        //var location = lookupStartPosition(username);
        tweet.position.y = 65;
        var location = tweet.position;

        var userNode = new TwitterNode(username,null,null,location,0, {bgColor:bgColor,fontColor:fontColor, opacity:tweetOpacity});
        userNode.desired_y = 65;
        userNode.id = numNodes; //NOT SURE
        graph.addNode(userNode);
        // userNode.mesh.position.copy(location); //CHECK
        // userNode.mesh._dirtyPosition = true;
        //userNode.mesh.geometry =  new THREE.SphereGeometry(6, 32, 32);

        //userNode.id = numNodes; //NOT SURE
        numNodes++; //NOT SURE.

        userNode.draw(location);

        return userNode;//Testing

    };

    var createTweetPanel = function(tweet){
        var location = lookupStartPosition(tweet);
        //location.y = 25;
        //console.log("Location: "+ location.x + " " + location.y);
        var tweetPanel = new TweetPanel(tweet,location,0, {bgColor:bgColor,fontColor:fontColor, opacity:tweetOpacity});
        // tweetPanel.id = getASCIIvalue(tweet);
        tweetPanel.id = numNodes;

        tweetPanel.desired_y = 35;

        //tweetPanel.id = numNodes;
        graph.addNode(tweetPanel);
        //tweetPanel.mesh.position.copy(location); //mesh is undefined...
        //tweetPanel.mesh._dirtyPosition = true;
        numNodes++;
        tweetPanel.draw(location);
        return tweetPanel; //Testing
    };

    var processTweets=function(tweets){
        //var numTweets = tweets.length;
        //lastTweetTime.setTime(new Date(tweets[numTweets-1].created_at).getTime());
        //doProcessTweets(tweets);
        //console.log("Creating tweet panels!");
        tweets.forEach(function(tweet){
            createTweetPanel(tweet);
        })
    };



    //Modified by Colin Clayton
    var lookupStartPosition=function(twitterHandle){
        //Todo: Hook to db of tracked users and their model positions
        var position = new THREE.Vector3((Math.random()-0.5)*1000,
            25,
            (Math.random()-0.5)*1000);
        return position;
    };





    //var processOneTweet=function(tweet, nodeOrigin){
    //    //var node = createUserNode(tweet, nodeOrigin);  //TODO: THIS NEEDS A LOT OF WORK!
    //    var node = new TwitterNode(tweet,null,null,nodeOrigin,0);
    //    graph.addNode(node);
    //    node.draw();
    //
    //    //var date = new Date(tweet.raw.created_at);
    //    //node.data.date = date;
    //
    //    //if(isRetweet(tweet.raw)){ //it's a retweet, we don't add text here, but add to orig node
    //      //  var orgNode = createUserNode(tweet.raw.retweeted_status.user, nodeOrigin);
    //       // orgNode.data.date = new Date();
    //       // orgNode.data.date.setTime(date.getTime());
    //       // addTweetToUser(orgNode, tweet.raw.retweeted_status);
    //        //var edge = graph.addEdge(orgNode, node);
    //        //edge.draw();
    //    //}else{
    //   //     addTweetToUser(node, tweet);
    //    //}
    //   // renderTweet(tweet, node);
    //
    //    if(graph.nodes.length > maxNumUser)
    //        removeOldestNode();
    //
    //    if(graph.nodes.length > maxNumUser)
    //        removeOldestNode();
    //};





    var render=function(){

        // Generate layout if not finished
        if(!graph.layout.finished) {
            graph.layout.generate();


        }

        graph.edges.forEach(function(e){
            e.line.geometry.verticesNeedUpdate=true;
            e.line.geometry.elementsNeedUpdate = true;
        })


    };


    var clear=function(){
        //console.log("clearing graph to start new");
        graph.removeAllNodes();
        tweetsInContext.length = 0;
    };

    return {
        // graph:function(){return graph;},
        graph:graph,
        render:render,
        resetLastTweetTime:function(){lastTweetTime=new Date(Date.now() - 24*3600*1000);},

        drawTweet: drawTweet,
        processTweets: processTweets,
        createUserNode: createUserNode,
        createTweetPanel: createTweetPanel

        // tweetsInContext: tweetsInContext
    }
};

