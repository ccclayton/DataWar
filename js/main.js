//------------LATEST REVISION:

var renderer, scene, camera, cube1, cube2, directionalLight, water;

var geometry, material, mesh, fence, cube1, cube2, ground, PlayerCube, yawObject;
var controls;
var materials = [];
var boxText = new THREE.ImageUtils.loadTexture('../textures/wood_texture.jpg');
var cubes = new Array();
var waterNormals;
var tweetStructure;
var curdate = "Wed, 18 Oct 2000 13:00:00 EST"
var dt = Date.parse(curdate)
console.log(dt);

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

var pointCloud = null;
var lineTrace = null;

init();
animate();


function init() {

    console.log("Beginning of Init..");
    Physijs.scripts.worker = '../Physijs/physijs_worker.js';
    Physijs.scripts.ammo = '../Physijs/examples/js/ammo.js';



    scene = new Physijs.Scene;
    scene.setGravity(
        new THREE.Vector3(0, -250, 0)
    );

    oscControl = new OscControl(scene);
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 100000);
    camera.position.z = 100;
    scene.add(camera);

    directionalLight = new THREE.DirectionalLight(0xffff55, 1);
    directionalLight.position.set(-1, 0.4, -1);
    scene.add(directionalLight);

    waterNormals = new THREE.ImageUtils.loadTexture('../threejs.r65/examples/textures/waternormals.jpg');
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;


    yawObject = new Physijs.BoxMesh(
        new THREE.CubeGeometry(50, 10, 50),
        Physijs.createMaterial(
            new THREE.MeshNormalMaterial(),
            0.2, //friction
            0.2 //restitution
        ),
        1000
    );
    yawObject.visible = false;
    scene.add(yawObject);
    yawObject.position.set(0, 10, 150);
    // window.PlayerCube = pitchObject;
    yawObject.addEventListener('collision', function (object) {
        console.log("Object " + this.id + " collided with " + object.id);
        if (object.id == fence.id) {
            console.log("PLAYER HIT WALL");
        }
    });


    // ------------------------------------------------------------------------------
    //SETTING UP AND ADDING SKYBOX TO SCENE
    var prefix = "../textures/stars/";
    var urls = [prefix + "stars_back.jpg", prefix + "stars_front.jpg",
        prefix + "stars_top.jpg", prefix + "stars_top.jpg",
        prefix + "stars_left.jpg", prefix + "stars_right.jpg"];
    var skybox = THREE.ImageUtils.loadTextureCube(urls); // load textures
    skybox.format = THREE.RGBFormat;
    var shader = THREE.ShaderLib['cube'];
    shader.uniforms['tCube'].value = skybox;

    //Uses the built in THREE.js fragment and vertex shaders.
    var skyMaterial = new THREE.ShaderMaterial({
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

    cube2.addEventListener('collision', function (object) {
        console.log("Object " + this.id + " collided with " + object.id);
    });


    //controls
    controls = new THREE.PointerLockControls(yawObject, camera);
    scene.add(controls.getObject());
    camera.position.set(0, 10, 0);
    // console.log("Player cube: " + PlayerCube.id);

    // Ground
    ground_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture('../textures/brick.jpg')}),
        .8, // high friction
        0.1 // low restitution
    );
    ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
    ground_material.map.repeat.set(10, 10);

    ground = new Physijs.BoxMesh(
        new THREE.CubeGeometry(100000, 1, 100000),
        ground_material,
        0 // mass
    );
    ground.receiveShadow = true;
    ground.position.setY(-1);
    scene.add(ground);

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



    var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    var light = new THREE.SpotLight(0xffffff, 1);
    light.position.set(0, 50, 0);
    scene.add(light);


    // Add axes
    axes = buildAxes(1000);
    scene.add(axes);

    buildADDS();

    renderer = new THREE.WebGLRenderer({clearAlpha: 1});
    renderer.setClearColor(0x000000);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapSoft = true;

    //WATER FROM OCEAN EXAMPLE THREEJS 65
    water = new THREE.Water(renderer, camera, scene, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: waterNormals,
        alpha: 1.0,
        sunDirection: directionalLight.position.normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 10.0
    });


    mirrorMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(parameters.width * 500, parameters.height * 500, 50, 50),
        water.material
    );


    mirrorMesh.add(water);
    mirrorMesh.rotation.x = (-Math.PI * 0.5);
    scene.add(mirrorMesh);

    grabTweets();

    //----------------------------------------------------------------------------------------------------------------------

    createGraph(null); //Creates Twitter Structure Graph.


    //----------------------------------------------------------------------------------------------------------------------


    pointCloud = new PointCloud(scene);
    lineTrace = new LineTrace(scene);
<<<<<<< HEAD
    //pointCloud.addInFrontOfCamera();


    pointCloud.addBatch();
=======

    pointCloud.addBatch();

>>>>>>> 3f928883b318d63142d3061e55b4c7e26c09cd9f
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
}

// AJAX REQUESTS
//function grabTweets() {
//    setTimeout(grabTweets, 5000);
//    var param = {date : dt};
//    $.get( '/api/tweets', param, function(data) {
//        if (data.tweets.length != 0) {
//            dt = Date.parse(data.tweets[data.tweets.length -1].created_at)
//            console.log(data.tweets.length);
//        }
//    });
//}
function grabTweets() {
  setTimeout(grabTweets, 5000);
    console.log(dt);
  console.log("Getting tweets...");
  var param = {date : dt};
  $.get( '/api/tweets', param, function(data) {
    if (data.tweets.length != 0) {
        //console.log(data.tweets[data.tweets.length -1].created_at)
      dt = Date.parse(data.tweets[data.tweets.length -1].created_at);
      // console.log(data.tweets.length);
      //console.log(dt);
      createGraph(data);
    }
  });
}

function createGraph(tweets){
    //Twitter Structure
    //Creates a panel that shows the tweet's original author.''

    tweetStructure = new TweetStructure({Layout: "3d",scene: this.scene}); //Create tweet graph


    if (tweets != null) {
        console.log(tweets);

        var tweetArray = tweets.tweets;

        //var numTweets = tweetArray.length;
        //var timePer = 50000 / numTweets;

        //setTimeout(tweetStructure.drawGraph(tweetArray)

        for (var i = 0; i < tweetArray.length; i++) {
            tweetStructure.drawGraph(tweetArray[i]);
        }
        //tweetStructure.makeConnections(tweetStructure.processUserNames(usernames),tweetStructure.processTweets(tweets));
        //tweetStructure.processUserNames(usernames,tweets);
       // tweetStructure.processTweets(tweets);


        //graph.add(edge);






        //var node = new TwitterNode(username,null,null,position,0); //username, geometry, position, mass.

        //node.draw(); //Overridden draw function
        //var node2 = new TwitterNode("wei",null,null,new THREE.Vector3(0,40,-40),0);
        //node2.draw(); //Overridden draw function


        //Create new tweetPanel to display tweet.
        //var tweetPanel = new TweetPanel(tweets[1],new THREE.Vector3( 20, 10, -80 ),0);
        //scene.add(tweetPanel);

        //var edge = new Edge(node,tweetPanel);
        //edge.draw();

        //var edge2 = new Edge(node2,tweetPanel);
        //edge2.draw();
    }





}




function animate() {
    requestAnimationFrame(animate);
    // mesh.__dirtyPosition = true;
    // yawObject.__dirtyPosition = true;
    // PlayerCube.__dirtyPosition = true;
    // PlayerCube.position.set(controls.getObject().position.x, controls.getObject().position.y/2, controls.getObject().position.z);
    //tweetStructure.render();
    animate_sound();
    tweetStructure.render();
    water.material.uniforms.time.value += 1.0 / 60.0;
    controls.update();
    scene.simulate(); // run physics
    water.render();
    //tweetStructure.render();
    //animate_sound();

    // ground.__dirtyPosition = true;
    // fence.__dirtyPosition = true;
    // cube2.__dirtyPosition = true;
    // cube1.__dirtyPosition = true;

    
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
        for(var i = 0; i < pointCloud.geometry.vertices.length; i++) {
                var random = Math.random()*100;
                var scale = (array[k] + boost) / 30; //Boost comes from audio.js file.
                if(random % 2 == 0){
                    pointCloud.geometry.vertices[i].y -= scale*0.1;
                }
            pointCloud.geometry.vertices[i].y += scale * 0.1;

                pointCloud.geometry.verticesNeedUpdate = true;
                k += (k < (array.length-1) ? 1 : 0);
            }

    }
}

//  // charposition = controls.getObject().position;
//  // console.log(charposition);
//  update();

//  requestAnimationFrame( animate );
//  renderer.render( scene, camera );
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

