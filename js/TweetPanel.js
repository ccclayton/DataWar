"use strict";
function TweetPanel(tweet,position,mass)
// Need to add physics.
{
	Node.call(this);
	this.tweet = tweet;
	this.position = position;
    //this._dirtyPosition = true;
	this.mass = mass;
    this.mesh = null;
	//return this.NewTweet(this.tweet, this.position,this.mass);
}

TweetPanel.prototype = new Node();         //Inheritance
TweetPanel.prototype.constructor = Node;  //Fixes the pointer.
TweetPanel.prototype.draw = function(location){

	var canvas = document.createElement( 'canvas' );
	var mesh;
	canvas.width = 1920;
	canvas.height = 1080;

	var context = canvas.getContext( '2d' );
	context.fillStyle = "white";
	context.font = "120px Times";

	var maxWidth = 1920;
	var lineHeight = 120;
	var x = (canvas.width - maxWidth) / 2;
	var y = 300;
	var text = this.tweet;

	wrapText(context, text, x, y, maxWidth, lineHeight);

	//context.fillText(this.tweet,300,500); //Will eventually be parsed usernames.

	context.textAlign = 'center';
	var tweetText = new THREE.Texture( canvas );
	//tweetText.magFilter = THREE.NearestFilter;
	//tweetText.minFilter = THREE.LinearMipMapLinearFilter;
	tweetText.needsUpdate = true;

	//Create Physijs object out of canvas. This will hold the username of the Tweet.
	this.mesh = new Physijs.BoxMesh(
		new THREE.CubeGeometry(50, 12, 1),
		Physijs.createMaterial(
			new THREE.MeshBasicMaterial( {map: tweetText, side: THREE.DoubleSide} ), 0, 0
		), this.mass
	);

	this.mesh.position.set(location.x,location.y,location.z);
	this.mesh.geometry.verticesNeedUpdate = true;
	this.mesh.geometry.elementsNeedUpdate = true;
	this.mesh.__dirtyPosition = true;

	scene.add(this.mesh);
};

TweetPanel.prototype.getPosition = function(){
	return this.mesh.position;
}
TweetPanel.prototype.updateMeshPosition = function(){
	this.position.copy( this.mesh.position);
	this.mesh.__dirtyPosition = true;
};

TweetPanel.prototype.setPosition = function(newPos){
	this.mesh.position.copy(newPos);
	this.mesh.__dirtyPosition = true;
}

TweetPanel.prototype.setRotation = function (newRotation){ // THREE.Vector3
	var euler = new THREE.Euler(newRotation.x,newRotation.y,newRotation.z,'XYZ');
	this.mesh.position.applyEuler(euler);

	this.mesh._dirtyRotation = true;
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
	var words = text.split(' ');
	var line = '';

	for(var n = 0; n < words.length; n++) {
		var testLine = line + words[n] + ' ';
		var metrics = context.measureText(testLine);
		var testWidth = metrics.width;
		if (testWidth > maxWidth && n > 0) {
			context.fillText(line, x, y);
			line = words[n] + ' ';
			y += lineHeight;
		}
		else {
			line = testLine;
		}
	}
	context.fillText(line, x, y);
}