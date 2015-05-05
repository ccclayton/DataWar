"use strict";

var LineTrace=function(_scene){
	// we have to pre seed the particles. hide them with color black and size 0.
	this.scene = _scene;
	this.maxVertices = 20000;
	this.idx = -10; //mark first position
	this.lastPos = new THREE.Vector3();
	this.lineColor = 0xFFFFFF;
	this.lineGeometry = new THREE.Geometry();
	for(var i=0; i<this.maxVertices; i++){
		this.lineGeometry.vertices.push(new THREE.Vector3(0,-1,0)); //hide under
	};

	this.lineMaterial = new THREE.LineBasicMaterial({
		color: this.lineColor,
		opacity: 1,
		lineWidth: 5
	});

	this.line = new THREE.Line(this.lineGeometry, this.lineMaterial, THREE.LinePieces);
	this.scene.add(this.line);
	this.line.geometry.dynamic = true;
	this.line.visible = true;
	this.line.frustumCulled = false;
}


//pull camera back 50, now we add particle at the center of yawObject
LineTrace.prototype.addInFrontOfCamera = function(){
	var pos = controls.getObject().position.clone();
	pos.y+=12;

	var lpos = this.lastPos.clone();
	lpos.multiplyScalar(0.8);
	pos.multiplyScalar(0.2).add(lpos);

	if(this.idx == -10){ //first point
		this.lastPos.copy(pos);
		this.idx = -1;
	}

	this.idx++;
	this.lineGeometry.vertices[this.idx].copy(this.lastPos);
	this.idx++;
	this.lineGeometry.vertices[this.idx].copy(pos);
	this.lastPos.copy(pos);

	this.lineGeometry.verticesNeedUpdate = true;

	if(this.idx==this.maxVertices -1)
		this.idx = -1;
}


