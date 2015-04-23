"use strict";
function TweetPanel(tweet,position,mass) 
// Need to add physics.
{
	Node.call(this);
	this.tweet = tweet;
	this.position = position;
	this.mass = mass;
	//return this.NewTweet(this.tweet, this.position,this.mass);
}

TweetPanel.prototype = new Node();         //Inheritance
TweetPanel.prototype.constructor = Node;  //Fixes the pointer.
TweetPanel.prototype.draw = function(){

	var canvas = document.createElement( 'canvas' );

	canvas.width = 1920;
	canvas.height = 1080;

	var context = canvas.getContext( '2d' );
	context.fillStyle = "white";
	context.font = "90px Times";


	context.fillText(this.tweet,300,500); //Will eventually be parsed usernames.

	context.textAlign = 'center';
	var tweetText = new THREE.Texture( canvas );
	tweetText.magFilter = THREE.NearestFilter;
	tweetText.minFilter = THREE.LinearMipMapLinearFilter;
	tweetText.needsUpdate = true;

	//Create Physijs object out of canvas. This will hold the username of the Tweet.
	var tweetMesh = new Physijs.BoxMesh(
		new THREE.CubeGeometry(50, 12, 1),
		Physijs.createMaterial(
			new THREE.MeshBasicMaterial( {map: tweetText, side: THREE.DoubleSide} ), 0.8, 0
			), this.mass
		);

	tweetMesh.position.set(this.position.x,this.position.y,this.position.z);
	tweetMesh._dirtyPosition = true;

	scene.add(tweetMesh);
};


