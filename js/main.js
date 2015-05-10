//------------LATEST REVISION:

var renderer, scene, camera, cube1, cube2, directionalLight, water;
var composer2, finalComposer;
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

var worldSize = 10000;

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

var VIEW_ANGLE = 75;
var ASPECT = window.innerWidth/window.innerHeight;
var NEAR = 1;
var FAR = 100000;

var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

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
    yawObject.position.set(0, 10, 650);
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
    pointCloud2.fieldSize = worldSize*0.75;

    pointCloud2.addBatch(2000);

    //read kinect data / build skeleton
    var bSkeleton = true;
    window.Kinect=connectKinect(bSkeleton);

    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
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
    var skyboxGeometry = new THREE.CubeGeometry(worldSize, worldSize, worldSize);
    var skyboxMaterial = new THREE.MeshBasicMaterial({transparent:true, opacity:0.80, map: THREE.ImageUtils.loadTexture('/textures/stars/bsg-stars.png'), side: THREE.BackSide });
    var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);
}

function modelLoaded(obj){
    obj.rotation.x = -Math.PI/2;
    obj.scale.x = obj.scale.y = obj.scale.z = 8.25;

    scene.add(obj);
};

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
        opacity:0.7, } );
    var moon = new THREE.Mesh(sphereGeo, moonMaterial);
    scene.add(moon);
    
    moon.position.set(0,900,0);

    // create secondary scene to add atmosphere effect
    
    // atmosphereScene = new THREE.Scene();
    
    // camera2 = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    // camera2.position = camera.position;
    // camera2.rotation = camera.rotation; 
    // atmosphereScene.add( camera2 );
    
    // var mesh = new THREE.Mesh( sphereGeo.clone(), customMaterialAtmosphere );
    // mesh.scale.x = mesh.scale.y = mesh.scale.z = 1.2;
    // // atmosphere should provide light from behind the sphere, so only render the back side
    // mesh.material.side = THREE.BackSide;
    // atmosphereScene.add(mesh);
    
    // // clone earlier sphere geometry to block light correctly
    // // and make it a bit smaller so that light blends into surface a bit
    // var blackMaterial = new THREE.MeshBasicMaterial( {color: 0x000000} ); 
    // var sphere = new THREE.Mesh(sphereGeo.clone(), blackMaterial);
    // sphere.scale.x = sphere.scale.y = sphere.scale.z = 1;
    // atmosphereScene.add(sphere);
    
    // ////////////////////////////////////////////////////////////////////////
    // // final composer will blend composer2.render() results with the scene 
    // ////////////////////////////////////////////////////////////////////////
    
    // // prepare secondary composer
    // var renderTargetParameters = 
    //     { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, 
    //       format: THREE.RGBFormat, stencilBuffer: false };
    // var renderTarget = new THREE.WebGLRenderTarget( SCREEN_WIDTH, SCREEN_HEIGHT, renderTargetParameters );
    // composer2 = new THREE.EffectComposer( renderer, renderTarget );
    
    // // prepare the secondary render's passes
    // var render2Pass = new THREE.RenderPass( atmosphereScene, camera2 );
    // composer2.addPass( render2Pass );
    
    // // prepare final composer
    // finalComposer = new THREE.EffectComposer( renderer, renderTarget );

    // // prepare the final render's passes
    // var renderModel = new THREE.RenderPass( scene, camera );
    // finalComposer.addPass( renderModel );

    // var effectBlend = new THREE.ShaderPass( THREE.AdditiveBlendShader, "tDiffuse" );
    // effectBlend.uniforms[ 'tDiffuse2' ].value = composer2.renderTarget2;
    // effectBlend.renderToScreen = true;
    // finalComposer.addPass( effectBlend );
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

function initObjects() {
    modelLoader(['/3dModels/pyramid.stl'], this.modelLoaded);
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
        fragmentShader: document.getElementById( 'fragmentShaderAtmosphere' ).textContent,
        side: THREE.BothSides
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
    
    pointCloud2.updateGrid();  //TODO: Change Movement. Pass to Shader.
    
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
  
    render();
}

function render() {
    renderer.render(scene, camera);
    // composer2.render(scene, camera);
    // finalComposer.render(scene, camera);
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
