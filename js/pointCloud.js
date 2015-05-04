"use strict";

var PointCloud=function(_scene){
	// we have to pre seed the particles. hide them with color black and size 0.
	this.scene = _scene;
	this.maxParticles = 20000;
	this.idx = -1;
	this.geometry = new THREE.Geometry();

	this.attributes = {
		size: {	type: 'f', value: [] },
		customColor: { type: 'c', value: [] }
	};

	this.values_size = this.attributes.size.value;
	this.values_color = this.attributes.customColor.value;


	this.uniforms = {
		amplitude: { type: "f", value: 1.0 },
		// color:     { type: "c", value: new THREE.Color( 0x505050 ) },
		color:     { type: "c", value: new THREE.Color( 0xffff50 ) },
		texture:   { type: "t", value: THREE.ImageUtils.loadTexture( "./images/spark1.png" )},
		// texture:   { type: "t", value: THREE.ImageUtils.loadTexture( config.bird.pcImage )},
		offset: {type: "v2", value:new THREE.Vector2( 2, -4 ).multiplyScalar(0.01)}
	};
	this.init();
}

PointCloud.prototype.init = function(){
	var shaderMaterial = new THREE.ShaderMaterial( {
		uniforms:       this.uniforms,
		attributes:     this.attributes,
		vertexShader:   document.getElementById( 'vertexshaderParticle' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshaderParticle' ).textContent,

		blending:       THREE.AdditiveBlending,// : THREE.NormalBlending,
		depthTest:      false,
		transparent:    true

	});

	this.seedParticles(this.maxParticles);
	var pc = new THREE.PointCloud( this.geometry, shaderMaterial );
	pc.frustumCulled = false;
	window.pc = pc;
	this.scene.add( pc );
};



PointCloud.prototype.seedParticles=function(numVertices){
	for ( var i = 0; i < numVertices; i ++ ) {
		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * 2 - 1;
		vertex.y = -1 ; //hide underneath water
		vertex.z = Math.random() * 2 - 1;
		this.geometry.vertices.push(vertex);

		// add( vertex, 0xffaa00 , 10 );
		this.values_size.push(0);
		this.values_color.push(new THREE.Color( 0x000000));
	}

};

PointCloud.prototype.addBatch = function(){
	for ( var i = 0; i < 1000; i ++ ) {
		var vertex = new THREE.Vector3();
		vertex.x = (Math.random() - 0.5);
		vertex.y = Math.random()*0.03+0.01;
		vertex.z = (Math.random() - 0.5);
		vertex.multiplyScalar( 2000);

		// this.add( vertex, 0xffaa00 , 10 );
		this.add( vertex, 0xffffff , 40 );
	}
};

//pull camera back 50, now we add particle at the center of yawObject
PointCloud.prototype.addInFrontOfCamera = function(){
	var pos = controls.getObject().position.clone();
	// var dir = new THREE.Vector3();
	// controls.getDirection(dir);
	// var dir = new THREE.Vector3(0,0,-1);
	// dir.applyQuaternion(camera.quaternion);
	// pos.add(dir.multiplyScalar(40))
	pos.add(new THREE.Vector3(
			(Math.random()-0.5) *4,
			Math.random()*4 + 5,
			(Math.random()-0.5) * 4
			));
	pointCloud.add(pos, 0xffffff , 2);
}

PointCloud.prototype.add = function(vertex, color, size){
	this.idx ++;
	if(this.idx == this.maxParticles){ //when max particle exceeded, we stop adding new points.
		this.idx=0;
	}

	// console.log(this.idx);
	this.geometry.vertices[this.idx].copy(vertex);
	this.geometry.verticesNeedUpdate = true;

	this.values_size[this.idx]=size;
	this.values_color[this.idx].copy(new THREE.Color( color));

	this.attributes["size"].needsUpdate = true;
	this.attributes["customColor"].needsUpdate = true;

	// if ( vertex.x < 0 )
	// 	_.last(values_color).setHSL( 0.5 + 0.1 * ( geometry.vertices.length / 1000 ), 0.7, 0.5 );
	// else
	// 	_.last(values_color).setHSL( 0.0 + 0.1 * ( geometry.vertices.length / 1000 ), 0.9, 0.5 );
	return this.idx;
};

PointCloud.prototype.changeColor = function(idx, color){
	this.values_color[idx].copy(new THREE.Color(color));
	this.attributes["customColor"].needsUpdate = true;
};


