'use strict';

var drawing;

var JointType=
    {
      head:0, neck:1, lshoulder:2, rshoulder:3, lelbow:4, relbow:5, lhand:6, rhand:7,
      torso:8, lhip:9, rhip:10, lknee:11, rknee:12, lfoot:13, rfoot:14,
      midspine:15, lwrist:16, rwrist:17, lankle:18, rankle:19, topspine:20,
      lhandtip:21, lthumb:22, rhandtip:23, rthumb:24
    } ;
var HandState={Unknown:0, NotTracked:1, Open:2, Closed:3, Lasso:4};

var TrackingState = {NotTracked:0, Inferred:1, Tracked:2};
var TrackColor = [new THREE.Color('red'), new THREE.Color('blue'), new THREE.Color('green')];

var worldScale = config.user.skeleton.scale || 0.01;    
var yOffset = config.user.skeleton.yOffset || 5;
var zOffset = config.user.skeleton.zOffset || -25;

var boneColor = config.user.skeleton.boneColor || 0xffffff;
var jointColor = config.user.skeleton.jointColor || 0x44ffff;

function connectKinect(bSkeleton) {
  var socket;
  var lineObjects = [];
  var jointObjects = [];
  var jointSizes=[2, 0.5, 1, 1,
              0.5, 0.5, 1.5, 1.5,
              1, 1, 1, 0.5,
              0.5, 1, 1, 0.5,
              0.5, 0.5, 0.5, 0.5,
              0.5, 0.25, 0.125, 0.25,
              0.125];
  var joints=['head', 'neck', 'lshoulder', 'rshoulder',
              'lelbow', 'relbow', 'lhand', 'rhand',
              'torso', 'lhip', 'rhip', 'lknee',
              'rknee', 'lfoot', 'rfoot', "midspine",
              "lwrist", "rwrist", "lankle", "rankle",
              "topspine", "lhandtip", "lthumb", "rhandtip",
              "rthumb"];

  var jointPath=[
    ['head', 'neck'],
    ['head', 'topspine'],
    ['topspine', 'midspine'],
    ['midspine', 'torso'],
    ['topspine', 'lshoulder'],
    ['lshoulder', 'lelbow'],
    ['lelbow', 'lwrist'],
    ['lwrist', 'lhand'],
    // ['lhand', 'lthumb'],
    // ['lwrist', 'lhandtip'],
    ['topspine', 'rshoulder'],
    ['rshoulder', 'relbow'],
    ['relbow', 'rwrist'],
    ['rwrist', 'rhand'],
    // ['rhand', 'rthumb'],
    // ['rwrist', 'rhandtip'],
    ['torso', 'lhip'],
    ['lhip', 'lknee'],
    ['lknee', 'lankle'],
    ['lankle', 'lfoot'],
    ['torso', 'rhip'],
    ['rhip', 'rknee'],
    ['rknee', 'rankle'],
    ['rankle', 'rfoot']

  ];

  var jointPositions = [];
  // var influence_joints=['head', 'neck', 'lshoulder', 'rshoulder', 'lelbow', 'relbow', 'lhand', 'rhand',
  //     'torso', 'lhip', 'rhip', 'lknee', 'rknee', 'lfoot', 'rfoot',
  //     "midspine", "topspine"];
  var influence_joints=['lhand', 'rhand', 'lfoot', 'rfoot'];
  var jointsNodes={}; window.jointsNodes = jointsNodes;
  var jointsLastPosition = {};
  var jointsSpeed={}; window.jointsSpeed = jointsSpeed;
  var jointsTrackingState={};
  var jointsLastTrackingState={};
  var lHandState=HandState.Open;
  var rHandState=HandState.Open;

  var _showInfo=true;
  var _fly=false;
  var _dance = "none"; //"none", "dance", "dance-black-hole"
  var kinectInfo = [];

  var tracking_cnt = 0;
  var hands_open_cnt = 0;

  var drift_scale = 50;
  var torc_scale = -1e-5;
  var black_hole_gravity = 3e6;
  var black_hole_scale_up = 3; //scale human size to TV size
  var influence_scale_up = 3;

  var lastPacketTime = new Date().getTime();

  var skeleton = new THREE.Object3D();

  // var boxGeo=new THREE.BoxGeometry(10, 5, 2);
  // var boxMat = new THREE.MeshBasicMaterial({color:0x00ffff});
  // var box = new THREE.Mesh(boxGeo, boxMat);
  // skeleton.add(box);

  joints.forEach(function(j){
    jointsNodes[j] = new THREE.Vector3();
    jointsLastPosition[j] = new THREE.Vector3();
    jointsSpeed[j] = new THREE.Vector3();
    jointsTrackingState[j] = TrackingState.NotTracked;

    jointPositions.push(new THREE.Vector3(0,10,0));
  });


  var drawBones=function() {
    for(var i=0; i<jointPath.length; i++){
        if (!lineObjects[i]) {
          var lineMaterial = new THREE.LineBasicMaterial({
              color: boneColor,
              linewidth:10
          });

          var lineGeometry = new THREE.Geometry();
          lineGeometry.vertices.push(jointPositions[joints.indexOf(jointPath[i][0])]);
          lineGeometry.vertices.push(jointPositions[joints.indexOf(jointPath[i][1])]);
      
          var line = new THREE.Line(lineGeometry, lineMaterial);

          skeleton.add(line);

          lineObjects[i] = line;
        }
      }
  }

  var drawJoints=function(){
    for(var i=0; i<joints.length; i++){
        if (joints[i] !== "rthumb" && joints[i] !== "rhandtip" && joints[i] !== "lthumb" && joints[i] !== "lhandtip") {
          if (!jointObjects[i]) {
            var material = new THREE.MeshBasicMaterial( { color:jointColor, transparent: true, opacity: 0.4} );
            // var material = new THREE.MeshNormalMaterial();

            var sphere = new THREE.Mesh( new THREE.SphereGeometry( jointSizes[i], 10, 10 ), material );
            
            skeleton.add(sphere);
            
            jointObjects[i] = sphere;

            jointObjects[i].position.copy(jointPositions[i]);
          }
        }
      }
  }
  
  var setHeadLevel=function(){
    var zHead = jointPositions[0].z;
    var zTorso = jointPositions[8].z;
    var adjustment = 0.4;
    pitchObject.rotation.x = 0.9 * pitchObject.rotation.x + 0.1 * (zHead - zTorso) * adjustment;
  }

  drawJoints();
  drawBones();


  scene.add(skeleton);

  skeleton.name = "skeleton";
  window.skeleton = skeleton;


  // if(bSkeleton)
    //drawing = new Drawing.SkeletonGraph({layout: '3d', selection: false, numNodes: 50, graphLayout:{attraction: 2000, repulsion: 0.8}, showStats: true, showInfo: true});

  socket = io.connect(window.location.origin);
  socket
    .on("from server", function(msg){
      console.log(msg);
    })
    .on("skeleton", function(msg){
       // console.log(msg.length);
      // console.log(msg[3]);
      if(msg.length> 10){ //has valid skeleton data

        //get all the joint positions
        // console.log(msg[0][5]*worldScale);
        for(var i=0; i<joints.length; i++){
          jointPositions[i].copy(new THREE.Vector3(msg[i][3]*worldScale,
                                                  msg[i][4]*worldScale + yOffset,
                                                  msg[i][5]*worldScale + zOffset));
        }
      }
      
      if(bSkeleton){

        updateBones();
        updateJoints();
        //setHeadLevel();

        // skeleton.position.copy(yawObject.position.clone());
        
        // var qm = new THREE.Quaternion();
        // THREE.Quaternion.slerp(skeleton.quaternion, camera.quaternion, qm, 0.07);
        // skeleton.quaternion.copy(qm);
        // skeleton.quaternion.normalize();

      //   // read hand states
      //   //tag, body id, lHandState, rHandState
      //   lHandState = msg[joints.length+3][2];
      //   rHandState = msg[joints.length+3][3];
      //   // console.log(""+lHandState + " "+rHandState);
      //   while(kinectInfo.length){kinectInfo.pop();} //clean the debug info
      //   calculateSpeed();
      //   var t = new Date().getTime();
      //   if(t-lastPacketTime < 500) //get rid of the first gesture
      //     detectGesture();
      //   lastPacketTime = t;

      //   copyToLast();
      //   if(_showInfo) {
      //     while(drawing.kinectInfo.length) drawing.kinectInfo.pop();
      //     kinectInfo.forEach(function(info){
      //       drawing.kinectInfo.push(info);  
      //     });
        // }
      }
    });

    var updateJoints=function() {
      for(var i=0; i<joints.length; i++){
        if (jointObjects[i]) {
          jointObjects[i].position.copy(jointPositions[i]);
        }
      }
    }

    var updateBones=function() {
      for(var i=0; i<jointPath.length; i++){
        lineObjects[i].geometry.vertices[ 0 ].x = jointPositions[joints.indexOf(jointPath[i][0])].x;
        lineObjects[i].geometry.vertices[ 0 ].y = jointPositions[joints.indexOf(jointPath[i][0])].y;
        lineObjects[i].geometry.vertices[ 0 ].z = jointPositions[joints.indexOf(jointPath[i][0])].z;
        
        lineObjects[i].geometry.vertices[ 1 ].x = jointPositions[joints.indexOf(jointPath[i][1])].x;
        lineObjects[i].geometry.vertices[ 1 ].y = jointPositions[joints.indexOf(jointPath[i][1])].y;
        lineObjects[i].geometry.vertices[ 1 ].z = jointPositions[joints.indexOf(jointPath[i][1])].z;

        lineObjects[i].geometry.verticesNeedUpdate = true;

      }
    }

    var calculateSpeed=function(){
      joints.forEach(function(i){
        var n  = jointsNodes[i];
        var l = jointsLastPosition[i];
        jointsSpeed[i].set(n.x - l.x, n.y - l.y, n.z - l.z);
      });
    };

    var copyToLast=function(){
      joints.forEach(function(i){
        var n  = jointsNodes[i];
        jointsLastPosition[i].set(n.x, n.y, n.z);
        jointsLastTrackingState[i] = jointsTrackingState[i];
      });
    };

    var detectGesture=function(){
      drawing.setHasKinectInput(10);
      var sign = bSkeleton ? -1 : 1;
      sign=-1;
      var head = jointsNodes.head;
      var neck = jointsNodes.neck;
      var topspine = jointsNodes.topspine;
      var lhand = jointsNodes.lhand;
      var rhand = jointsNodes.rhand;
      var lshoulder = jointsNodes.lshoulder;
      var rshoulder = jointsNodes.rshoulder;
      var torso = jointsNodes.torso;

      var torso_length = torso.clone().sub(neck).length();
      var hand_neck_ydist = (lhand.y+rhand.y)/2.0 - neck.y;
      // console.log("hand_head_dist: "+ hand_head_dist);
      // if(hand_neck_ydist > 100){
      //   console.log("hands up");
      //   drawing.camera.position.y -=100;
      // }

      socket.emit("kinectHeartbeat", {x:Math.round(torso.x), y:Math.round(torso.y), z:Math.round(torso.z)});

      var horizontalLength=function(v1, v2){
        return Math.sqrt( (v1.x-v2.x)*(v1.x-v2.x) + (v1.z-v2.z)*(v1.z-v2.z) );
      };

      var lhand_shoulder_dist = horizontalLength(lshoulder, lhand);
      var b_l_arm_not_down = (lhand_shoulder_dist > torso_length/2) || (lshoulder.y - lhand.y < torso_length * 3/ 4);
      var b_l_arm_open = (lhand_shoulder_dist > 250); //fully open is 500
      var rhand_shoulder_dist = horizontalLength(rshoulder, rhand);
      var b_r_arm_open = (rhand_shoulder_dist > 250);
      var b_r_arm_not_down = (rhand_shoulder_dist > torso_length/2) || (rshoulder.y - rhand.y < torso_length * 3/ 4);
      var b_both_arm_open = (b_l_arm_open && b_r_arm_open);
      var b_both_arm_not_down = (b_l_arm_not_down && b_r_arm_not_down);
      var b_not_both_hands_closed = !(lHandState==HandState.Closed && rHandState==HandState.Closed);

      kinectInfo.push({name:"TorsoL", val:Math.round(torso_length)});
      kinectInfo.push({name:"LH dist", val:Math.round(lhand_shoulder_dist)});
      kinectInfo.push({name:"LH Zdist", val:Math.round(lshoulder.y - lhand.y )});
      kinectInfo.push({name:"RH dist", val:Math.round(rhand_shoulder_dist)});
      kinectInfo.push({name:"RH Zdist", val:Math.round(rshoulder.y - rhand.y )});
      
      if(jointsTrackingState.lhand == 2 && jointsTrackingState.rhand == 2){
        tracking_cnt = tracking_cnt > 5 ? 6 : tracking_cnt + 1;

      }else{
        tracking_cnt = 0;
      }
      if(b_not_both_hands_closed){
        hands_open_cnt = hands_open_cnt > 5 ? 6 : hands_open_cnt+1;
      }else{
        hands_open_cnt = 0;
      }

      // && jointsLastTrackingState.lhand ==2 && jointsLastTrackingState.rhand ==2){
      // if(tracking_cnt>5){
      var sum_speed = jointsSpeed.lhand.length() + jointsSpeed.rhand.length();
      var lhToNeck = jointsNodes.lhand.clone().sub(jointsNodes.topspine);
      var rhToNeck = jointsNodes.rhand.clone().sub(jointsNodes.topspine);
      var ltorc = jointsSpeed.lhand.clone().cross(lhToNeck);
      var rtorc = jointsSpeed.rhand.clone().cross(rhToNeck);
      var torc = ltorc.clone().add(rtorc);
      var sumVec = jointsSpeed.lhand.clone().add(jointsSpeed.rhand);
      if(_dance=='dance'){
        // drawing.graph.layout.addDrift(sumVec.multiplyScalar(sumVec.length()).divideScalar(0.4));
        var driftForce = jointsSpeed.topspine.clone();
        driftForce.multiplyScalar(Math.pow(driftForce.length(), 1)*drift_scale); //make faster movement have more impact
        // drawing.graph.layout.addDrift(driftForce);
        // drawing.graph.layout.addTorc(torc.multiplyScalar(torc_scale));
        drawing.graph.layout.resetTemperature();
        kinectInfo.push({name:"Torc", val:Math.round(torc.length())});
        kinectInfo.push({name:"Drift", val:Math.round(driftForce.length())});
      }

      if(_dance == 'dance-black-hole'){
        // drawing.graph.layout.addDrift(sumVec.multiplyScalar(sumVec.length()).divideScalar(0.4));
        var driftForce = jointsSpeed.topspine.clone();
        driftForce.multiplyScalar(Math.pow(driftForce.length(), 3)*drift_scale); //make faster movement have more impact
        drawing.graph.layout.addDrift(driftForce);
        drawing.graph.layout.addTorc(torc.multiplyScalar(torc_scale));
        drawing.graph.layout.resetTemperature();
        kinectInfo.push({name:"Torc", val:Math.round(torc.length())});
        kinectInfo.push({name:"Drift", val:Math.round(driftForce.length())});
        // console.log('black hole');
        var lhToTopspine = jointsNodes.lhand.clone().sub(jointsNodes.topspine).multiplyScalar(black_hole_scale_up);
        var rhToTopspine = jointsNodes.rhand.clone().sub(jointsNodes.topspine).multiplyScalar(black_hole_scale_up);
        if(lHandState!=HandState.Closed)
          drawing.graph.layout.setBlackHole(0, black_hole_gravity, lhToTopspine);
        if(rHandState!=HandState.Closed)
          drawing.graph.layout.setBlackHole(1, black_hole_gravity, rhToTopspine);
      }
      if(_dance == 'dance-influence'){
        drawing.graph.layout.resetTemperature();

        for(var i=0; i<influence_joints.length; i++){
          var joint = influence_joints[i];
          if(jointsTrackingState[joint]==TrackingState.Tracked){
            var pos=jointsNodes[joint].clone().sub(jointsNodes.midspine).multiplyScalar(influence_scale_up);
            drawing.graph.layout.setInfluence(i, pos);
          }
        }
      }

      kinectInfo.push({name:"HSpeed", val: Math.round(sum_speed)});

      var limitDrift=function(v, limit, scale){
        var absV = Math.abs(v);
        if(absV<limit) return 0;

        var sign = v/absV;
        return sign * (absV - limit) * scale;
      };

      // drawing.handsSpeed(Math.round(sum_speed));
      // console.log(sum_speed);
      if(_fly && b_both_arm_not_down && sum_speed < 100 && hands_open_cnt > 5 && tracking_cnt > 5){
        // var xshift = lhand.y - rhand.y;
        var xshift = (lhand.x + rhand.x)/2.0 - topspine.x;
        // var yshift = (lhand.y+rhand.y)/2.0 - topspine.y;
        var yshift = topspine.y - (lhand.y+rhand.y)/2.0 - torso_length / 4;
        // var zshift = head.z - torso.z;
        var zshift = (lhand.z + rhand.z)/2.0 - topspine.z + torso_length *1/ 2;

        var drift = new THREE.Vector3(xshift, yshift, zshift);
        kinectInfo.push({name:"DL", val: Math.round(drift.length())});

        var driftScale = config.wii.driftScale || 1/100;
        var driftLimit = config.wii.driftLimit || 60;
        drift.x = -limitDrift(drift.x, driftLimit, driftScale);
        drift.y = limitDrift(drift.y, driftLimit, driftScale);
        drift.z = -limitDrift(drift.z, driftLimit, driftScale);

        drawing.controls.pan(drift);
        // drawing.controls.pan(new THREE.Vector3(-drift.x, -drift.y, -drift.z));
        kinectInfo.push({name:"DX", val: Math.round(xshift)});
        kinectInfo.push({name:"DY", val: Math.round(yshift)});
        kinectInfo.push({name:"DZ", val: Math.round(zshift)});


        var angle = lhand.z - rhand.z;
        angle = limitDrift(angle, 100, 1/100000);
        drawing.controls.rotateLeft(angle);

        kinectInfo.push({name:"RL", val: Math.round(angle*10000)/10000});


        // var upAngle = head.z - torso.z;
        // upAngle = limitDrift(upAngle, 30, 1/30000);
        var upAngle = lhand.y - rhand.y;
        upAngle = limitDrift(upAngle, 100, 1/100000);
        drawing.controls.rotateUp(upAngle);

        kinectInfo.push({name:"RU", val: Math.round(-upAngle*10000)/10000});

        // var ave_dist = (lhand.y+rhand.y)/2.0 - neck.y;
        // if(Math.abs(ave_dist)<300){
        //   drawing.camera.position.y += sign*hand_neck_ydist/3.0;
        // }

        // var diff_dist = (lhand.y - rhand.y);
        // drawing.camera.position.x += sign*diff_dist/10;

        // var head_torso_z_diff = head.z - torso.z;
        // drawing.camera.position.z += sign*head_torso_z_diff/10;

        // var diff_hand_z = lhand.z - rhand.z;
        // drawing.camera.rotation.y -= diff_hand_z / 100000;

      }
      ////TODO: PRobably take out
      //if(jointPositions[0].z > jointPositions[8].z){
      //
      //  controls.
      //}
      //else if( jointPositions[0].z < jointPositions[8].z){
      //  controls.enabled = true;
      //  controls.pitchObject.rotateX();
      //}
      // }

    };

    var getSet=function(param){
      return function(_){
        if(_==null){
          return eval(param);
        }else{
          eval(param +"= _");
        }
      };
    }

    return{
      fly: getSet("_fly"),
      dance: getSet("_dance"),
      showInfo: getSet("_showInfo"),
      torc_scale:getSet("torc_scale"),
      drift_scale: getSet("drift_scale"),
      black_hole_gravity: getSet("black_hole_gravity"),
      black_hole_scale_up: getSet("black_hole_scale_up"),
      influence_scale_up: getSet("influence_scale_up")
    };

};
