//------------LATEST REVISION:

var renderer, scene, camera, cube1, cube2, directionalLight, water;

var geometry, material, mesh, fence, cube1, cube2, ground, PlayerCube, yawObject;
var controls;
var materials = [];
var boxText = new THREE.ImageUtils.loadTexture('../textures/wood_texture.jpg');
var cubes = new Array();
var waterNormals;

//From Three.js ocean example that is included with the library.
var parameters = {
	width: 2000,
	height: 2000,
	widthSegments: 250,
	heightSegments: 250,
	depth: 1500,
	param: 4,
	filterparam: 1
};	



init();
animate();


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


 camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 100000 );
 camera.position.z = 100;
 scene.add(camera);

 directionalLight = new THREE.DirectionalLight( 0xffff55, 1 );
 directionalLight.position.set( - 1, 0.4, - 1 );
 scene.add( directionalLight );

 waterNormals = new THREE.ImageUtils.loadTexture( '../threejs.r65/examples/textures/waternormals.jpg' );
 waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 


	// var playerCubeMaterial = Physijs.createMaterial(
	// 	new THREE.MeshLambertMaterial({map:boxText, shading: THREE.FlatShading}),
	// 	0.2, //friction
	// 	0.1  //bounceness
	// 	);
	// playerCubeMaterial.map.wrapS = playerCubeMaterial.map.wrapT = THREE.RepeatWrapping;
	// playerCubeMaterial.visible = false;

	// yawObject = new Physijs.SphereMesh(
	// 	new THREE.SphereGeometry(10),
	// 	playerCubeMaterial,
	// 	0
	// 	);

yawObject = new Physijs.BoxMesh(
	new THREE.CubeGeometry(20, 10, 20),
	Physijs.createMaterial(
		new THREE.MeshNormalMaterial(), 
		1, 
		0
		),
	1000
	);
yawObject.visible = false;
scene.add(yawObject);
yawObject.position.set(0,10,150);
	// window.PlayerCube = pitchObject;
	yawObject.addEventListener('collision', function(object) {
		console.log("Object " + this.id + " collided with " + object.id);
		if (object.id == fence.id) {
			console.log("PLAYER HIT WALL");
		}
	});

	 // var playerCubeMaterial = Physijs.createMaterial(
	 // 	new THREE.MeshLambertMaterial({map:boxText, shading: THREE.FlatShading}),
	 // 	0.2,
	 // 	0.1 
	 // 	);
	 // playerCubeMaterial.map.wrapS = playerCubeMaterial.map.wrapT = THREE.RepeatWrapping;
	 // playerCubeMaterial.visible = false;

	 // PlayerCube = new Physijs.SphereMesh(
	 // 	new THREE.SphereGeometry(10),
	 // 	playerCubeMaterial,
	 // 	0
	 // 	);


	 // scene.add(PlayerCube)
	 // PlayerCube.position.set(-50,0,-70);
// ------------------------------------------------------------------------------
	 //SETTING UP AND ADDING SKYBOX TO SCENE
	 var prefix = "../textures/stars/";
	 var urls = [ prefix + "stars_back.jpg", prefix + "stars_front.jpg",
	 prefix + "stars_top.jpg", prefix + "stars_top.jpg",
	 prefix + "stars_left.jpg", prefix + "stars_right.jpg" ];
	 var skybox = THREE.ImageUtils.loadTextureCube(urls); // load textures
	 skybox.format = THREE.RGBFormat;
	 var shader = THREE.ShaderLib['cube']; 
	 shader.uniforms['tCube'].value = skybox; 

	 	//Uses the built in THREE.js fragment and vertex shaders.
	 	var skyMaterial = new THREE.ShaderMaterial( {
	 		fragmentShader: shader.fragmentShader,
	 		vertexShader: shader.vertexShader,
	 		uniforms: shader.uniforms,
	 		depthWrite: false,
	 		side: THREE.BackSide
	 	});


	 	var skyMesh = new THREE.Mesh(
	 		new THREE.CubeGeometry(20000, 20000, 2000),
	 		skyMaterial
	 		);

	 	scene.add(skyMesh);



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



 	//controls
 	controls = new THREE.PointerLockControls(yawObject, camera);
 	scene.add( controls.getObject() );
 	camera.position.set(0,10,0);
 	// console.log("Player cube: " + PlayerCube.id);

 	// Ground
 	ground_material = Physijs.createMaterial(
 		new THREE.MeshLambertMaterial({ map: THREE.ImageUtils.loadTexture( '../textures/brick.jpg' ) }),
			.8, // high friction
			0 // low restitution
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
 			new THREE.MeshLambertMaterial({map: boxText, shading: THREE.FlatShading}), 0.8, 0
 			),
 		1000000
 		);

 	scene.add(fence);
 	fence.position.x = -150;
 	fence.position.z = -235;
 	fence.position.y = 20;
 	fence.__dirtyPosition = true;

	// PlayerCube.addEventListener('collision', function(object) {
 // 		console.log("Object " + this.id + " collided with " + object.id);
 // 		if (object.id == fence.id) {
 // 			console.log("PLAYER HIT WALL");
 // 		}
 // 	});

var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
light.position.set( 0.5, 1, 0.75 );
scene.add( light );

var light = new THREE.SpotLight(0xffffff, 1);
light.position.set( 0, 50, 0);
scene.add(light);


	// Add axes 
	axes = buildAxes( 1000 );
	scene.add( axes );

	buildADDS();

	renderer = new THREE.WebGLRenderer({clearAlpha: 1});
	renderer.setClearColor( 0x000000 );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMapSoft = true;
	
	//WATER FROM OCEAN EXAMPLE THREEJS 65
	water = new THREE.Water( renderer, camera, scene, {
		textureWidth: 512, 
		textureHeight: 512,
		waterNormals: waterNormals,
		alpha: 	1.0,
		sunDirection: directionalLight.position.normalize(),
		sunColor: 0xffffff,
		waterColor: 0x001e0f,
		distortionScale: 10.0,
	} );



	mirrorMesh = new THREE.Mesh(
		new THREE.PlaneGeometry( parameters.width * 500, parameters.height * 500, 50, 50 ), 
		water.material
		);


	mirrorMesh.add( water );
	mirrorMesh.rotation.x = (- Math.PI * 0.5);
	scene.add( mirrorMesh );




//----------------------------------------------------------------------------------------------------------------------

	//Twitter Structure 
	////NEED TO SOMEHOW PIECE EVERY OBJECT CREATED INTO ONE STRUCTURE
	//Creates a panel that shows the tweet's original author.
	//
	var username = "colincclayton";
	var tweet = "This is a test tweet. Hello World!";
	//var authorPanel = CreateOriginalAuthor(scene,username); //Eventually pass in parsed usernames.  //might want to make class
	//var authorP = new THREE.Object3D(authorPanel);
	var tweetStructure = new TweetStructure(scene);
	var x = 0;
	var y = 0;
	var z = -40;
	
	
	//var base_Structure = 
	tweetStructure.constructBase(username, x,y, z ); //Create Base of Twitter Structure.
	//scene.add(base_Structure.getObject());

	//var tweet_Structure = 
	tweetStructure.CreateTweetPanel(tweet, x, y, z); //Create Tweet Panel
	//scene.add(tweet_Structure.getObject());
	//Create Connection Between Nodes
	//tweetStructure.CreateConnection(obj1, ob);
	
	
	//Make Tweet panel
	//var tweetPanel = CreateTweetPanel(scene,username,tweet);
	//var tweetP = new THREE.Object3D(tweetPanel);
	//Make connection between Author Panel and Tweet Panel
	//CreateConnection(scene,authorP,tweetP);


	
	
	


	


	
	




//----------------------------------------------------------------------------------------------------------------------

document.body.appendChild(renderer.domElement);
window.addEventListener( 'resize', onWindowResize, false );
}




function animate() {
	// mesh.__dirtyPosition = true;
	// yawObject.__dirtyPosition = true;
	// PlayerCube.__dirtyPosition = true;
	// PlayerCube.position.set(controls.getObject().position.x, controls.getObject().position.y/2, controls.getObject().position.z);
	water.material.uniforms.time.value += 1.0 / 60.0;
	controls.update();
	water.render();
	animate_sound();
	requestAnimationFrame(animate);

	// ground.__dirtyPosition = true;
	// fence.__dirtyPosition = true;
	// cube2.__dirtyPosition = true;
	// cube1.__dirtyPosition = true;

	scene.simulate(); // run physics
	render();
}

function render() {
	renderer.render(scene, camera);
}

	// Temporary for debugging while building virtual world. Borrowed from example: http://soledadpenades.com/articles/three-js-tutorials/drawing-the-coordinate-axes/
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
	//Temporary for debugging while building virtual world.
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

	//Temporary, from http://srchea.com/experimenting-with-web-audio-api-three-js-webgl tutorial.

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
	//Temporary Animation function for sound visualization: https://github.com/srchea/Sound-Visualizer.
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
// Temporary Random Color Generator for temp data sculpture. http://srchea.com/experimenting-with-web-audio-api-three-js-webgl
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