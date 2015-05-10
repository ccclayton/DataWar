"use strict";

var PointCloud=function(_scene){
	// we have to pre seed the particles. hide them with color black and size 0.
	this.scene = _scene;
	this.maxParticles = 20000;
	this.idx = -1;
	this.geometry = new THREE.Geometry();
	this.frequencyRange = 0; //Default.

	this.attributes = {
		size: {	type: 'f', value: [] },
		customColor: { type: 'c', value: [] },
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
PointCloud.prototype.update=function() {

    //this.geometry.__dirtyVertices = true;
    //this.geometry.verticesNeedUpdate = true;
    //console.log("length: " +binaries.length);
    //console.log("binaries " + binaries.values);
    var desired_y = 0;
    if (typeof binaries === 'object' && binaries.length - 1 > 0) {

            //console.log("Binary" +binaries[j]);
        for (var i = 0; i < this.geometry.vertices.length; i++) {
            //console.log("Binary: " + binaries[i]);
            //var pos = get partible position;
            var position = this.geometry.vertices[i];

            //var idx = round(scale_move(pos.y) / 100) * 16 + round(scale_move(pos.y));
            var index = Math.floor((position.x / 100) + 8); //TODO: FIX
            //console.log(index);
            //get index from 0 to 255

            var binaryVal = binaries[index];
			var low = (index*10);
			var high = (index+1) * 10;
			//var segment = binaries.slice((index-1)*16, index*16);
			var segment = [];

			for (var k = low; k < high; k++) {
				segment.push(binaries[k]);
			}

			var sum = 0;
			for (var j = 0; j < segment.length; j++) {
				sum =+ segment[j];
			}
			if (sum == null) {
				console.log(sum);
			}
			var average = sum/segment.length;

			//console.log(sum);

            if(index >= 0 && index <= 3){
				//console.log(sum);
                //console.log("index 0-3");
                this.values_color[i].copy(new THREE.Color(0xFF0000)); //Red
                position.y += getLevel(average);
                if (position.y > 100) {
                    position.y = 95;
                } else if (position.y < 0) {
                    position.y = 0;
                }
            }
            else if(index >= 4 && index <= 7){
                this.values_color[i].copy(new THREE.Color(0x66CCFF)); //Light Blue
                position.y += getLevel(average);
                if (position.y > 100) {
                    position.y = 95;
                } else if (position.y < 0) {
                    position.y = 0;
                }

            }
            else if(index >= 8 && index <= 11){
                this.values_color[i].copy(new THREE.Color(0x47B247)); //Green
                position.y += getLevel(average);
                if (position.y > 100) {
                    position.y = 95;
                } else if (position.y < 0) {
                    position.y = 0;
                }

            }
            else if(index >= 12 && index <= 15){
				//console.log(average);
                this.values_color[i].copy(new THREE.Color(0xCC66FF)); //Light purple
                position.y += getLevel(average);
                if (position.y > 100) {
                    position.y = 95;
                } else if (position.y < 0) {
                    position.y = 0;
                }

            }
            //var color = this.values_color[i];
            //console.log(color);
           // this.values_color[i].copy(new THREE.Color());
            //apply color to pointCloud.attributes.color[i];
            desired_y = position.y + binaryVal;
            //    var desired y = get_y(val, current
            ////    pos.y
            ////)
            ////    ;
            ////    apply
            ////    y
            ////    to
            ////    pointCloud.vertices[i];
            this.geometry.vertices[i].y = position.y;


        }
        this.geometry.verticesNeedUpdate = true;
        this.geometry.__dirtyVertices = true;
        this.attributes["customColor"].needsUpdate = true;

    }
};

function getLevel(average){
    if (average > 2) {
        return 1;
    } else if (average > 1.5) {
        return .6;
    } else if (average > 1) {
        return .3;
    } else if (average > .1) {
        return .1;
    } else {
        return -5;
    }

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

PointCloud.prototype.addBatch = function(){
	for ( var i = 0; i < 2000; i ++ ) {
		var vertex = new THREE.Vector3();
		vertex.x = (Math.random() - 0.5);
		vertex.y = Math.random() * 0.03 + 0.01;
        //vertex.y = -100;
		vertex.z = (Math.random() - 0.5);
		vertex.multiplyScalar( 1600);

		// this.add( vertex, 0xffaa00 , 10 );
		this.add( vertex, 0xffffff , 40 );
	}
	this.idx=2000;
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
		this.idx=2000;
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


