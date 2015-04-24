
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
        //usernames.forEach(function(username){
        //   var node = createUserNode(username);
        //
        //    tweets.forEach(function(tweet){
        //    var panel = createTweetPanel(tweet);
        //
        //        var edge = graph.addEdge(node,panel);
        //        edge.draw();
        //    })


       // })

        for(var i = 0; i < 2; i++){
            var node = createUserNode(usernames[i]);  //Small number of nodes for debugging animation.
        }

    };

    var createUserNode = function(username){
        var location = lookupStartPosition(username);
        var userNode = new TwitterNode(username,null,null,location,0);
        userNode.id = numNodes; //NOT SURE
        graph.addNode(userNode);
        userNode.position =location;
        userNode.geometry =  new THREE.SphereGeometry(6, 32, 32);

        //userNode.id = numNodes; //NOT SURE
        numNodes++; //NOT SURE.

        userNode.draw();

        return userNode;//Testing

             
    };

    var createTweetPanel = function(tweet){
        var location = lookupStartPosition(tweet);
        var tweetPanel = new TweetPanel(tweet,location,0);
        tweetPanel.id = numNodes;
        graph.addNode(tweetPanel);
        tweetPanel.position = location;
        numNodes++;
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
           // info_text.calc = "<span style='color: red'>Calculating layout...</span>";
            graph.layout.generate(new THREE.Vector3(40,10,-60));

        }

        //// Update position of lines (edges)
        //for(var i=0; i<graph.geometries.length; i++) {
        //    graph.geometries[i].verticesNeedUpdate = true;
        //}

        ////TODO: Update position of nodes and panels
        for(var i = 0; i < graph.nodes.length; i++){ //was nodeSet
           //var nodeToBe =  graph.getNode(i);
            var nodeToBe = graph.nodes[i];


            //nodeToBe.draw();
            //console.log(nodeToBe);
            nodeToBe.geometry.verticesNeedUpdate = true;
            nodeToBe.geometry.elementsNeedUpdate = true;
            //console.log(nodeToBe.position);

            nodeToBe.position = new THREE.Vector3(nodeToBe.position.x+Math.random()*10,nodeToBe.position.y+Math.random()*10,nodeToBe.position.z + Math.random() * 10);

            //nodeToBe.draw();

            //nodeToBe.position.x += Math.random() * 10;
            //nodeToBe.position.y += Math.random() * 10;
            //nodeToBe.position.z += Math.random() * 10;


            //console.log(nodeToBe.position);




           // console.log("x = " +nodeToBe.position.x + "y = "+ nodeToBe.position.y + "z = "+ nodeToBe.position.z);

        }




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


