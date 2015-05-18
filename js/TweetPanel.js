/**
 * @author: Colin Clayton http://github.com/ccclayton
 * @author: Danny Gillies
 */
"use strict";
function TweetPanel(tweet, position, mass, options) {
    Node.call(this);
    this.tweet = tweet;
    this.position = position;
    this.mass = mass;
    this.mesh = null;
    this.bgColor = options.bgColor || "#FFFFFF";
    this.fontColor = options.fontColor || "#000000";
    this.tweetOpac = options.opacity || 0.75;
}

TweetPanel.prototype = new Node();         //Inheritance
TweetPanel.prototype.constructor = Node;  //Fixes the pointer.

TweetPanel.prototype.draw = function (location) {
    var canvas;
    var mesh;
    var context;
    var tweetText,x, y, text, maxWidth, lineHeight;
    canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    context = canvas.getContext('2d');

    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = this.bgColor;
    context.fill();

    context.fillStyle = this.fontColor;
    context.font = "bold 75px Arial";
    context.textAlign = "center";

    maxWidth = 1920;
    lineHeight = 120;
    x = canvas.width / 2;
    y = 300;
    text = this.tweet;

    wrapText(context, text, x, y, maxWidth, lineHeight);
    tweetText = new THREE.Texture(canvas);
    tweetText.needsUpdate = true;

    this.w = 16 * 3.5;
    this.h = 9 * 3.5;
    this.radius = 0;

    this.yRaise = this.w / 5;
    this.depth = 1;
    this.shapes = new Shapes();
    this.geometry = this.shapes.squareGeometry(this.w, this.h, this.radius, this.depth);
    Shapes.prototype.assignUVs(this.geometry);
    this.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-this.w / 2, -this.h / 2, 0));

    this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({
        map: tweetText,
        transparent: true,
        opacity: this.tweetOpac
    }));

    //Must use Physi.js Meshes if you'd like to use physics objects for the panels.

    // this.mesh = new Physijs.BoxMesh(
    // 	this.geometry,
    // 	Physijs.createMaterial(
    // 		new THREE.MeshBasicMaterial( {map: tweetText, transparent:true, opacity:this.tweetOpac} ), 0, 0
    // 	), this.mass
    // );

    this.mesh.position.set(location.x, location.y, location.z);
    this.mesh.geometry.verticesNeedUpdate = true;
    this.mesh.geometry.elementsNeedUpdate = true;

    //Must use __dirtyPosition = true flag if using Physi.js Meshes.
    //This is required to update the position correctly.
    //this.mesh.__dirtyPosition = true;

    scene.add(this.mesh);
};

TweetPanel.prototype.getPosition = function () {
    return this.mesh.position;
}
TweetPanel.prototype.updateMeshPosition = function () {
    this.position.copy(this.mesh.position);
    this.mesh.__dirtyPosition = true;
};

TweetPanel.prototype.setPosition = function (newPos) {
    this.mesh.position.copy(newPos);
    this.mesh.__dirtyPosition = true;
}

TweetPanel.prototype.setRotation = function (newRotation) { // THREE.Vector3
    var euler = new THREE.Euler(newRotation.x, newRotation.y, newRotation.z, 'XYZ');
    this.mesh.position.applyEuler(euler);

    this.mesh._dirtyRotation = true;
}

// http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial
// Modified by Danny Gillies
function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';

    for (var n = 0; n < words.length; n++) {
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