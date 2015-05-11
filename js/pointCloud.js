"use strict";

var PointCloud=function(_scene){
	// we have to pre seed the particles. hide them with color black and size 0.
	this.scene = _scene;
	this.maxParticles = 20000;
	this.fieldSize = 10000;
	this.idx = -1;
	this.geometry = new THREE.Geometry();
	this.frequencyRange = 0; //Default.
	this.maxHeight = 250;
	this.divisor = 1;
	this.subtractor = 0;
	this.animation = 0;

	this.attributes = {
		size: {	type: 'f', value: [] },
		customColor: { type: 'c', value: [] }
		// velocity_x: { type: 'f', value: []}
	};

	this.values_size = this.attributes.size.value;
	this.values_color = this.attributes.customColor.value;


	this.uniforms = {
		amplitude: { type: "f", value: 1.0 },
		// color:     { type: "c", value: new THREE.Color( 0x505050 ) },
		color:     { type: "c", value: new THREE.Color( 0xFFFF66 ) },//0xFFFF66
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
		transparent:    true,
		opacity:0.5
	});

	this.seedParticles(this.maxParticles);
	var pc = new THREE.PointCloud( this.geometry, shaderMaterial );
	pc.frustumCulled = false;
	window.pc = pc;
	this.scene.add( pc );
};


// update should be called in the main render loop
PointCloud.prototype.updateLinear=function() {

    if (typeof binaries === 'object' && binaries.length - 1 > 0) {

        for (var i = 0; i < this.geometry.vertices.length; i++) {

            var position = this.geometry.vertices[i];

			// gets index (0 - 15)
            var index = Math.floor((position.x / 200) + 8);

			var low = (index*10);
			var high = (index+1) * 10;
			var segment = [];

			for (var k = low; k < high; k++) {
				segment.push(binaries[k]);
			}

			var max = 0;
			for (var j = 0; j < segment.length; j++) {
				if (max < segment[j]) {
					max = segment[j];
				}
			}

            if(index >= 0 && index <= 3){
                this.values_color[i].copy(new THREE.Color(0xFF0000)); //Red
            }
            else if(index >= 4 && index <= 7){
                this.values_color[i].copy(new THREE.Color(0x0088FF)); //Light Blue
            }
            else if(index >= 8 && index <= 11){
                this.values_color[i].copy(new THREE.Color(0x00FF00)); //Green
            }
            else if(index >= 12 && index <= 15){
                this.values_color[i].copy(new THREE.Color(0xCC66FF)); //Light purple

            }
			position.y += this.getLevelHighest(max);
			if (position.y > 500) {
				position.y = 495;
			} else if (position.y < 0) {
				position.y = 0;
			}

            this.geometry.vertices[i].y = position.y;


        }
        this.geometry.verticesNeedUpdate = true;
        this.geometry.__dirtyVertices = true;
        this.attributes["customColor"].needsUpdate = true;

    }
};

PointCloud.prototype.updateLinear32=function() {

	if (typeof binaries === 'object' && binaries.length - 1 > 0) {

		for (var i = 0; i < this.geometry.vertices.length; i++) {

			var position = this.geometry.vertices[i];

			var index = Math.floor((position.x / 100) + 16);

			var low = (index*5);
			var high = (index+1) * 5;
			var segment = [];

			for (var k = low; k < high; k++) {
				segment.push(binaries[k]);
			}

			var max = 0;
			for (var j = 0; j < segment.length; j++) {
				if (max < segment[j]) {
					max = segment[j];
				}
			}

			if(index >= 0 && index <= 3){
				this.values_color[i].copy(new THREE.Color(0xFF0000)); //Red
			}
			else if(index >= 4 && index <= 7){
				this.values_color[i].copy(new THREE.Color(0x0088FF)); //Light Blue
			}
			else if(index >= 8 && index <= 11){
				this.values_color[i].copy(new THREE.Color(0x00FF00)); //Green
			}
			else if(index >= 12 && index <= 15){
				this.values_color[i].copy(new THREE.Color(0xCC66FF)); //Light purple
			}
			else if(index >= 16 && index <= 19){
				this.values_color[i].copy(new THREE.Color(0x0000FF)); //Dark Blue
			}
			else if(index >= 20 && index <= 23){
				this.values_color[i].copy(new THREE.Color(0xFF00FF)); //Fuschia
			}
			else if(index >= 24 && index <= 27){
				this.values_color[i].copy(new THREE.Color(0x006600)); //Dark Green
			}
			else if(index >= 28 && index <= 31){
				this.values_color[i].copy(new THREE.Color(0x660066)); //Dark purple
			}
			position.y += this.getLevelHighest(max);
			if (position.y > 500) {
				position.y = 495;
			} else if (position.y < 0) {
				position.y = 0;
			}

			this.geometry.vertices[i].y = position.y;


		}
		this.geometry.verticesNeedUpdate = true;
		this.geometry.__dirtyVertices = true;
		this.attributes["customColor"].needsUpdate = true;

	}
};


PointCloud.prototype.updateGrid=function() {

	if (typeof binaries === 'object' && binaries.length - 1 > 0) {

		for (var i = 0; i < this.geometry.vertices.length; i++) {
			var position = this.geometry.vertices[i];

			var x_index = Math.floor((position.x / 200) + 8);
			var z_index = Math.floor((position.z / 200) + 8);

			var x_low = x_index*1;
			var x_high = (x_index+1)*1;
			var z_low = z_index*1;
			var z_high = (z_index+1)*1;
			var segment = [];

			for (var k = x_low; k < x_high; k++) {
				for (var j = z_low; j < z_high; j++) {
					segment.push(binaries[j*4 + k]);
				}
			}

			var max = 0;
			for (var j = 0; j < segment.length; j++) {
				if (max < segment[j]) {
					max = segment[j];
				}
			}


			if(x_index >= 0 && x_index <= 3){
				if (z_index >= 0 && z_index <=3) {
					this.values_color[i].copy(new THREE.Color(0xFF0000)); //Red
				} else if (z_index >= 4 && z_index <= 7) {
					this.values_color[i].copy(new THREE.Color(0x990099)); //Purple

				} else if (z_index >= 8 && z_index <= 11) {
					this.values_color[i].copy(new THREE.Color(0x00FF00)); //Green

				} else if (z_index >= 12 && z_index <= 15) {
					this.values_color[i].copy(new THREE.Color(0xFFFF00)); //Yellow
				}
			}
			else if(x_index >= 4 && x_index <= 7){
				if (z_index >= 0 && z_index <=3) {
					this.values_color[i].copy(new THREE.Color(0x00FF00)); //Green
				} else if (z_index >= 4 && z_index <= 7) {
					this.values_color[i].copy(new THREE.Color(0xFFFF00)); //Yellow

				} else if (z_index >= 8 && z_index <= 11) {
					this.values_color[i].copy(new THREE.Color(0x0088FF)); //Baby blue

				} else if (z_index >= 12 && z_index <= 15) {
					this.values_color[i].copy(new THREE.Color(0xFF00FF)); //Red
				}

			}
			else if(x_index >= 8 && x_index <= 11){
				if (z_index >= 0 && z_index <=3) {
					this.values_color[i].copy(new THREE.Color(0x0088FF)); //Baby blue

				} else if (z_index >= 4 && z_index <= 7) {
					this.values_color[i].copy(new THREE.Color(0x0000FF)); //Dark Blue

				} else if (z_index >= 8 && z_index <= 11) {
					this.values_color[i].copy(new THREE.Color(0xFF0000)); //Red

				} else if (z_index >= 12 && z_index <= 15) {
					this.values_color[i].copy(new THREE.Color(0x00FF00)); //Dark Green
				}

			}
			else if(x_index >= 12 && x_index <= 15) {
				if (z_index >= 0 && z_index <= 3) {
					this.values_color[i].copy(new THREE.Color(0xFF8800)); //Orange

				} else if (z_index >= 4 && z_index <= 7) {
					this.values_color[i].copy(new THREE.Color(0xFF00FF)); //Fuschia

				} else if (z_index >= 8 && z_index <= 11) {
					this.values_color[i].copy(new THREE.Color(0x8800FF)); //Dark Green

				} else if (z_index >= 12 && z_index <= 15) {
					this.values_color[i].copy(new THREE.Color(0x0000FF)); //Dark Blue
				}
			}
			position.y += this.getLevelHighest(max);
			if (position.y > 500) {
				position.y = 495;
			} else if (position.y < 0) {
				position.y = 0;
			}

			this.geometry.vertices[i].y = position.y;


		}
		this.geometry.verticesNeedUpdate = true;
		this.geometry.__dirtyVertices = true;
		this.attributes["customColor"].needsUpdate = true;

	}
};

function getLevel(average){
	return average - 5;
}

function getLevelGrid(value) {
	return (value/10) - 10;
}

PointCloud.prototype.getLevelHighest = function(value) {
	return value/(this.divisor) - this.subtractor;
}




function getRandomColor() {
    var color = '#';
    var letters = '0123456789ABCDEF'.split('');
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    var colorWithoutQuotes = String(color);
    colorWithoutQuotes = colorWithoutQuotes.substring(0,colorWithoutQuotes.length);

    return colorWithoutQuotes;
}


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

PointCloud.prototype.addBatch = function(batchSize){
	for ( var i = 0; i < batchSize; i ++ ) {
		var vertex = new THREE.Vector3();
		vertex.x = (Math.random() - 0.5);
		vertex.y = Math.random() * 0.03 + 0.01;
        //vertex.y = -100;
		vertex.z = (Math.random() - 0.5);
		vertex.multiplyScalar(3200);

		//this.add( vertex, 0x000000 , 50 );
		this.add( vertex, 0x000000 , (Math.random()*50)+75 );
	}
	this.idx=batchSize;
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
			Math.random()*4 + 6,
			(Math.random()-0.5) * 4
			));
	pointCloud.add(pos, 0x50ffff , 2);
}

PointCloud.prototype.add = function(vertex, color, size){
	this.idx ++;
	if(this.idx == this.maxParticles){ //when max particle exceeded, we stop adding new points.
		return this.idx--;
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

PointCloud.prototype.changeOpacity = function(idx, opacity){
	window.pc[idx].material.opacity = opacity
	// this.attributes["customColor"].needsUpdate = true;
};


