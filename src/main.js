//------------LATEST REVISION:

var renderer, scene, camera, cube1, cube2;

var geometry, material, mesh, fence, cube1, cube2, ground,PlayerCube;
var controls;
var materials = [];
var boxText = new THREE.ImageUtils.loadTexture('../textures/wood_texture.jpg');
//  var collidableMeshList = [];
var cubes = new Array();

init();
animate();
//});

function init() {
	
	console.log("Beginning of Init..");
	Physijs.scripts.worker = '../Physijs/physijs_worker.js';
	Physijs.scripts.ammo = '../Physijs/examples/js/ammo.js';

	
  // renderer = new THREE.WebGLRenderer();
  // renderer.setSize(window.innerWidth, window.innerHeight);
  // //renderer.setClearColor(0x87CEEB);
  // renderer.setClearColor( 0x000000 );
 //  	renderer = new THREE.WebGLRenderer({clearAlpha: 1});
	// renderer.setClearColor( 0x0000FF );
	// renderer.setSize( window.innerWidth, window.innerHeight );
	// renderer.shadowMapSoft = true;
 //  document.body.appendChild(renderer.domElement);

 scene = new Physijs.Scene;
 scene.setGravity(
 	new THREE.Vector3(0,-250,0)
 	);


 camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
 camera.position.z = 100;
 scene.add(camera);



 var playerCubeMaterial = Physijs.createMaterial(
 	new THREE.MeshLambertMaterial({map:boxText, shading: THREE.FlatShading}),
 	0.2,
 	0.1 
 	);
 playerCubeMaterial.map.wrapS = playerCubeMaterial.map.wrapT = THREE.RepeatWrapping;
 playerCubeMaterial.visible = false;

 PlayerCube = new Physijs.SphereMesh(
 	new THREE.SphereGeometry(10),
 	playerCubeMaterial,
 	40
 	);

 
 scene.add(PlayerCube)
 PlayerCube.position.set(-50,0,-70);


 	//controls
 	controls = new THREE.PointerLockControls(camera);
 	scene.add( controls.getObject() );
 	camera.position.set(0,10,0);
 	console.log("Player cube: " + PlayerCube.id);


 	cube1 = new Physijs.BoxMesh(
 		new THREE.CubeGeometry(10, 10, 10),
 		Physijs.createMaterial(
 			new THREE.MeshNormalMaterial(), 0.2, 0.9
 			)
 		);
 	cube1.position.x = -50;
 	scene.add(cube1);
 	console.log("cube 1: " + cube1.id);

 	cube2 = new Physijs.BoxMesh(
 		new THREE.CubeGeometry(10, 10, 10),
 		Physijs.createMaterial(
 			new THREE.MeshNormalMaterial(), 0.2, 0.9
 			)
 		);
 	cube2.position.x = 50;
 	scene.add(cube2);
 	console.log("cube 2: " + cube2.id);

 	cube2.addEventListener('collision', function(object) {
 		console.log("Object " + this.id + " collided with " + object.id);
 	});

 	// Ground
		ground_material = Physijs.createMaterial(
			new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( '../textures/brick.jpg' ) }),
			.8, // high friction
			.3 // low restitution
		);
		ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
		ground_material.map.repeat.set( 10, 10);
		
		ground = new Physijs.BoxMesh(
			new THREE.CubeGeometry(1000, 1, 1000),
			ground_material,
			0 // mass
		);
		ground.receiveShadow = true;
		ground.position.setY(-1);
		scene.add( ground );

	fence = new Physijs.BoxMesh(
		new THREE.CubeGeometry(193, 40, 2),
		Physijs.createMaterial(
			new THREE.MeshLambertMaterial({map: boxText, shading: THREE.FlatShading}), 0.8, 0.3
			),
			30
		);
	
	scene.add(fence);
	fence.position.x = -150;
	fence.position.z = -235;
	fence.position.y = 20;

	PlayerCube.addEventListener('collision', function(object) {
 		console.log("Object " + this.id + " collided with " + object.id);
 		if (object.id == fence.id) {
 			console.log("PLAYER HIT WALL");
 		}
 	});

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

	// // Fence
	// ground_material = Physijs.createMaterial(
	// 	new THREE.MeshLambertMaterial({map:boxText, shading: THREE.FlatShading}),
	// 	.8, // high friction
	// 	.4 // low restitution
	// );
	// ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
	// ground_material.map.repeat.set( 3, 3 );
	
	// // Ground
	// ground = new Physijs.BoxMesh(
	// 	new THREE.CubeGeometry(193, 40, 2),
	// 	ground_material,
	// 	0 // mass
	// );
	// ground.receiveShadow = true;
	// scene.add( ground );
	// ground.position.x = -150;
	// ground.position.z = -235;
	// ground.position.y = 20;

	

	renderer = new THREE.WebGLRenderer({clearAlpha: 1});
	renderer.setClearColor( 0x000000 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMapSoft = true;
	document.body.appendChild(renderer.domElement);
	window.addEventListener( 'resize', onWindowResize, false );


	
}

function animate() {
	// mesh.__dirtyPosition = true;
	ground.__dirtyPosition = true;
	fence.__dirtyPosition = true;
	cube2.__dirtyPosition = true;
	cube1.__dirtyPosition = true;
	PlayerCube.__dirtyPosition = true;
	PlayerCube.position.set(controls.getObject().position.x, controls.getObject().position.y/2, controls.getObject().position.z);

	controls.update();
	animate_sound();
	requestAnimationFrame(animate);
  scene.simulate(); // run physics
  render();
}

function render() {
	renderer.render(scene, camera);
}








// var camera, scene, renderer;
// var geometry, material, mesh;
// var controls;
// var materials = [];
// var boxText = new THREE.ImageUtils.loadTexture('../textures/wood_texture.jpg');
// var collidableMeshList = [];
 //var cubes = new Array();


// 	Physijs.scripts.worker = '../Physijs/physijs_worker.js';
// 	Physijs.scripts.ammo = '../Physijs/examples/js/ammo.js';

// 	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

// 	// scene = new THREE.Scene();
// 	// scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
// 	// scene.updateMatrixWorld(true);

// 	scene = new Physijs.Scene;
// 		scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
// 		scene.addEventListener(
// 			'update',
// 			function() {
// 				scene.simulate( undefined, 1 );
// 			}
// 		);

// 	var playerCubeMaterial = Physijs.createMaterial(
// 		new THREE.MeshLambertMaterial({map:boxText, shading: THREE.FlatShading}),
// 		.8, // high friction
// 		.4 // low restitution
// 	);
// 	playerCubeMaterial.map.wrapS = playerCubeMaterial.map.wrapT = THREE.RepeatWrapping;
// 	playerCubeMaterial.map.repeat.set(3,3);

// 	PlayerCube = new Physijs.BoxMesh(
// 		new THREE.CubeGeometry(20,10,20),
// 		playerCubeMaterial,
// 		0
// 	);
// 	scene.add(PlayerCube)
// 	PlayerCube.position.set(0,0,0);

// 	// PlayerCube.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
// 	// 	console.log("COLLISION");
//  //    // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
// 	// });

// 	PlayerCube.addEventListener('collision', function(object) {
//     console.log("Object " + this.id + " collided with " + object.id);
//   });

// 	// scene.add(PlayerCube)
// 	// PlayerCube.position.set(0,0,0);

var loader = new THREE.ColladaLoader();
loader.load('../models/housetest.dae', function (result) {
	scene.add(result.scene);
	result.scene.scale.set(.8, .8, .6);
	result.scene.rotation.x = -90 * Math.PI/180;
	result.scene.position.x += -250;
	result.scene.position.z += -200;
});

// 	//controls
// 	controls = new THREE.PointerLockControls( camera );
// 	scene.add( controls.getObject() );
// 	camera.position.set(0,10,0);

// 	var geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
// 	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

// 	material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

// 	mesh = new THREE.Mesh( geometry, material );
// 	//mesh.rotation.y = Math.PI/2;
// 	scene.add( mesh );

// 	var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
// 	light.position.set( 0.5, 1, 0.75 );
// 	scene.add( light );

// 	var light = new THREE.SpotLight(0xffffff, 1);
// 	light.position.set( 0, 50, 0);
// 	scene.add(light);


// 	// Add axes
// 	axes = buildAxes( 1000 );
// 	scene.add( axes );

// 	// Add ADDS
// 	buildADDS();

// 	// Fence
// 	ground_material = Physijs.createMaterial(
// 		new THREE.MeshLambertMaterial({map:boxText, shading: THREE.FlatShading}),
// 		.8, // high friction
// 		.4 // low restitution
// 	);
// 	ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
// 	ground_material.map.repeat.set( 3, 3 );

// 	// Ground
// 	ground = new Physijs.BoxMesh(
// 		new THREE.CubeGeometry(193, 40, 2),
// 		ground_material,
// 		0 // mass
// 	);
// 	ground.receiveShadow = true;
// 	scene.add( ground );
// 	ground.position.x = -150;
// 	ground.position.z = -235;
// 	ground.position.y = 20;

// 	// left fence
// 	// geometry = new THREE.CubeGeometry(193,40,2);
// 	// material = new THREE.MeshLambertMaterial({map:boxText, shading: THREE.FlatShading});
// 	// meshLeft = new THREE.Mesh(geometry,material);
// 	// meshLeft.receiveShadow = true;
// 	// meshLeft.castShadow = true;
// 	// scene.add(meshLeft);
// 	// collidableMeshList.push(meshLeft);
// 	// meshLeft.position.x = -150;
// 	// meshLeft.position.z = -235;
// 	// meshLeft.position.y = 20;



// 	renderer = new THREE.WebGLRenderer({clearAlpha: 1});
// 	renderer.setClearColor( 0x000000 );
// 	renderer.setSize( window.innerWidth, window.innerHeight );
// 	renderer.shadowMapSoft = true;
// 	document.body.appendChild( renderer.domElement );

// 	window.addEventListener( 'resize', onWindowResize, false );

// 	animate();
// }

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

function animate_sound() {
	
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
}

// 	// charposition = controls.getObject().position;
// 	// console.log(charposition);
// 	update();

// 	requestAnimationFrame( animate );
// 	renderer.render( scene, camera );
// }
function randomFairColor() {
	var min = 64;
	var max = 224;
	var r = (Math.floor(Math.random() * (max - min + 1)) + min) * 65536;
	var g = (Math.floor(Math.random() * (max - min + 1)) + min) * 256;
	var b = (Math.floor(Math.random() * (max - min + 1)) + min);
	return r + g + b;
}

// // function lockDirection() {
// // 	if (controls.moveForward()) {
// // 		controls.lockMoveForward(true);
// // 	}
// // 	else if (controls.moveBackward()) {
// // 		controls.lockMoveBackward(true);
// // 	}
// // 	else if (controls.moveLeft()) {
// // 		controls.lockMoveLeft(true);
// // 		// controls.getObject().onKeyDown(65);
// // 	}
// // 	else if (controls.moveRight()) {
// // 		controls.lockMoveRight(true);
// // 		// for (var i = 0; i < 10000; i++) {
// // 			// controls.getObject().onKeyDown(83);
// // 		// }
// // 	}
// // 	else {
// // 		unlockAllDirection();
// // 	}
// // }
// // 
// // function unlockAllDirection(){
// // 	controls.lockMoveForward(false);
// // 	controls.lockMoveBackward(false);
// // 	controls.lockMoveLeft(false);
// // 	controls.lockMoveRight(false);
// // }

// function update()
// 	{
// 	// unlockAllDirection();

// 	// collision detection:
// 	//   determines if any of the rays from the cube's origin to each vertex
// 	//		intersects any face of a mesh in the array of target meshes
// 	//   for increased collision accuracy, add more vertices to the cube;
// 	//		for example, new THREE.CubeGeometry( 64, 64, 64, 8, 8, 8, wireMaterial )
// 	//   HOWEVER: when the origin of the ray is within the target mesh, collisions do not occur
// 	PlayerCube.position.set(controls.getObject().position.x, 0, controls.getObject().position.z);
// 	// var originPoint = PlayerCube.position.clone();
// 	// var collided = false;

// 	// for (var vertexIndex = 0; vertexIndex < PlayerCube.geometry.vertices.length; vertexIndex++)
// 	// {		
// 	// 	var localVertex = PlayerCube.geometry.vertices[vertexIndex].clone();
// 	// 	var globalVertex = localVertex.applyMatrix4( PlayerCube.matrix );
// 	// 	var directionVector = globalVertex.sub( PlayerCube.position );

// 	// 	var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
// 	// 	var collisionResults = ray.intersectObjects( collidableMeshList );
// 	// 	if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() + 20)
// 	// 		controls.getObject().position.set(charposition.x, charposition.y, charposition.z);
// 	// }	

// 	controls.update();
// }









// --------LAST REVISION
// var renderer, scene, camera, cube1, cube2;

// var geometry, material, mesh, fence, cube1, cube2, ground, PlayerCube, plane;
// var controls;
// var materials = [];
// var boxText = new THREE.ImageUtils.loadTexture('../textures/wood_texture.jpg');
// //  var collidableMeshList = [];
// var cubes = new Array();

// init();
// animate();
// //});

// function init() {
	
// 	console.log("Beginning of Init..");
// 	Physijs.scripts.worker = '../Physijs/physijs_worker.js';
// 	Physijs.scripts.ammo = '../Physijs/examples/js/ammo.js';


//   // renderer = new THREE.WebGLRenderer();
//   // renderer.setSize(window.innerWidth, window.innerHeight);
//   // //renderer.setClearColor(0x87CEEB);
//   // renderer.setClearColor( 0x000000 );
//  //  	renderer = new THREE.WebGLRenderer({clearAlpha: 1});
// 	// renderer.setClearColor( 0x0000FF );
// 	// renderer.setSize( window.innerWidth, window.innerHeight );
// 	// renderer.shadowMapSoft = true;
//  //  document.body.appendChild(renderer.domElement);

//  scene = new Physijs.Scene;
//  scene.setGravity(
//  	new THREE.Vector3(0,0,-10)
//  	);


//  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
//  camera.position.z = 100;
//  scene.add(camera);



//  var playerCubeMaterial = Physijs.createMaterial(
//  	new THREE.MeshLambertMaterial({map:boxText, shading: THREE.FlatShading}),
//  	0.2,
//  	0.9 
//  	);
//  playerCubeMaterial.map.wrapS = playerCubeMaterial.map.wrapT = THREE.RepeatWrapping;
//  playerCubeMaterial.map.repeat.set(3,3);

//  PlayerCube = new Physijs.BoxMesh(
//  	new THREE.CubeGeometry(20,10,20),
//  	playerCubeMaterial,
//  	0
//  	);
//  scene.add(PlayerCube)
//  PlayerCube.position.set(-50,0,-70);

//  	//controls
//  	controls = new THREE.PointerLockControls(camera);
//  	scene.add( controls.getObject() );
//  	camera.position.set(0,10,0);

//  	PlayerCube.addEventListener('collision', function(object) {
//  		console.log("Object " + this.id + " collided with " + object.id);
//  	});

//  	cube1 = new Physijs.BoxMesh(
//  		new THREE.CubeGeometry(10, 10, 10),
//  		Physijs.createMaterial(
//  			new THREE.MeshNormalMaterial(), 0.2, 0.9
//  			)
//  		);
//  	cube1.position.x = -50;
//  	scene.add(cube1);
//  	console.log("cube 1: " + cube1.id);

//  	cube2 = new Physijs.BoxMesh(
//  		new THREE.CubeGeometry(10, 10, 10),
//  		Physijs.createMaterial(
//  			new THREE.MeshNormalMaterial(), 0.2, 0.9
//  			)
//  		);
//  	cube2.position.x = 50;
//  	scene.add(cube2);
//  	console.log("cube 2: " + cube2.id);

//  	cube2.addEventListener('collision', function(object) {
//  		console.log("Object " + this.id + " collided with " + object.id);
//  	});

//  	var geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
//  	//geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );
//  	plane = new Physijs.BoxMesh(
// 		geometry,
// 		Physijs.createMaterial(
// 			new THREE.MeshBasicMaterial( {vertexColors: THREE.VertexColors} ), 0.2, 0.9
// 			)
// 		);


//  	//material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

//  	//mesh = new THREE.Mesh( geometry, material );
// 	//mesh.rotation.y = Math.PI/2;
// 	scene.add( plane );

// 	fence = new Physijs.BoxMesh(
// 		new THREE.CubeGeometry(193, 40, 2),
// 		Physijs.createMaterial(
// 			new THREE.MeshLambertMaterial({map: boxText, shading: THREE.FlatShading}), 0.2, 0.9
// 			)
// 		);

// 	scene.add(fence);
// 	fence.position.x = -150;
// 	fence.position.z = -235;
// 	fence.position.y = 20;

// 	var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
// 	light.position.set( 0.5, 1, 0.75 );
// 	scene.add( light );

// 	var light = new THREE.SpotLight(0xffffff, 1);
// 	light.position.set( 0, 50, 0);
// 	scene.add(light);





// 	// Add axes
// 	axes = buildAxes( 1000 );
// 	scene.add( axes );

// 	// Add ADDS
// 	buildADDS();

// 	// Fence
// 	ground_material = Physijs.createMaterial(
// 		new THREE.MeshLambertMaterial({map:boxText, shading: THREE.FlatShading}),
// 		.8, // high friction
// 		.4 // low restitution
// 		);
// 	ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
// 	ground_material.map.repeat.set( 3, 3 );

// 	// Ground
// 	ground = new Physijs.BoxMesh(
// 		new THREE.CubeGeometry(193, 40, 2),
// 		ground_material,
// 		0 // mass
// 		);
// 	ground.receiveShadow = true;
// 	scene.add( ground );
// 	ground.position.x = -150;
// 	ground.position.z = -235;
// 	ground.position.y = 20;



// 	renderer = new THREE.WebGLRenderer({clearAlpha: 1});
// 	renderer.setClearColor( 0x000000 );
// 	renderer.setSize( window.innerWidth, window.innerHeight );
// 	renderer.shadowMapSoft = true;
// 	document.body.appendChild(renderer.domElement);
// 	window.addEventListener( 'resize', onWindowResize, false );



// }

// function animate() {
// 	plane.__dirtyPosition = true;
// 	ground.__dirtyPosition = true;
// 	fence.__dirtyPosition = true;
// 	cube2.__dirtyPosition = true;
// 	cube1.__dirtyPosition = true;
// 	PlayerCube.__dirtyPosition = true;
// 	controls.update();
// 	animate_sound();
// 	requestAnimationFrame(animate);
//   scene.simulate(); // run physics
//   render();
// }

// function render() {
// 	renderer.render(scene, camera);
// }








// // var camera, scene, renderer;
// // var geometry, material, mesh;
// // var controls;
// // var materials = [];
// // var boxText = new THREE.ImageUtils.loadTexture('../textures/wood_texture.jpg');
// // var collidableMeshList = [];
//  //var cubes = new Array();


// // 	Physijs.scripts.worker = '../Physijs/physijs_worker.js';
// // 	Physijs.scripts.ammo = '../Physijs/examples/js/ammo.js';

// // 	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

// // 	// scene = new THREE.Scene();
// // 	// scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
// // 	// scene.updateMatrixWorld(true);

// // 	scene = new Physijs.Scene;
// // 		scene.setGravity(new THREE.Vector3( 0, -30, 0 ));
// // 		scene.addEventListener(
// // 			'update',
// // 			function() {
// // 				scene.simulate( undefined, 1 );
// // 			}
// // 		);

// // 	var playerCubeMaterial = Physijs.createMaterial(
// // 		new THREE.MeshLambertMaterial({map:boxText, shading: THREE.FlatShading}),
// // 		.8, // high friction
// // 		.4 // low restitution
// // 	);
// // 	playerCubeMaterial.map.wrapS = playerCubeMaterial.map.wrapT = THREE.RepeatWrapping;
// // 	playerCubeMaterial.map.repeat.set(3,3);

// // 	PlayerCube = new Physijs.BoxMesh(
// // 		new THREE.CubeGeometry(20,10,20),
// // 		playerCubeMaterial,
// // 		0
// // 	);
// // 	scene.add(PlayerCube)
// // 	PlayerCube.position.set(0,0,0);

// // 	// PlayerCube.addEventListener( 'collision', function( other_object, relative_velocity, relative_rotation, contact_normal ) {
// // 	// 	console.log("COLLISION");
// //  //    // `this` has collided with `other_object` with an impact speed of `relative_velocity` and a rotational force of `relative_rotation` and at normal `contact_normal`
// // 	// });

// // 	PlayerCube.addEventListener('collision', function(object) {
// //     console.log("Object " + this.id + " collided with " + object.id);
// //   });

// // 	// scene.add(PlayerCube)
// // 	// PlayerCube.position.set(0,0,0);

// var loader = new THREE.ColladaLoader();
// loader.load('../models/housetest.dae', function (result) {
// 	scene.add(result.scene);
// 	result.scene.scale.set(.8, .8, .6);
// 	result.scene.rotation.x = -90 * Math.PI/180;
// 	result.scene.position.x += -250;
// 	result.scene.position.z += -200;
// });

// // 	//controls
// // 	controls = new THREE.PointerLockControls( camera );
// // 	scene.add( controls.getObject() );
// // 	camera.position.set(0,10,0);

// // 	var geometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
// // 	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

// // 	material = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

// // 	mesh = new THREE.Mesh( geometry, material );
// // 	//mesh.rotation.y = Math.PI/2;
// // 	scene.add( mesh );

// // 	var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
// // 	light.position.set( 0.5, 1, 0.75 );
// // 	scene.add( light );

// // 	var light = new THREE.SpotLight(0xffffff, 1);
// // 	light.position.set( 0, 50, 0);
// // 	scene.add(light);


// // 	// Add axes
// // 	axes = buildAxes( 1000 );
// // 	scene.add( axes );

// // 	// Add ADDS
// // 	buildADDS();

// // 	// Fence
// // 	ground_material = Physijs.createMaterial(
// // 		new THREE.MeshLambertMaterial({map:boxText, shading: THREE.FlatShading}),
// // 		.8, // high friction
// // 		.4 // low restitution
// // 	);
// // 	ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
// // 	ground_material.map.repeat.set( 3, 3 );

// // 	// Ground
// // 	ground = new Physijs.BoxMesh(
// // 		new THREE.CubeGeometry(193, 40, 2),
// // 		ground_material,
// // 		0 // mass
// // 	);
// // 	ground.receiveShadow = true;
// // 	scene.add( ground );
// // 	ground.position.x = -150;
// // 	ground.position.z = -235;
// // 	ground.position.y = 20;

// // 	// left fence
// // 	// geometry = new THREE.CubeGeometry(193,40,2);
// // 	// material = new THREE.MeshLambertMaterial({map:boxText, shading: THREE.FlatShading});
// // 	// meshLeft = new THREE.Mesh(geometry,material);
// // 	// meshLeft.receiveShadow = true;
// // 	// meshLeft.castShadow = true;
// // 	// scene.add(meshLeft);
// // 	// collidableMeshList.push(meshLeft);
// // 	// meshLeft.position.x = -150;
// // 	// meshLeft.position.z = -235;
// // 	// meshLeft.position.y = 20;



// // 	renderer = new THREE.WebGLRenderer({clearAlpha: 1});
// // 	renderer.setClearColor( 0x000000 );
// // 	renderer.setSize( window.innerWidth, window.innerHeight );
// // 	renderer.shadowMapSoft = true;
// // 	document.body.appendChild( renderer.domElement );

// // 	window.addEventListener( 'resize', onWindowResize, false );

// // 	animate();
// // }

// function buildAxes( length ) {
// 	var axes = new THREE.Object3D();
// 	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( length, 0, 0 ), 0xFF0000, false ) ); // +X
// 	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( -length, 0, 0 ), 0xFF0000, true) ); // -X
// 	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, length, 0 ), 0x00FF00, false ) ); // +Y
// 	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, -length, 0 ), 0x00FF00, true ) ); // -Y
// 	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, length ), 0x0000FF, false ) ); // +Z
// 	axes.add( buildAxis( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, -length ), 0x0000FF, true ) ); // -Z
// 	return axes;
// }

// function buildAxis( src, dst, colorHex, dashed ) {
// 	var geom = new THREE.Geometry(),
// 	mat;
// 	if(dashed) {
// 		mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
// 	} else {
// 		mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
// 	}
// 	geom.vertices.push( src.clone() );
// 	geom.vertices.push( dst.clone() );
// 	geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines
// 	var axis = new THREE.Line( geom, mat, THREE.LinePieces );
// 	return axis;
// }

// function buildADDS() {
// 	//ADDS Data Sculpture
// 	var i = 0;
// 	for(var x = 20; x < 400; x += 20) {
// 		var j = 0;
// 		cubes[i] = new Array();
// 		for(var y = 0; y < 60; y += 2) {
// 			var geometry = new THREE.CubeGeometry(1.5, 1.5, 1.5);

// 			var material = new THREE.MeshPhongMaterial({
// 				color: randomFairColor(),
// 				ambient: 0x808080,
// 				specular: 0xffffff,
// 				shininess: 20,
// 				reflectivity: 5.5 
// 			});

// 			cubes[i][j] = new THREE.Mesh(geometry, material);
// 			cubes[i][j].position = new THREE.Vector3(x-100, y, -400);
// 			cubes[i][j].rotation.y = Math.PI/2;

// 			scene.add(cubes[i][j]);
// 			j++;
// 		}
// 		i++;
// 	}
// }

// function onWindowResize() {

// 	camera.aspect = window.innerWidth / window.innerHeight;
// 	camera.updateProjectionMatrix();

// 	renderer.setSize( window.innerWidth, window.innerHeight );
// }

// function animate_sound() {
	
// 	if(typeof array === 'object' && array.length > 0) {
// 		var k = 0;
// 		for(var i = 0; i < cubes.length; i++) {
// 			for(var j = 0; j < cubes[i].length; j++) {
// 				var scale = (array[k] + boost) / 30;
// 				cubes[i][j].scale.z = (scale < 1 ? 1 : scale);
// 				k += (k < array.length ? 1 : 0);
// 			}
// 		}
// 	}
// }

// // 	// charposition = controls.getObject().position;
// // 	// console.log(charposition);
// // 	update();

// // 	requestAnimationFrame( animate );
// // 	renderer.render( scene, camera );
// // }
// function randomFairColor() {
// 	var min = 64;
// 	var max = 224;
// 	var r = (Math.floor(Math.random() * (max - min + 1)) + min) * 65536;
// 	var g = (Math.floor(Math.random() * (max - min + 1)) + min) * 256;
// 	var b = (Math.floor(Math.random() * (max - min + 1)) + min);
// 	return r + g + b;
// }

// // // function lockDirection() {
// // // 	if (controls.moveForward()) {
// // // 		controls.lockMoveForward(true);
// // // 	}
// // // 	else if (controls.moveBackward()) {
// // // 		controls.lockMoveBackward(true);
// // // 	}
// // // 	else if (controls.moveLeft()) {
// // // 		controls.lockMoveLeft(true);
// // // 		// controls.getObject().onKeyDown(65);
// // // 	}
// // // 	else if (controls.moveRight()) {
// // // 		controls.lockMoveRight(true);
// // // 		// for (var i = 0; i < 10000; i++) {
// // // 			// controls.getObject().onKeyDown(83);
// // // 		// }
// // // 	}
// // // 	else {
// // // 		unlockAllDirection();
// // // 	}
// // // }
// // // 
// // // function unlockAllDirection(){
// // // 	controls.lockMoveForward(false);
// // // 	controls.lockMoveBackward(false);
// // // 	controls.lockMoveLeft(false);
// // // 	controls.lockMoveRight(false);
// // // }

// // function update()
// // 	{
// // 	// unlockAllDirection();

// // 	// collision detection:
// // 	//   determines if any of the rays from the cube's origin to each vertex
// // 	//		intersects any face of a mesh in the array of target meshes
// // 	//   for increased collision accuracy, add more vertices to the cube;
// // 	//		for example, new THREE.CubeGeometry( 64, 64, 64, 8, 8, 8, wireMaterial )
// // 	//   HOWEVER: when the origin of the ray is within the target mesh, collisions do not occur
// // 	PlayerCube.position.set(controls.getObject().position.x, 0, controls.getObject().position.z);
// // 	// var originPoint = PlayerCube.position.clone();
// // 	// var collided = false;

// // 	// for (var vertexIndex = 0; vertexIndex < PlayerCube.geometry.vertices.length; vertexIndex++)
// // 	// {		
// // 	// 	var localVertex = PlayerCube.geometry.vertices[vertexIndex].clone();
// // 	// 	var globalVertex = localVertex.applyMatrix4( PlayerCube.matrix );
// // 	// 	var directionVector = globalVertex.sub( PlayerCube.position );

// // 	// 	var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
// // 	// 	var collisionResults = ray.intersectObjects( collidableMeshList );
// // 	// 	if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() + 20)
// // 	// 		controls.getObject().position.set(charposition.x, charposition.y, charposition.z);
// // 	// }	

// // 	controls.update();
// // }