var camera, scene, renderer;
var geometry, material, mesh;
var controls;
var materials = [];
var boxText = new THREE.ImageUtils.loadTexture('../textures/wood_texture.jpg');
var collidableMeshList = [];
var cubes = new Array();
var time = Date.now();

var cubeGeometry = new THREE.CubeGeometry(10,10,10);
var material = new THREE.MeshLambertMaterial({map:boxText, shading: THREE.FlatShading});
PlayerCube = new THREE.Mesh( cubeGeometry, material );
PlayerCube.position.set(0,0,0);

var charposition;


function init() {

	var blocker = document.getElementById( 'blocker' );
	var instructions = document.getElementById( 'instructions' );

	// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
	var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

	if ( havePointerLock ) {
		var element = document.body;

		var pointerlockchange = function ( event ) {

			if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

				controls.enabled = true;

				blocker.style.display = 'none';

			} else {

				controls.enabled = false;

				blocker.style.display = '-webkit-box';
				blocker.style.display = '-moz-box';
				blocker.style.display = 'box';

				instructions.style.display = '';

			}

		}

		var pointerlockerror = function ( event ) {
			instructions.style.display = '';
		}

		// Hook pointer lock state change events
		document.addEventListener( 'pointerlockchange', pointerlockchange, false );
		document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
		document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

		document.addEventListener( 'pointerlockerror', pointerlockerror, false );
		document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
		document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

		instructions.addEventListener( 'click', function ( event ) {

			instructions.style.display = 'none';
			// Ask the browser to lock the pointer
			element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

			if ( /Firefox/i.test( navigator.userAgent ) ) {

				var fullscreenchange = function ( event ) {

					if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

						document.removeEventListener( 'fullscreenchange', fullscreenchange );
						document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

						element.requestPointerLock();
					}

				}

				document.addEventListener( 'fullscreenchange', fullscreenchange, false );
				document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

				element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

				element.requestFullscreen();

			} else {

				element.requestPointerLock();

			}

		}, false );

	} else {

		instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

	}


	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
	// scene.updateMatrixWorld(true);

	scene.add(PlayerCube);

	var loader = new THREE.ColladaLoader();
	loader.load('../models/housetest.dae', function (result) {
		scene.add(result.scene);
		result.scene.scale.set(.8, .8, .6);
		result.scene.rotation.x = -90 * Math.PI/180;
		result.scene.position.x += -250;
		result.scene.position.z += -200;
	});

	//controls
	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );
	camera.position.set(0,10,0);

	var geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

	material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

	mesh = new THREE.Mesh( geometry, material );
	//mesh.rotation.y = Math.PI/2;
	scene.add( mesh );

	var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
	light.position.set( 0.5, 1, 0.75 );
	scene.add( light );

	var light = new THREE.SpotLight(0xffffff, 1);
	light.position.set( 0, 50, 0);
	scene.add(light);


	// Add axes
	axes = buildAxes( 1000 );
	scene.add( axes );

	// Add ADDS
	buildADDS();

	// left fence
	geometry = new THREE.CubeGeometry(193,40,2);
	material = new THREE.MeshLambertMaterial({map:boxText, shading: THREE.FlatShading});
	meshLeft = new THREE.Mesh(geometry,material);
	meshLeft.receiveShadow = true;
	meshLeft.castShadow = true;
	scene.add(meshLeft);
	collidableMeshList.push(meshLeft);
	meshLeft.position.x = -150;
	meshLeft.position.z = -235;
	meshLeft.position.y = 20;

	renderer = new THREE.WebGLRenderer({clearAlpha: 1});
	renderer.setClearColor( 0x000000 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMapSoft = true;
	document.body.appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );

	animate();
}

function buildAxes( length ) {
	var axes = new THREE.Object3D();
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z
	return axes;
}

function buildAxis( src, dst, colorHex, dashed ) {
	var geom = new THREE.Geometry(),
	mat;
	if(dashed) {
		mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
	} else {
		mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
	}
	geom.vertices.push( src.clone() );
	geom.vertices.push( dst.clone() );
	geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines
	var axis = new THREE.Line( geom, mat, THREE.LinePieces );
	return axis;
}

function buildADDS() {
	//ADDS Data Sculpture
	var i = 0;
	for(var x = 20; x < 400; x += 20) {
		var j = 0;
		cubes[i] = new Array();
		for(var y = 0; y < 60; y += 2) {
			var geometry = new THREE.CubeGeometry(1.5, 1.5, 1.5);
			
			var material = new THREE.MeshPhongMaterial({
				color: randomFairColor(),
				ambient: 0x808080,
				specular: 0xffffff,
				shininess: 20,
				reflectivity: 5.5 
			});
				
			cubes[i][j] = new THREE.Mesh(geometry, material);
			cubes[i][j].position = new THREE.Vector3(x-100, y, -400);
			cubes[i][j].rotation.y = Math.PI/2;
			
			scene.add(cubes[i][j]);
			j++;
		}
		i++;
	}
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
	
	if(typeof array === 'object' && array.length > 0) {
		var k = 0;
		for(var i = 0; i < cubes.length; i++) {
			for(var j = 0; j < cubes[i].length; j++) {
				var scale = (array[k] + boost) / 30;
				cubes[i][j].scale.z = (scale < 1 ? 1 : scale);
				k += (k < array.length ? 1 : 0);
			}
		}
	}

	charposition = controls.getObject().position;
	// console.log(charposition);
	update();

	requestAnimationFrame( animate );
	renderer.render( scene, camera );
}
function randomFairColor() {
	var min = 64;
	var max = 224;
	var r = (Math.floor(Math.random() * (max - min + 1)) + min) * 65536;
	var g = (Math.floor(Math.random() * (max - min + 1)) + min) * 256;
	var b = (Math.floor(Math.random() * (max - min + 1)) + min);
	return r + g + b;
}

function lockDirection() {

	var halfSize = 50;
	var nearHalfSize = halfSize-5;
	
	var f_vector = new THREE.Vector3( 0, 0, -1 );
	var b_vector = new THREE.Vector3( 0, 0, 1 );
	var l_vector = new THREE.Vector3( -1, 0, 0 );
	var r_vector = new THREE.Vector3( 1, 0, 0 );

	var left = new THREE.Vector3( controls.getObject().position.x-halfSize, controls.getObject().position.y-nearHalfSize, controls.getObject().position.z );
	var right = new THREE.Vector3( controls.getObject().position.x+halfSize, controls.getObject().position.y-nearHalfSize, controls.getObject().position.z );
	var front = new THREE.Vector3( controls.getObject().position.x, controls.getObject().position.y-nearHalfSize, controls.getObject().position.z+halfSize );
	var back = new THREE.Vector3( controls.getObject().position.x, controls.getObject().position.y-nearHalfSize, controls.getObject().position.z-halfSize );
	// console.log("Locking " + controls.getLastKey());
	if (controls.getLastKey() == "up") {
		controls.lockMoveForward(true);
		var left_ray = new THREE.Raycaster( left, f_vector );
		var left_intersects = left_ray.intersectObjects( collidableMeshList );
		if ( left_intersects.length > 0 && left_intersects[0].distance < halfSize ) {
			controls.getObject().position.z = left_intersects[0].point.z+halfSize+1;
		}
		var right_ray = new THREE.Raycaster( right, f_vector );
		var right_intersects = right_ray.intersectObjects( collidableMeshList );
		if ( right_intersects.length > 0 && right_intersects[0].distance < halfSize ) {
			controls.getObject().position.z = right_intersects[0].point.z+halfSize+1;
		}
	} else if (controls.getLastKey() == "down") {
		controls.lockMoveBackward(true);
		var left_ray = new THREE.Raycaster( left, b_vector );
		var left_intersects = left_ray.intersectObjects( collidableMeshList );
		if ( left_intersects.length > 0 && left_intersects[0].distance < halfSize ) {
			controls.getObject().position.z = left_intersects[0].point.z-halfSize-1;
		}
		var right_ray = new THREE.Raycaster( right, b_vector );
		var right_intersects = right_ray.intersectObjects( collidableMeshList );
		if ( right_intersects.length > 0 && right_intersects[0].distance < halfSize ) {
			controls.getObject().position.z = right_intersects[0].point.z-halfSize-1;
		}
	} else if (controls.getLastKey() == "left") {
		controls.lockMoveLeft(true);
		var back_ray = new THREE.Raycaster( back, r_vector );
		var back_intersects = back_ray.intersectObjects( collidableMeshList );
		if ( back_intersects.length > 0 && back_intersects[0].distance < halfSize ) {
			controls.getObject().position.x = back_intersects[0].point.x-halfSize-1;
		}
		var front_ray = new THREE.Raycaster( front, r_vector );
		var front_intersects = front_ray.intersectObjects( collidableMeshList );
		if ( front_intersects.length > 0 && front_intersects[0].distance < halfSize ) {
			controls.getObject().position.x = front_intersects[0].point.x-halfSize-1;
		}
	} else if (controls.getLastKey() == "right") {
		controls.lockMoveRight(true);
		var back_ray = new THREE.Raycaster( back, l_vector );
		var back_intersects = back_ray.intersectObjects( collidableMeshList );
		if ( back_intersects.length > 0 && back_intersects[0].distance < halfSize ) {
			controls.getObject().position.x = back_intersects[0].point.x+halfSize+1;
		}
		var front_ray = new THREE.Raycaster( front, l_vector );
		var front_intersects = front_ray.intersectObjects( collidableMeshList );
		if ( front_intersects.length > 0 && front_intersects[0].distance < halfSize ) {
			controls.getObject().position.x = front_intersects[0].point.x+halfSize+1;
		}
	}

}

function unlockAllDirection(){
	controls.lockMoveForward(false);
	controls.lockMoveBackward(false);
	controls.lockMoveLeft(false);
	controls.lockMoveRight(false);
}

function update()
	{
	unlockAllDirection();

	// collision detection:
	//   determines if any of the rays from the cube's origin to each vertex
	//		intersects any face of a mesh in the array of target meshes
	//   for increased collision accuracy, add more vertices to the cube;
	//		for example, new THREE.CubeGeometry( 64, 64, 64, 8, 8, 8, wireMaterial )
	//   HOWEVER: when the origin of the ray is within the target mesh, collisions do not occur
	PlayerCube.position.set(controls.getObject().position.x, 0, controls.getObject().position.z);
	var originPoint = PlayerCube.position.clone();
	var collided = false;
	
	for (var vertexIndex = 0; vertexIndex < PlayerCube.geometry.vertices.length; vertexIndex++)
	{		
		var localVertex = PlayerCube.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( PlayerCube.matrix );
		var directionVector = globalVertex.sub( PlayerCube.position );
		
		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var collisionResults = ray.intersectObjects( collidableMeshList );
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() + 20) {
			lockDirection();

		}
	}	
	/*
	var f_vector = new THREE.Vector3( 0, 0, -1 );
	var b_vector = new THREE.Vector3( 0, 0, 1 );
	var l_vector = new THREE.Vector3( -1, 0, 0 );
	var r_vector = new THREE.Vector3( 1, 0, 0 );

	var left = new THREE.Vector3( controls.getObject().position.x-halfSize, controls.getObject().position.y-nearHalfSize, controls.getObject().position.z );
	var right = new THREE.Vector3( controls.getObject().position.x+halfSize, controls.getObject().position.y-nearHalfSize, controls.getObject().position.z );
	var front = new THREE.Vector3( controls.getObject().position.x, controls.getObject().position.y-nearHalfSize, controls.getObject().position.z+halfSize );
	var back = new THREE.Vector3( controls.getObject().position.x, controls.getObject().position.y-nearHalfSize, controls.getObject().position.z-halfSize );

	// front
	if (controls.getLastKey() == "up") {
		console.log("GO");
		var left_ray = new THREE.Raycaster( left, f_vector );
		var left_intersects = left_ray.intersectObjects( collidableMeshList );
		if ( left_intersects.length > 0 && left_intersects[0].distance < halfSize ) {
			controls.getObject().position.z = left_intersects[0].point.z+halfSize+1;
		}
		var right_ray = new THREE.Raycaster( right, f_vector );
		var right_intersects = right_ray.intersectObjects( collidableMeshList );
		if ( right_intersects.length > 0 && right_intersects[0].distance < halfSize ) {
			controls.getObject().position.z = right_intersects[0].point.z+halfSize+1;
		}
	}
	// back
	if (controls.moveBackward) {
		var left_ray = new THREE.Raycaster( left, b_vector );
		var left_intersects = left_ray.intersectObjects( collidableMeshList );
		if ( left_intersects.length > 0 && left_intersects[0].distance < halfSize ) {
			controls.getObject().position.z = left_intersects[0].point.z-halfSize-1;
		}
		var right_ray = new THREE.Raycaster( right, b_vector );
		var right_intersects = right_ray.intersectObjects( collidableMeshList );
		if ( right_intersects.length > 0 && right_intersects[0].distance < halfSize ) {
			controls.getObject().position.z = right_intersects[0].point.z-halfSize-1;
		}
	}				
	// right
	if (controls.moveRight) {
		var back_ray = new THREE.Raycaster( back, r_vector );
		var back_intersects = back_ray.intersectObjects( collidableMeshList );
		if ( back_intersects.length > 0 && back_intersects[0].distance < halfSize ) {
			controls.getObject().position.x = back_intersects[0].point.x-halfSize-1;
		}
		var front_ray = new THREE.Raycaster( front, r_vector );
		var front_intersects = front_ray.intersectObjects( collidableMeshList );
		if ( front_intersects.length > 0 && front_intersects[0].distance < halfSize ) {
			controls.getObject().position.x = front_intersects[0].point.x-halfSize-1;
		}
	}
	// left
	if (controls.moveLeft) {
		var back_ray = new THREE.Raycaster( back, l_vector );
		var back_intersects = back_ray.intersectObjects( collidableMeshList );
		if ( back_intersects.length > 0 && back_intersects[0].distance < halfSize ) {
			controls.getObject().position.x = back_intersects[0].point.x+halfSize+1;
		}
		var front_ray = new THREE.Raycaster( front, l_vector );
		var front_intersects = front_ray.intersectObjects( collidableMeshList );
		if ( front_intersects.length > 0 && front_intersects[0].distance < halfSize ) {
			controls.getObject().position.x = front_intersects[0].point.x+halfSize+1;
			}
	}
	controls.getObject().updateMatrix();
	// collideMesh.position.y += 100;	
	*/
	controls.update();
}