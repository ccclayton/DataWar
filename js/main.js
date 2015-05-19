/**
 * @author:Colin Clayton
 * @author:Danny Gillies
 * Initializes and renders the scene.
 */

var renderer, scene, camera, directionalLight, water;
var geometry, material, mesh, ground, PlayerCube, yawObject;
var controls;
var waterNormals;
var oculusEffect;

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

var ASPECT = window.innerWidth / window.innerHeight;
var NEAR = 1;
var FAR = 100000;
var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;

window.heads = new Array();
window.pyramid = null;

init();
animate();


function init() {

    //Create Physi.js Thread worker
    Physijs.scripts.worker = '../Physijs/physijs_worker.js';
    Physijs.scripts.ammo = '../Physijs/examples/js/ammo.js';

    //Create a new Physi.js Scene
    scene = new Physijs.Scene;
    scene.setGravity(
        new THREE.Vector3(0, -250, 0)
    );

    //Instantiate oscControls for the Wii Balance Board
    oscControl = new OscControl(scene);

    //Create a Perspective camera for the scene
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.z = 100;

    //Add Camera to the scene
    scene.add(camera);

    //Initialize all lights in the scene.
    initLights();

    //This is an invisible Physi.js object that
    //will hold the camera.
    yawObject = new Physijs.BoxMesh(
        new THREE.BoxGeometry(50, 10, 50),
        Physijs.createMaterial(
            new THREE.MeshNormalMaterial(),
            0.2, //friction
            0.2 //restitution
        ),
        1000
    );

    //We don't want it to be visible
    yawObject.visible = false;

    //Add it to the scene
    scene.add(yawObject);

    //Set to a position given in our config.js file
    yawObject.position.set(config.user.position.x, config.user.position.y, config.user.position.z);

    //Create the Skybox
    initSkybox();

    //Create all objects that will be in the scene
    //This will create the Pyramid in this case
    initObjects();

    //Create the WebGLRenderer to be used to render the scene
    renderer = new THREE.WebGLRenderer({clearAlpha: 1});
    renderer.setClearColor(0x000000);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMapSoft = true;
    document.body.appendChild(renderer.domElement);

    //Create the main set of controls
    controls = new THREE.PointerLockControls(yawObject, camera);

    //We are putting the camera inside of 'yawObject'
    //Then adding it to the scene
    scene.add(controls.getObject());

    //Set the position of the camera
    camera.position.set(0, 10, 0);

    //Start the water shader
    initWater();

    //Create the main graph to be used to display the twitter visualization
    var options = {Layout: "3d", scene: this.scene};
    graph = new Graph(options);

    //We are using a force-directed graph to do this
    //See Graph.js and force-directed-layout.js
    graph.layout = new Layout.ForceDirected(graph, {width: config.tweets.width, repulsion: config.tweets.repulsion});

    //Create a new TweetStructure which is the tweet graph
    tweetStructure = new TweetStructure(graph);

    grabTweets();

    //Create a new PointCloud to follow the user's movement
    //around the scene
    pointCloud = new PointCloud(scene);
    //Adjust Color to white
    pointCloud.uniforms.color.value = new THREE.Color(0xFFFFFF);

    //Create a second PointCloud to fill the scene with particles
    pointCloud2 = new PointCloud(scene);

    //LineTrace is used to draw a line tracking where the user has gone around
    //the scene
    lineTrace = new LineTrace(scene);

    pointCloud2.maxParticles = 50000;

    //Sets value that determines how the particles span the space
    pointCloud2.fieldSize = worldSize;

    //Adds particles to the scene
    pointCloud2.addBatch(20000);

    //Provides key controls
    init_keys(renderer.domElement);

    //Reads kinect data / builds skeleton
    var bSkeleton = true;
    window.Kinect = connectKinect(bSkeleton);

    window.addEventListener('resize', onWindowResize, false);

    //Initializes the Oculus Rift
    initOculus(renderer, camera);
}

/**
 * @author:Colin Clayton
 *
 * Initializes Oculus Controls, First Person Controls, and the
 * OculusRiftEffect. Must use oculus-rest-server if you want
 * positional tracking to work. See README.
 */
function initOculus(renderer, camera) {

    if (oculusController) {
        oculusControls = new THREE.OculusControls(camera);
        oculusControls.connect();
        controls = new THREE.FirstPersonControls(camera);
        controls.movementSpeed = 20000;
        controls.lookSpeed = 3.0;
        camera.position.set(config.user.position.x, config.user.position.y, config.user.position.z);
    }

    oculusEffect = new THREE.OculusRiftEffect(renderer, {worldScale: 1});
    oculusEffect.setSize(window.innerWidth, window.innerHeight);
}

/**
 @author:Colin Clayton
 @author:Travis Bennett
 * Initializes and draws the Skybox using a THREE.js included shader.
 */
function initSkybox() {
    var prefix = "images/nebula-";
    var directions = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
    var imageSuffix = ".png";

    var urls = [];
    for (var i = 0; i < 6; i++)
        urls.push(prefix + directions[i] + imageSuffix);

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
        new THREE.BoxGeometry(worldSize + grow, worldSize + grow, worldSize + grow),
        skyMaterial
    );
    scene.add(skyMesh);

    // background stars
    var skyboxGeometry = new THREE.BoxGeometry(worldSize, worldSize, worldSize);
    var skyboxMaterial = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.25,
        map: THREE.ImageUtils.loadTexture('/textures/stars/bsg-stars.png')
    });
    skyboxMaterial.side = THREE.BackSide;
    // side: THREE.BackSide
    var skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);
}

/**
 * @author:Travis Bennett
 * Initializes and draws the Moon object.
 * Uses a shader for lighting that can be found in datawar.html
 */
function makeMoon() {
    var customMaterialAtmosphere = new THREE.ShaderMaterial(
        {
            uniforms: {
                "c": {type: "f", value: 0.5},
                "p": {type: "f", value: 4.0}
            },
            vertexShader: document.getElementById('vertexShaderAtmosphere').textContent,
            fragmentShader: document.getElementById('fragmentShaderAtmosphere').textContent
        });

    var sphereGeo = new THREE.SphereGeometry(100, 32, 16);

    var moonTexture = THREE.ImageUtils.loadTexture('images/moon.jpg');
    var moonMaterial = new THREE.MeshBasicMaterial({
        map: moonTexture,
        transparent: true,
        opacity: 0.7
    });
    var moon = new THREE.Mesh(sphereGeo, moonMaterial);
    scene.add(moon);

    moon.position.set(0, 900, 0);

}
/**
 * @author: Travis Bennett
 */
function drawGrid() {

    var numAreas = 2;

    var l2rGeometry = new THREE.Geometry();
    l2rGeometry.vertices.push(new THREE.Vector3(-worldSize / 2, 0.25, 0));
    l2rGeometry.vertices.push(new THREE.Vector3(worldSize / 2, 0.25, 0));

    var f2bGeometry = new THREE.Geometry();
    f2bGeometry.vertices.push(new THREE.Vector3(0, 0.25, -worldSize / 2));
    f2bGeometry.vertices.push(new THREE.Vector3(0, 0.25, worldSize / 2));

    var material = new THREE.LineBasicMaterial({
        transparent: true,
        color: 0xFF0000,
        opacity: 0.95
    });

    for (var i = 1; i < numAreas; i++) {
        var lineLR = new THREE.Line(l2rGeometry, material);
        lineLR.position.z = (i * (worldSize / numAreas)) - worldSize / 2;
        scene.add(lineLR);

        var lineFB = new THREE.Line(f2bGeometry, material);
        lineFB.position.x = (i * (worldSize / numAreas)) - worldSize / 2;
        scene.add(lineFB);
    }
}

/**
 * @author:Travis Bennett
 */
function pyramidLoaded(obj, params) {
    obj.rotation.x = params.rotation;
    obj.scale.x = obj.scale.y = obj.scale.z = params.scale;
    obj.position.copy(params.position.clone());

    window.pyramid = obj;
    scene.add(obj);
};
/**
 * @author:Travis Bennett
 */
function headLoaded(obj, params) {
    obj.rotation.x = params.rotation;
    obj.scale.x = obj.scale.y = obj.scale.z = params.scale;
    obj.position.copy(params.position.clone());

    window.heads.push(obj);
    scene.add(obj);
};

/**
 * @author:Travis Bennett
 */
function showHeads() {
    scene.remove(window.pyramid);
    modelLoader(['/3dModels/danny/model_mesh.obj', '/3dModels/danny/model_mesh.obj.mtl'], this.headLoaded, {
        rotation: 0,
        scale: 2000,
        position: new THREE.Vector3(-500, 0, 0)
    });
    modelLoader(['/3dModels/colin/model_mesh.obj', '/3dModels/colin/model_mesh.obj.mtl'], this.headLoaded, {
        rotation: 0,
        scale: 2000,
        position: new THREE.Vector3(500, -110, 0)
    });
    modelLoader(['/3dModels/travis/model_mesh.obj', '/3dModels/travis/model_mesh.obj.mtl'], this.headLoaded, {
        rotation: 0,
        scale: 2000,
        position: new THREE.Vector3(-1400, -60, 0)
    });
    modelLoader(['/3dModels/wei/model_mesh.obj', '/3dModels/wei/model_mesh.obj.mtl'], this.headLoaded, {
        rotation: 0,
        scale: 2000,
        position: new THREE.Vector3(1400, -110, 0)
    });
}

/**
 * @author:Travis Bennett
 */
function initObjects() {
    modelLoader(['/3dModels/pyramid.stl'], this.pyramidLoaded, {
        rotation: -Math.PI / 2,
        scale: 8.25,
        position: new THREE.Vector3(0, 0, 0)
    });
    makeMoon();
    drawGrid();

    var geometry = new THREE.Geometry();
    geometry.vertices.push(new THREE.Vector3(0, 0, 0));
    geometry.vertices.push(new THREE.Vector3(0, 900, 0));

    var beam = new THREE.Mesh(new THREE.CylinderGeometry(25, 25, 2000, 50, 50, true), new THREE.MeshPhongMaterial({
        transparent: true,
        opacity: 0.25,
        color: 0xFFFFFF,
        uniforms: {
            "c": {type: "f", value: 0.54},
            "p": {type: "f", value: 6.0}
        },
        vertexShader: document.getElementById('vertexShaderAtmosphere').textContent,
        fragmentShader: document.getElementById('fragmentShaderAtmosphere').textContent//,
    }));
    scene.add(beam);
}

/**
 * @author: Colin Clayton
 * Initializes and draws water using two built in THREE.js shaders.
 * THREE.js Water and Mirror Shaders are used.
 */
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
    ground = new Physijs.BoxMesh(
        new THREE.BoxGeometry(worldSize, 1, worldSize),
        ground_material,
        0 // mass
    );
    ground.receiveShadow = true;
    ground.position.setY(-1);
    scene.add(ground);
}

/**
 * @author:Colin Clayton
 * Modified by Travis Bennett to be a function.
 *
 * Initializes all lights and then adds them to the scene.
 */
function initLights() {
    var light = new THREE.HemisphereLight(0xd1f8ff, 0x777788, 0.5);
    scene.add(light);
    directionalLight = new THREE.PointLight(0xd1f8ff);
    directionalLight.position.set(0, 500, 500);
    scene.add(directionalLight);
}

/**
 * @author:Danny Gillies
 * Pulls tweets from database and adds them to global tweet array
 */
function grabTweets() {

    setTimeout(grabTweets, config.tweets.pollTime);
    console.log("Getting tweets...");
    var param = {date: dt};
    $.get('/api/tweets', param, function (data) {
        if (data.tweets.length != 0) {
            dt = Date.parse(data.tweets[data.tweets.length - 1].created_at);
            currTweetArray = currTweetArray.concat(data.tweets);
        }
    });
}

/**
 * @author:Danny Gillies
 * Adds the next tweet to the scene and re-calculates the force-directed layout graph
 */
function createTweet() {
    tweetSpawnTimeout = setTimeout(function () {
        createTweet()
    }, config.tweets.spawnTime);

    if (currTweetArray.length != 0) {
        if (graph.nodes.length < maxTweets) {
            tweetStructure.drawTweet(currTweetArray.pop());
            graph.layout.init({iterations: 10000});
        }
    }
}

/**
 * @author:Colin Clayton
 * @author:Travis Bennett
 * Performs all animation/rendering/updating.
 */
function animate() {
    requestAnimationFrame(animate);

    pointCloud2.update();
    tweetStructure.render();
    water.material.uniforms.time.value += 1.0 / 60.0;


    controls.update(0.0002);
    //If Oculus is enabled, need to update the controls,
    //based on positional tracking and then render the effect to the scene
    if (oculusController) {
        oculusControls.update(0.000002);
        oculusEffect.render(scene, camera);

    }

    if (skeleton.children.length != 0) {
        skeleton.position.copy(yawObject.position.clone());
        skeleton.setRotationFromEuler(yawObject.rotation);
    }
    scene.simulate(); // run physics
    water.render(); //render water

    //Heads will always look at the position of the user
    if (window.heads.length > 0) {
        for (var i = 0; i < window.heads.length; i++) {
            window.heads[i].lookAt(yawObject.position);
        }
    }

    //If you fall to -5000, the 3D modeled heads will be drawn to the scene
    //Your position will be reset as well
    if (yawObject.position.y < -5000) {
        showHeads();
        yawObject.position.copy(config.user.position);
        yawObject.setLinearVelocity(new THREE.Vector3(0, 0, 0));
        yawObject.__dirtyPosition = true;
    }
    //Need to render the scene normally if the oculus is not being used
    if (!oculusController) {
        renderer.render(scene, camera);
    }

}
/**
 * @author:Colin Clayton
 * Makes sure everything is rendered appropriately for current screen size
 */
function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    if (oculusControls) {
        oculusEffect.setSize(window.innerWidth, window.innerHeight); //resizes oculus effect appropriately

    }
    else {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }


}

/**
 * @author:Colin Clayton
 * May be used to create random colored particles.
 * Returns a hex value such as "#EEEEEE"
 */
function getRandomColor() {
    var color = '#';
    var letters = '0123456789ABCDEF'.split('');
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    var colorWithoutQuotes = String(color);
    colorWithoutQuotes = colorWithoutQuotes.substring(0, colorWithoutQuotes.length);

    return colorWithoutQuotes;
}

/**
 * @author:Travis Bennet
 * @author:Weidong Yang
 * @author:Danny Gillies
 */
function resetScene() {

    //Reset user to home position
    yawObject.position.set(config.user.position.x, config.user.position.y, config.user.position.z);

    //Stop music
    stop();

    //Remove tweets
    clearTimeout(tweetSpawnTimeout);

    //Stop the force-directed-layout's calculations
    graph.layout.stop_calculating();

    //Remove nodes from scene.
    for (var i = graph.nodes.length - 1; i >= 0; i--) {
        var node = graph.nodes.pop();
        scene.remove(node.mesh);
    }

    //Remove TwitterNodes and TweetPanels from scene
    for (var i = tweetStructure.tweetsInScene.length - 1; i >= 0; i--) {
        var node = tweetStructure.tweetsInScene.pop();
        // console.log(node);
        scene.remove(node.mesh);
    }

    //Remove edges
    graph.removeAllEdges();

    //hide particles
    for (var i = pointCloud2.values_size.length; i >= 0; i--) {
        pointCloud2.values_size[i] = 0;
    }
}

