"use strict";
function TweetPanel(tweet,position,mass,options)
// Need to add physics.
{
	Node.call(this);
	this.tweet = tweet;
	this.position = position;
    //this._dirtyPosition = true;
	this.mass = mass;
    this.mesh = null;
	//return this.NewTweet(this.tweet, this.position,this.mass);
	this.bgColor = options.bgColor || "#FFFFFF";
    this.fontColor = options.fontColor || "#000000";
    this.tweetOpac = options.opacity || 0.75;
}

TweetPanel.prototype = new Node();         //Inheritance
TweetPanel.prototype.constructor = Node;  //Fixes the pointer.
TweetPanel.prototype.draw = function(location){

	var canvas = document.createElement( 'canvas' );
	var mesh;
	canvas.width = 1920;
	canvas.height = 1080;

	var context = canvas.getContext( '2d' );
	
	// context.fillStyle = "#4099FF";
	// context.fillRect(0, 0, 1920, 1080);
	// context.font = "90px Calibri";

	context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = this.bgColor;
    context.fill();

    context.fillStyle = this.fontColor;
    context.font = "bold 75px Arial";
    context.textAlign = "center";

	var maxWidth = 1920;
	var lineHeight = 120;
	var x = canvas.width/2;
	var y = 300;
	var text = this.tweet;

	wrapText(context, text, x, y, maxWidth, lineHeight);

	//context.fillText(this.tweet,300,500); //Will eventually be parsed usernames.
	var tweetText = new THREE.Texture( canvas );
	//tweetText.magFilter = THREE.NearestFilter;
	//tweetText.minFilter = THREE.LinearMipMapLinearFilter;
	tweetText.needsUpdate = true;

	this.w = 16*3.5;
	this.h = 9*3.5;
	this.radius = 0;
	 
	this.yRaise = this.w/5;
	this.depth = 1;
	this.shapes = new Shapes();
	this.geometry = this.shapes.squareGeometry(this.w, this.h, this.radius, this.depth);
	Shapes.prototype.assignUVs(this.geometry);
	this.geometry.applyMatrix( new THREE.Matrix4().makeTranslation(-this.w/2, -this.h/2, 0) );
	//Create Physijs object out of canvas. This will hold the username of the Tweet.
	this.mesh = new Physijs.BoxMesh(
		this.geometry,
		Physijs.createMaterial(
			new THREE.MeshBasicMaterial( {map: tweetText, transparent:true, opacity:this.tweetOpac} ), 0, 0
		), this.mass
	);

	// var offset = this.mesh.centroid.clone();
	// this.mesh.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -offset.x, -offset.y, -offset.z ) );
	// this.mesh.position.copy( this.mesh.centroid );

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

// http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/ Modified by Danny Gillies
function wrapText(context, text, x, y, maxWidth, lineHeight) {
	// context.fillStyle = "#333333";
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