//------------LATEST REVISION:

var renderer, scene, camera, cube1, cube2, directionalLight, water;

var geometry, material, mesh, fence, cube1, cube2, ground, PlayerCube, yawObject;
var controls;
var materials = [];
var boxText = new THREE.ImageUtils.loadTexture('../textures/wood_texture.jpg');
var cubes = new Array();
var waterNormals;
var tweetStructure;
var curdate = "Wed, 18 Oct 2000 13:00:00 EST";
var dt = Date.parse(curdate);
var currTweetArray = [];
var graph;
var tweetStructure;

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
var pointCloud2 = null;
var lineTrace = null;

init();
animate();


function init() {

    //console.log("Beginning of Init..");
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

    initLights();

    yawObject = new Physijs.BoxMesh(
        new THREE.BoxGeometry(50, 10, 50),
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
        //console.log("Object " + this.id + " collided with " + object.id);
        //if (object.id == fence.id) {
        //    //console.log("PLAYER HIT WALL");
        //}
    });

    initSkybox();

    //controls
    controls = new THREE.PointerLockControls(yawObject, camera);
    scene.add(controls.getObject());
    camera.position.set(0, 10, 0);
    // console.log("Player cube: " + PlayerCube.id);

    initObjects();

    //buildAxes(1000);

    renderer = new THREE.WebGLRenderer({clearAlpha: 1});
    renderer.setClearColor(0x000000);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapSoft = true;

    initWater();
    var options = {Layout: "3d",scene: this.scene};
    graph = new Graph(options);
    graph.layout = new Layout.ForceDirected(graph);
    tweetStructure = new TweetStructure(graph); //Create tweet graph

    grabTweets();

    //----------------------------------------------------------------------------------------------------------------------
    createTweet(); //Creates Twitter Structure Graph.
    //----------------------------------------------------------------------------------------------------------------------

    pointCloud = new PointCloud(scene);
    pointCloud.uniforms.color.value = new THREE.Color(0xFFFFFF);


    pointCloud2 = new PointCloud(scene);

    lineTrace = new LineTrace(scene);
    pointCloud2.maxParticles = 50000;

    pointCloud2.addBatch();

    //read kinect data / build skeleton
    var bSkeleton = true;
    window.Kinect=connectKinect(bSkeleton);

    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
}

function initSkybox() {
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
        new THREE.BoxGeometry(20000, 20000, 2000),
        skyMaterial
    );

    scene.add(skyMesh);
}

function modelLoaded(obj, scope){
    
    obj.rotation.x = -Math.PI/2;
    obj.scale.x = obj.scale.y = obj.scale.z = 8;

    scene.add(obj);

    // if (scope.personObj.position !== scope.targetPos) {
    //  scope.moveTween(scope.targetPos, scope.duration);
    // }
};

function initObjects() {
    modelLoader(['/3dModels/pyramid.stl'], this.modelLoaded, this);
    
    // Ground
    ground_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial(),
        .8, // high friction
        0.1 // low restitution
    );
    //ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
    //ground_material.map.repeat.set(10, 10);

    ground = new Physijs.BoxMesh(
        new THREE.BoxGeometry(256000, 1, 256000),
        ground_material,
        0 // mass
    );
    ground.receiveShadow = true;
    ground.position.setY(-1);
    scene.add(ground);

    // fence = new Physijs.BoxMesh(
    //     new THREE.BoxGeometry(193, 40, 2),
    //     Physijs.createMaterial(
    //         new THREE.MeshLambertMaterial({map: boxText, shading: THREE.FlatShading}), 0.8, 0
    //     ),
    //     1000000
    // );

    // scene.add(fence);
    // fence.position.x = -150;
    // fence.position.z = -235;
    // fence.position.y = 20;
    // fence.__dirtyPosition = true;
}

function initWater() {
    waterNormals = new THREE.ImageUtils.loadTexture('../threejs.r65/examples/textures/waternormals.jpg');
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

    //WATER FROM OCEAN EXAMPLE THREEJS 65
    water = new THREE.Water(renderer, camera, scene, {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: waterNormals,
        alpha: 1.0,
        sunDirection: directionalLight.position.normalize(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 20.0

    });
    //alert(water.geometry);


    mirrorMesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(parameters.width * 500, parameters.height * 500, 50, 50),
        water.material
    );


    mirrorMesh.add(water);
    mirrorMesh.rotation.x = (-Math.PI * 0.5);
    scene.add(mirrorMesh);
}

function initLights() {
    var light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    //var light = new THREE.SpotLight(0xffffff, 1);
    //light.position.set(0, 50, 0);
    //scene.add(light);

    directionalLight = new THREE.DirectionalLight(0xffff55, 1);
    directionalLight.position.set(-1, 0.4, -1);
    scene.add(directionalLight);
}

function grabTweets() {

    setTimeout(grabTweets, 50000);
    console.log("Getting tweets...");
    var param = {date : dt};
    $.get( '/api/tweets', param, function(data) {
        if (data.tweets.length != 0) {
            //console.log(data.tweets[data.tweets.length -1].created_at)
            dt = Date.parse(data.tweets[data.tweets.length -1].created_at);
            // console.log(data.tweets.length);
            //console.log(dt);
            currTweetArray = currTweetArray.concat(data.tweets);
            // console.log(currTweetArray);
            //createGraph(data);
        }
    });
}

function createTweet(){
    setTimeout(function() {createTweet()}, 6000);
    //Twitter Structure
    //Creates a panel that shows the tweet's original author.''
   // console.log(graph.layout);

    if (currTweetArray.length != 0) {
        //var numTweets = tweetArray.length;
        //var timePer = 50000 / numTweets;

        //setTimeout(tweetStructure.drawGraph(tweetArray)
        if (graph.nodes.length < 110) {
            tweetStructure.drawTweet(currTweetArray.pop());
            tweetStructure.drawTweet(currTweetArray.pop());
            graph.layout.init({iterations: 10000});
        }
    }
}

function animate() {
    requestAnimationFrame(animate);
    // mesh.__dirtyPosition = true;
    // yawObject.__dirtyPosition = true;
    // PlayerCube.__dirtyPosition = true;
    // PlayerCube.position.set(controls.getObject().position.x, controls.getObject().position.y/2, controls.getObject().position.z);
    //tweetStructure.render();
    //animate_sound();
    pointCloud2.updateGrid();  //TODO: Change Movement. Pass to Shader.
    //pointCloud2.updateLinear();
    tweetStructure.render();
    water.material.uniforms.time.value += 1.0 / 60.0;
    controls.update();
    // debugger
    if(skeleton.children.length != 0){
        skeleton.position.copy(yawObject.position.clone());
        skeleton.setRotationFromEuler(yawObject.rotation);
    }
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
    scene.add(axes);
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



function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}
//Temporary Animation function for sound visualization: https://github.com/srchea/Sound-Visualizer.
function animate_sound() {
    //if(binaries invalid return);
    //
    //for(var i=0; i<pointCloud.vertices.length; i++){
    //    var pos = get partible position;
    //    var idx = round(scale_move(pos.y)/100) * 16 + round(scale_move(pos.y));
    //    //get index from 0 to 255
    //
    //    var val = binaries[idx];
    //    var color = get_color(val);
    //    apply color to pointCloud.attributes.color[i];
    //    var desired y = get_y(val, current pos.y);
    //    apply y to pointCloud.vertices[i];
    //
    //}
    //
    //
    //if (typeof binaries === 'object' && binaries.length - 1 > 0) {
    //    var k = 0;
    //    var diff = 0;
    //    for (var i = 0; i < pointCloud2.geometry.vertices.length - 1; i++) {
    //        //
    //        //var scale = (binaries[i] + boost) / 30; //Boost comes from audio.js file.
    //        if (binaries[i] > 0 && binaries[i] <= 50) {
    //            pointCloud2.changeColor(i, '#FF0000'); //Red
    //            pointCloud2.frequencyRange = 50;
    //        }
    //        else if (binaries[i] > 50 && binaries[i] <= 100) {
    //            pointCloud2.changeColor(i, '#66CCFF');  // Light Blue
    //            pointCloud2.frequencyRange = 100;
    //        }
    //        else if (binaries[i] > 100 && binaries[i] <= 150) {
    //            pointCloud2.changeColor(i, '#47B247');  //Green
    //            pointCloud2.frequencyRange = 150;
    //        }
    //        else if (binaries[i] > 150 && binaries[i] <= 200) {
    //            pointCloud2.changeColor(i, '#FF9900');   //Orange
    //            pointCloud2.frequencyRange = 200;
    //        }
    //        else if (binaries[i] > 200 && binaries[i] <= 250) {
    //            pointCloud2.changeColor(i, '#EEEEEE');  //White
    //            pointCloud2.frequencyRange = 250;
    //        }
    //        else if (binaries[i] > 250 && binaries[i] <= 300) {
    //            pointCloud2.changeColor(i, '#CC66FF'); //Light Purple
    //            pointCloud2.frequencyRange = 300;
    //        }
    //        else {
    //            pointCloud2.changeColor(i, '#000000'); //000000
    //            pointCloud2.frequencyRange = 0;
    //        }
    //
    //
    //        pointCloud2.geometry.verticesNeedUpdate = true;
    //
    //
    //        //water.waterColor.setRGB(0,Math.random() * 20,Math.random()* 20);
    //        //water.distortionScale += 0.1;
    //
    //
    //        //TODO: USE 2 POINT CLOUDS. One to follow camera movement. One to span the space (and update color and position with sound)
    //
    //
    //    }
    //}
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

// Temporary Random Color Generator for temp data sculpture. http://srchea.com/experimenting-with-web-audio-api-three-js-webgl
function randomFairColor() {
    var min = 64;
    var max = 224;
    var r = (Math.floor(Math.random() * (max - min + 1)) + min) * 65536;
    var g = (Math.floor(Math.random() * (max - min + 1)) + min) * 256;
    var b = (Math.floor(Math.random() * (max - min + 1)) + min);
    return r + g + b;
}
