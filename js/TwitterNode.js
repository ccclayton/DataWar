"use strict";
var geomFlag;//global
function TwitterNode(username, geometry, geometryType, position, mass, options) {
    //ADDED THIS so it extends the Node class.
    Node.call(this);

    this.username = username;
    this.geometry = geometry;
    this.geometryType = geometryType;
    this.position = position;
    //this._dirtyPosition = true;
    this.mass = mass;
    this.retweeted = 0;
    //this.mesh = null; //NEEDS TO BE THE ACTUAL MESH..
    this.bgColor = options.bgColor || "#FFFFFF";
    this.fontColor = options.fontColor || "#000000";
    this.tweetOpac = options.opacity || 0.75;


    if ((this.geometryType == null && this.geometry == null) || (this.geometryType.toUpperCase() == "default".toUpperCase() && this.geometry == null)) {
        this.geomFlag = 0; //Default
    }
    else if (this.geometryType.toUpperCase() == "Cube".toUpperCase() || this.geometryType.toUpperCase() == "Box".toUpperCase()) {
        this.geomFlag = 2; //CubeGeometry, BoxGeometry, BoxMesh
    }
    else if (this.geometryType.toUpperCase() == "Sphere".toUpperCase()) {
        this.geomFlag = 3; //SphereGeometry, SphereMesh
    }
    else if (this.geometryType.toUpperCase() == "Cylinder".toUpperCase() || this.geometryType.toUpperCase() == "Cone".toUpperCase() || this.geometryType.toUpperCase() == "Capsule".toUpperCase()) {
        this.geomFlag = 4; //CylinderGeometry, ConeMesh,CapsuleMesh
    }
    else if (this.geometryType.toUpperCase() == "Convex".toUpperCase()) {
        this.geomFlag = 5; //ConvexMesh
    }
    else if (this.geometryType.toUpperCase() == "Concave".toUpperCase()) {
        this.geomFlag = 6; //ConcaveMesh
    }
    else {
        this.geomFlag = 1;

    }

    //return this.draw(this.username,this.geometry,this.geometryType,this.position,this.mass,this.geomFlag); //returns Node "object".

}

TwitterNode.prototype = new Node();         //Inheritance
TwitterNode.prototype.constructor = Node;  //Fixes the pointer.

TwitterNode.prototype.draw = function (location) {

    var canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    var context = canvas.getContext('2d');
    var mesh;

    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.fillStyle = this.bgColor;
    context.fill();

    context.fillStyle = this.fontColor;
    context.font = "bold 200px Arial";
    context.textAlign = "center";

    var maxWidth = 1920;
    var lineHeight = 120;
    var x = canvas.width/2;
    var y = 540;
    var text = "@" + this.username;

    wrapText(context, text, x, y, maxWidth, lineHeight);

    // context.fillText(text, 300, 500); //Will eventually be parsed usernames.
    // context.textAlign = 'center';
    var tweeterTexture = new THREE.Texture(canvas);
    tweeterTexture.needsUpdate = true;
    //tweeterTexture.magFilter = THREE.NearestFilter;
    //tweeterTexture.minFilter = THREE.LinearMipMapLinearFilter;

    //NEED A SWITCH CASE FOR DIFFERENT TYPES OF GEOMETRY/Meshes
    if (this.geometry == null) {
        this.geometry = new THREE.SphereGeometry(6, 32, 32);
    }

    switch (this.geomFlag) {

        case 1:
            alert("Error at creation of node.");
            break;
        case 2:
            this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({map: tweeterTexture, side: THREE.DoubleSide, transparent:true, opacity:this.tweetOpac}));
            // this.mesh = new Physijs.BoxMesh(
            //     this.geometry,
            //     Physijs.createMaterial(
            //         new THREE.MeshBasicMaterial({map: tweeterTexture, side: THREE.DoubleSide, transparent:true, opacity:this.tweetOpac}), 0, 0
            //     ), this.mass
            // );
            this.mesh.__dirtyPosition = true;
            break;
        case 3:
            this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({map: tweeterTexture, side: THREE.DoubleSide, transparent:true, opacity:this.tweetOpac}) );
            // this.mesh = new Physijs.SphereMesh(
            //     this.geometry,
            //     Physijs.createMaterial(
            //         new THREE.MeshBasicMaterial({map: tweeterTexture, side: THREE.DoubleSide, transparent:true, opacity:this.tweetOpac}), 0, 0
            //     ), this.mass
            // );
            this.mesh.__dirtyPosition = true;
            break;
        case 4:    //NEED TO FIX PHYSICS. CYLINDER WILL CURRENTLY FALL OVER AND ROLL AWAY.
            this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({map: tweeterTexture, side: THREE.DoubleSide, transparent:true, opacity:this.tweetOpac}));
            // this.mesh = new Physijs.CylinderMesh(
            //     this.geometry,
            //     Physijs.createMaterial(
            //         new THREE.MeshBasicMaterial({map: tweeterTexture, side: THREE.DoubleSide, transparent:true, opacity:this.tweetOpac}), 0, 0
            //     ), this.mass
            // );
            this.mesh.__dirtyPosition = true;
            break;
        case 5:
            this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({map: tweeterTexture, side: THREE.DoubleSide, transparent:true, opacity:this.tweetOpac}));
            // this.mesh = new Physijs.ConvexMesh(
            //     geometry,
            //     Physijs.createMaterial(
            //         new THREE.MeshBasicMaterial({map: tweeterTexture, side: THREE.DoubleSide, transparent:true, opacity:this.tweetOpac}), 0, 0
            //     ), this.mass
            // );
            this.mesh.__dirtyPosition = true;
            break;
        case 6:
            this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({map: tweeterTexture, side: THREE.DoubleSide, transparent:true, opacity:this.tweetOpac}));
            // this.mesh = new Physijs.ConcaveMesh(
            //     this.geometry,
            //     Physijs.createMaterial(
            //         new THREE.MeshBasicMaterial({map: tweeterTexture, side: THREE.DoubleSide, transparent:true, opacity:this.tweetOpac}), 0, 0
            //     ), this.mass
            // );
            this.mesh.__dirtyPosition = true;
            break;
        default:
            this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({map: tweeterTexture, side: THREE.DoubleSide, transparent:true, opacity:this.tweetOpac}));
            // this.mesh = new Physijs.SphereMesh(
            //     this.geometry,
            //     Physijs.createMaterial(
            //         new THREE.MeshBasicMaterial({map: tweeterTexture, side: THREE.DoubleSide, transparent:true, opacity:this.tweetOpac}), 0, 0
            //     ), this.mass
            // );
            this.mesh.__dirtyPosition = true;

            break;
    }
    this.mesh.__dirtyPosition = true;
    this.mesh.position.set(location.x,location.y,location.z);
    this.mesh.geometry.verticesNeedUpdate = true;
    this.mesh.geometry.elementsNeedUpdate = true;
    //this.mesh._dirtyPosition = true;

    scene.add(this.mesh);
}

TwitterNode.prototype.killNode = function () {
    scene.remove(this.node);
};

TwitterNode.prototype.incRetweets = function () {
    this.retweeted++;
}

TwitterNode.prototype.updateMeshPosition = function(){
    this.position.copy( this.mesh.position);
    this.mesh.__dirtyPosition = true;
};

TwitterNode.prototype.getPosition = function () {
    return this.mesh.position;
};


TwitterNode.prototype.setPosition = function(newPos){
    this.mesh.position.copy(newPos);
    this.mesh.__dirtyPosition = true;
}

TwitterNode.prototype.setRotation = function (newRotation){ // THREE.Vector3
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