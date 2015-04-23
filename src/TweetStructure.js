
"use strict";
var TweetStructure=function(options){
    var maxNumUser = 150;
    var scene = options.scene;
    var graph = new Graph(options);
    var layoutOptions={};
    var lastTweetTime=new Date(Date.now() - 24*3600*1000); //seed date to 24 hours back
    var numNodes = 0;


    // var tweetsInContext=[];
    // tweetsInContext = tweetsInContext;

    graph.layout = new Layout.ForceDirected(graph, layoutOptions);
    graph.layout.init();

    // options = {scene:drawing.scene};
    // var graph = new Graph(options);

    var makeConnections = function(origin,dest){
        graph.addEdge(origin,dest);
    };

    var processUserNames=function(usernames,tweets){
        //console.log("batch processing usernames");
        usernames.forEach(function(username){
           var node = createUserNode(username);

            tweets.forEach(function(tweet){
            var panel = createTweetPanel(tweet);

                var edge = graph.addEdge(node,panel);
                edge.draw();
            })
        })



    };
    var createUserNode = function(username){
        numNodes++;
        var userNode = new TwitterNode(username,null,null,lookupStartPosition(username),0);
        graph.addNode(userNode);


        userNode.draw();

        return userNode;//Testing

        //if(graph.nodes.length > maxNumUser)
        //        removeOldestNode();
        //
        //    if(graph.nodes.length > maxNumUser)
        //        removeOldestNode();
    };

    var createTweetPanel = function(tweet){
        var tweetPanel = new TweetPanel(tweet,lookupStartPosition(tweet),0);
        graph.addNode(tweetPanel);
        tweetPanel.draw();
        return tweetPanel; //Testing
    };

    var processTweets=function(tweets){
        //var numTweets = tweets.length;
        //lastTweetTime.setTime(new Date(tweets[numTweets-1].created_at).getTime());
        //doProcessTweets(tweets);
        console.log("Creating tweet panels!");
        tweets.forEach(function(tweet){
            createTweetPanel(tweet);
        })
    };

    //var doProcessTweets=function(tweets){
    //    if(tweets.length<1) return
    //
    //    var that = this;
    //    var tweet = tweets.shift();
    //    processOneTweet(tweet, lookupStartPosition(tweet)); //TODO: START HERE
    //    graph.layout.init();
    //    graph.layout.resetTemperature();
    //    if(tweets.length>0)
    //        setTimeout(function(){doProcessTweets(tweets);}, 400);
    //};

        //Modified by Colin Clayton
    var lookupStartPosition=function(twitterHandle){
        //Todo: Hook to db of tracked users and their model positions
        var position = new THREE.Vector3((Math.random()-0.5)*200,
            Math.random()*0.5 * 100,
            (Math.random()-0.5)*200);
        return position.z >= 10 ? position :  new THREE.Vector3((Math.random()-0.5)*200,
            10,
            (Math.random()-0.5)*200);
    };


    //var removeOldestNode=function(){
    //    var node = graph.getOldestNode();
    //    node.data.tweets.forEach(function(item){
    //        var idx = tweetsInContext.indexOf(item);
    //        tweetsInContext.splice(idx,1);
    //    })
    //    graph.removeNode(node);
    //};


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



    //var userHasTweet=function(node, tweet){
    //    // if(node.data.tweets.length>3)
    //    // 	debugger;
    //
    //    for(var i=0; i<node.data.tweets.length; i++){
    //        // if(node.data.tweets[i].text == tweet.text)
    //        if(node.data.tweets[i].id == tweet.id)
    //            return node.data.tweets[i];
    //    }
    //    return null;
    //};


    //var addTweetToUser=function(node, tweet){
    //    var twData = userHasTweet(node, tweet);
    //    if(twData!=null){ //found a match
    //        twData.count+=1;
    //    }else{
    //        var tweetData={
    //            id:tweet.id,
    //            text:tweet.text,
    //            created_by:node.data.userInfo.screen_name,
    //            created_at:tweet.created_at,
    //            count:1
    //        };
    //
    //        node.data.tweets.push(tweetData);
    //        tweetsInContext.push(tweetData);
    //    }
    //    // tweetsInContext.sort(function(x,y){
    //    // 	return x.count< y.count;
    //    // });
    //};



    //var isRetweet=function(tweet){
    //    return tweet.retweeted_status != undefined;
    //};


    //// if user exist, return it, otherwise, create it and return
    //var createUserNode=function(userInfo, nodeOrigin){
    //    // debugger;
    //    var node = graph.getNode(userInfo);
    //    if(node == undefined){
    //        var node = new Node(userInfo);
    //       // node.data.userInfo=userInfo;
    //        //node.data.tweets=[];
    //
    //        ///////////////////////////
    //        //node starting position
    //        ///////////////////////////
    //        node.position = nodeOrigin;
    //
    //        graph.addNode(node);
    //        node.draw();
    //    }
    //
    //    return node;
    //};


    var render=function(){
        // Generate layout if not finished
        if(!graph.layout.finished) {
           // info_text.calc = "<span style='color: red'>Calculating layout...</span>";
            graph.layout.generate(new THREE.Vector3(0,30,-40));
        }

        //// Update position of lines (edges)
        //for(var i=0; i<graph.geometries.length; i++) {
        //    graph.geometries[i].verticesNeedUpdate = true;
        //}
        //
        //
        //// Show labels if set
        //// It creates the labels when this options is set during visualization
        //if(that.show_labels) {
        //    var length = graph.nodes.length;
        //    for(var i=0; i<length; i++) {
        //        var node = graph.nodes[i];
        //        if (node != undefined) {
        //            node.position.x = node.position.x;
        //            node.position.y = node.position.y - 100;
        //            node.position.z = node.position.z;
        //           // node.data.label_object.lookAt(camera.position);
        //        }
        //    }
        //        } else {
        //            if(node.data.title != undefined) {
        //                var label_object = new THREE.Label(node.data.title, node.data.draw_object);
        //            } else {
        //                var label_object = new THREE.Label(node.id, node.data.draw_object);
        //            }
        //            node.data.label_object = label_object;
        //            scene.add( node.data.label_object );
        //        }
        //    }
        //} else {
        //    var length = graph.nodes.length;
        //    for(var i=0; i<length; i++) {
        //        var node = graph.nodes[i];
        //        if(node.data.label_object != undefined) {
        //            scene.remove( node.data.label_object );
        //            node.data.label_object = undefined;
        //        }
        //    }
        //}
        //
        //// render selection
        //if(that.selection) {
        //    object_selection.render(scene, camera);
        //}
        //
        //// update stats
        //if(that.show_stats) {
        //    stats.update();
        //}

    };


    var clear=function(){
        console.log("clearing graph to start new");
        graph.removeAllNodes();
        tweetsInContext.length = 0;
    };

    return {
        // graph:function(){return graph;},
        graph:graph,
        render:render,
        lastTweetTime:lastTweetTime,
        clear: clear,
        resetLastTweetTime:function(){lastTweetTime=new Date(Date.now() - 24*3600*1000);},

        processUserNames: processUserNames,
        processTweets: processTweets,
        createUserNode: createUserNode,
        createTweetPanel: createTweetPanel,
        makeConnections: makeConnections
        // tweetsInContext: tweetsInContext
    }
};


