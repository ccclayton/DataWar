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
    var tweetMesh;
	canvas.width = 1920;
	canvas.height = 1080;

	var context = canvas.getContext( '2d' );
	context.fillStyle = "white";
	context.font = "90px Times";


	context.fillText(this.tweet,300,500); //Will eventually be parsed usernames.

	context.textAlign = 'center';
	var tweetText = new THREE.Texture( canvas );
	//tweetText.magFilter = THREE.NearestFilter;
	//tweetText.minFilter = THREE.LinearMipMapLinearFilter;
	tweetText.needsUpdate = true;

	//Create Physijs object out of canvas. This will hold the username of the Tweet.
	 this.tweetMesh = new Physijs.BoxMesh(
		new THREE.CubeGeometry(50, 12, 1),
		Physijs.createMaterial(
			new THREE.MeshBasicMaterial( {map: tweetText, side: THREE.DoubleSide} ), 0.8, 0
			), this.mass
		);

	this.tweetMesh.position.set(this.position.x,this.position.y,this.position.z);
	this.tweetMesh.geometry.verticesNeedUpdate = true;
	this.tweetMesh.geometry.elementsNeedUpdate = true;
	this.tweetMesh._dirtyPosition = true;

	scene.add(this.tweetMesh);
};

TweetPanel.prototype.getPosition = function(){
	return this.position;
}
TweetPanel.prototype.setPosition = function(newPos){
	this.tweetMesh.position.copy(newPos);
    this.tweetMesh._dirtyPosition = true;
}

TweetPanel.prototype.setRotation = function (newRotation){ // THREE.Vector3
    var euler = new THREE.Euler(newRotation.x,newRotation.y,newRotation.z,'XYZ');
    this.tweetMesh.position.applyEuler(euler);

    this.tweetMesh._dirtyRotation = true;
}