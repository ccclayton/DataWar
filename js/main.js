//------------LATEST REVISION:

var renderer, scene, camera, cube1, cube2, directionalLight, water;
var composer2, finalComposer;
var geometry, material, mesh, fence, cube1, cube2, ground, PlayerCube, yawObject;
var controls;
var materials = [];
var waterNormals;
var effect;
var clock = new THREE.Clock();

var curdate = "Wed, 18 Oct 2000 13:00:00 EST";
var dt = Date.parse(curdate);
var currTweetArray = [];
var graph;


var tweetStructure;
var maxTweets = config.tweets.maxTweets || 110;
var tweetSpawnTimeout;

var worldSize = 10000;

var pointCloud = null;
var pointCloud2 = null;
var lineTrace = null;

var VIEW_ANGLE = 75;
var ASPECT = window.innerWidth/window.innerHeight;
var NEAR = 1;
var FAR = 100000;

var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

window.heads = new Array();
window.pyramid = null;

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
    
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
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
    yawObject.position.set(config.user.position.x,config.user.position.y,config.user.position.z);
    // window.PlayerCube = pitchObject;
    //yawObject.addEventListener('collision', function (object) {
    //    //console.log("Object " + this.id + " collided with " + object.id);
    //    //if (object.id == fence.id) {
    //    //    //console.log("PLAYER HIT WALL");
    //    //}
    //});

    initSkybox();



    initObjects();

    //buildAxes(1000);

    renderer = new THREE.WebGLRenderer({clearAlpha: 1});
    renderer.setClearColor(0x000000);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.shadowMapSoft = true;
    document.body.appendChild(renderer.domElement);

    
        //controls
        controls = new THREE.PointerLockControls(yawObject, camera);
        scene.add(controls.getObject());
        // console.log("Player cube: " + PlayerCube.id);

    //else{
       // controls = new THREE.FirstPersonControls( camera );
       // controls.movementSpeed = 20000;
      //  controls.lookSpeed = 3.0;
        //controls.lookVertical = true;
    //}
    camera.position.set(0, 10, 0);


    initWater();

    var options = {Layout: "3d",scene: this.scene};
    graph = new Graph(options);
    graph.layout = new Layout.ForceDirected(graph, {width:config.tweets.width, repulsion:config.tweets.repulsion});
    tweetStructure = new TweetStructure(graph); //Create tweet graph

    grabTweets();

    //----------------------------------------------------------------------------------------------------------------------
    //createTweet(); //Creates Twitter Structure Graph.
    //----------------------------------------------------------------------------------------------------------------------

    pointCloud = new PointCloud(scene);
    pointCloud.uniforms.color.value = new THREE.Color(0xFFFFFF);


    pointCloud2 = new PointCloud(scene);

    lineTrace = new LineTrace(scene);
    pointCloud2.maxParticles = 50000;
    pointCloud2.fieldSize = worldSize;

    pointCloud2.addBatch(20000);

    init_keys(renderer.domElement);

    //read kinect data / build skeleton
    var bSkeleton = true;
    window.Kinect=connectKinect(bSkeleton);


    window.addEventListener('resize', onWindowResize, false);
    console.log("Val of OC before init of Oculus: "+ oculusController);

    initOculus(renderer,camera);
    //if(oculusController) {
     //   initOculus(renderer, camera);
    //}
}

function initOculus(renderer,camera){
    //controls = null;
    //scene.remove(controls.getObject());
    if(oculusController) {
        controls = new THREE.FirstPersonControls(camera);
        controls.movementSpeed = 20000;
        controls.lookSpeed = 3.0;
        camera.position.set(config.user.position.x,config.user.position.y,config.user.position.z);
    }

        effect = new THREE.OculusRiftEffect(renderer, {worldScale: 1});
        effect.setSize(window.innerWidth, window.innerHeight);
        oculusControls = new THREE.OculusControls(camera);
        oculusControls.connect();

    //animate();
}

function initSkybox() {
    var prefix = "images/nebula-";
    var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    var imageSuffix = ".png";
    
    var urls = [];
    for (var i = 0; i < 6; i++)
        urls.push( prefix + directions[i] + imageSuffix );

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

    var grow = 25;
    var skyMesh = new THREE.Mesh(
        new THREE.BoxGeometry(worldSize+grow, worldSize+grow, worldSize+grow),
        skyMaterial
    );
    scene.add(skyMesh);

    // background stars
    var skyboxGeometry = new THREE.BoxGeometry(worldSize, worldSize, worldSize);
    var skyboxMaterial = new THREE.MeshBasicMaterial({transparent:true, opacity:0.25, map: THREE.ImageUtils.loadTexture('/textures/stars/bsg-stars.png')});
    skyboxMaterial.side = THREE.BackSide;
    // side: THREE.BackSide
    var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);
}

function makeMoon() {
    var customMaterialAtmosphere = new THREE.ShaderMaterial( 
    {
        uniforms:       
        { 
            "c":   { type: "f", value: 0.5 },
            "p":   { type: "f", value: 4.0 }
        },
        vertexShader:   document.getElementById( 'vertexShaderAtmosphere'   ).textContent,
        fragmentShader: document.getElementById( 'fragmentShaderAtmosphere' ).textContent
    }   );

    var sphereGeo = new THREE.SphereGeometry(100, 32, 16);
    
    var moonTexture = THREE.ImageUtils.loadTexture( 'images/moon.jpg' );
    var moonMaterial = new THREE.MeshBasicMaterial( {
        map: moonTexture,
        transparent:true,
        opacity:0.7 } );
    var moon = new THREE.Mesh(sphereGeo, moonMaterial);
    scene.add(moon);
    
    moon.position.set(0,900,0);

}

function drawGrid() {

        var numAreas = 2;


        var l2rGeometry = new THREE.Geometry();
        l2rGeometry.vertices.push(new THREE.Vector3(-worldSize/2, 0.25, 0));
        l2rGeometry.vertices.push(new THREE.Vector3(worldSize/2, 0.25, 0));

        var f2bGeometry = new THREE.Geometry();
        f2bGeometry.vertices.push(new THREE.Vector3(0, 0.25, -worldSize/2));
        f2bGeometry.vertices.push(new THREE.Vector3(0, 0.25, worldSize/2));

        var material = new THREE.LineBasicMaterial({
            transparent:true,
            color: 0xFF0000,
            opacity: 0.95
        });

        for (var i=1; i<numAreas; i++) {
            var lineLR = new THREE.Line(l2rGeometry, material);
            lineLR.position.z = (i*(worldSize/numAreas))-worldSize/2;
            scene.add(lineLR);

            var lineFB = new THREE.Line(f2bGeometry, material);
            lineFB.position.x = (i*(worldSize/numAreas))-worldSize/2;
            scene.add(lineFB);
        }

    }

function pyramidLoaded(obj, params){
    obj.rotation.x = params.rotation;
    obj.scale.x = obj.scale.y = obj.scale.z = params.scale;
    obj.position.copy(params.position.clone());

    window.pyramid = obj;
    scene.add(obj);
};

function headLoaded(obj, params){
    obj.rotation.x = params.rotation;
    obj.scale.x = obj.scale.y = obj.scale.z = params.scale;
    obj.position.copy(params.position.clone());

    window.heads.push(obj);
    scene.add(obj);
};

function showHeads () {
    scene.remove(window.pyramid);
    modelLoader(['/3dModels/danny/model_mesh.obj', '/3dModels/danny/model_mesh.obj.mtl'], this.headLoaded,  {rotation:0, scale:2000, position:new THREE.Vector3(-500,0,0)});
    modelLoader(['/3dModels/colin/model_mesh.obj', '/3dModels/colin/model_mesh.obj.mtl'], this.headLoaded,  {rotation:0, scale:2000, position:new THREE.Vector3(500,-110,0)});
    modelLoader(['/3dModels/travis/model_mesh.obj', '/3dModels/travis/model_mesh.obj.mtl'], this.headLoaded,  {rotation:0, scale:2000, position:new THREE.Vector3(-1400,-60,0)});
    modelLoader(['/3dModels/wei/model_mesh.obj', '/3dModels/wei/model_mesh.obj.mtl'], this.headLoaded,  {rotation:0, scale:2000, position:new THREE.Vector3(1400,-110,0)});
}

function initObjects() {
    modelLoader(['/3dModels/pyramid.stl'], this.pyramidLoaded, {rotation:-Math.PI/2, scale:8.25, position:new THREE.Vector3(0,0,0)});    
    makeMoon();
    drawGrid();

    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 900, 0));

    var beam = new THREE.Mesh(new THREE.CylinderGeometry(25, 25, 2000, 50, 50, true), new THREE.MeshPhongMaterial({
        transparent:true,
        opacity: 0.25,
        color:0xFFFFFF,
        uniforms:       
        { 
            "c":   { type: "f", value: 0.54 },
            "p":   { type: "f", value: 6.0 }
        },
        vertexShader:   document.getElementById( 'vertexShaderAtmosphere'   ).textContent,
        fragmentShader: document.getElementById( 'fragmentShaderAtmosphere' ).textContent//,
        //side: THREE.BothSides
    }));
    scene.add(beam);
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
        sunColor: 0xd1f8ff,
        waterColor: 0x001e0f,
        distortionScale: 20.0

    });
    //alert(water.geometry);

    mirrorMesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(worldSize, worldSize, 50, 50),
        water.material
    );


    mirrorMesh.add(water);
    mirrorMesh.rotation.x = (-Math.PI * 0.5);
    scene.add(mirrorMesh);

    // Ground
    ground_material = Physijs.createMaterial(
        new THREE.MeshLambertMaterial(),
        .8, // high friction
        0.1 // low restitution
    );
    //ground_material.map.wrapS = ground_material.map.wrapT = THREE.RepeatWrapping;
    //ground_material.map.repeat.set(10, 10);

    ground = new Physijs.BoxMesh(
        new THREE.BoxGeometry(worldSize, 1, worldSize),
        ground_material,
        0 // mass
    );
    ground.receiveShadow = true;
    ground.position.setY(-1);
    scene.add(ground);
}

function initLights() {
    var light = new THREE.HemisphereLight(0xd1f8ff, 0x777788, 0.5);
    // light.position.set(0.5, 1, 0.75);
    scene.add(light);

    // // var light = new THREE.SpotLight(0xffffff, 1);
    // // light.position.set(0, 50, 0);
    // // scene.add(light);

    // directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    // directionalLight.position.set(-1, 0.4, -1);
    // scene.add(directionalLight);

    // LIGHT
    directionalLight = new THREE.PointLight(0xd1f8ff);
    directionalLight.position.set(0,500,500);
    scene.add(directionalLight);
}

function grabTweets() {

    setTimeout(grabTweets, config.tweets.pollTime);
    //console.log("Getting tweets...");
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
    tweetSpawnTimeout = setTimeout(function() {createTweet()}, config.tweets.spawnTime);
    //Twitter Structure
    //Creates a panel that shows the tweet's original author.''
   // console.log(graph.layout);

    if (currTweetArray.length != 0) {
        //var numTweets = tweetArray.length;
        //var timePer = 50000 / numTweets;

        //setTimeout(tweetStructure.drawGraph(tweetArray)
        if (graph.nodes.length < maxTweets) {
            // tweetStructure.drawTweet(currTweetArray.pop());
            tweetStructure.drawTweet(currTweetArray.pop());
            graph.layout.init({iterations: 10000});
        }
    }
}

function animate() {
    requestAnimationFrame(animate);

    //oculusControls.update( );//oculusControls

    //oculusControls.update(clock.getDelta());
    pointCloud2.update();
    tweetStructure.render();
    water.material.uniforms.time.value += 1.0 / 60.0;


    controls.update(0.0002 );

    if(oculusController) {
        //controls.update(0.0002 );
        oculusControls.update(0.000002);
        effect.render(scene, camera);

    }

    // debugger
    if(skeleton.children.length != 0){
        skeleton.position.copy(yawObject.position.clone());
        skeleton.setRotationFromEuler(yawObject.rotation);
    }
    scene.simulate(); // run physics
    water.render();
  
    if (window.heads.length > 0) {
        for (var i=0; i<window.heads.length; i++) {
            window.heads[i].lookAt(yawObject.position);
        }
    }

    if (yawObject.position.y < -5000) {
        // yawObject.position.y = 10;
        showHeads();
        yawObject.position.copy(config.user.position);
        yawObject.setLinearVelocity(new THREE.Vector3(0,0,0));
        yawObject.__dirtyPosition = true;
    }
    if(!oculusController){
        renderer.render(scene,camera);
    }


    //render();
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
    if(oculusControls) {
        effect.setSize(window.innerWidth, window.innerHeight); //resizes oculus effect appropriately
        
    }
    else{
        renderer.setSize( window.innerWidth, window.innerHeight );
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


// Temporary Random Color Generator for temp data sculpture. http://srchea.com/experimenting-with-web-audio-api-three-js-webgl
function randomFairColor() {
    var min = 64;
    var max = 224;
    var r = (Math.floor(Math.random() * (max - min + 1)) + min) * 65536;
    var g = (Math.floor(Math.random() * (max - min + 1)) + min) * 256;
    var b = (Math.floor(Math.random() * (max - min + 1)) + min);
    return r + g + b;
}

function resetScene() {

    //reset user to home position
    yawObject.position.set(config.user.position.x,config.user.position.y,config.user.position.z);
    // camera.lookAt(new THREE.Vector3(0, 0, 0));

    //stop music
    stop();

    //remove tweets
    clearTimeout(tweetSpawnTimeout);

    graph.layout.stop_calculating();

    for (var i = graph.nodes.length-1; i >= 0; i--) {
        var node = graph.nodes.pop();
        // console.log(node);
        scene.remove(node.mesh);
    }

    for (var i = tweetStructure.tweetsInScene.length-1; i >= 0; i--) {
        var node = tweetStructure.tweetsInScene.pop();
        // console.log(node);
        scene.remove(node.mesh);
    }

    graph.removeAllEdges();

    //hide particles
    for (var i = pointCloud2.values_size.length; i >= 0; i--) {
        pointCloud2.values_size[i] = 0;
    }


    // graph = new Graph({Layout: "3d",scene: this.scene});
    // graph.layout = new Layout.ForceDirected(graph);
    // tweetStructure = new TweetStructure(graph);
    // createTweet();
}

