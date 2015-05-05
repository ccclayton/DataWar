/**
 * @author mrdoob / http://mrdoob.com/
 */
// var debugOn = false;
THREE.PointerLockControls = function (yawObject, camera ) {

	var scope = this;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.position.set(0,0, 20);
	pitchObject.add( camera );

	// var yawObject = new THREE.Object3D();
	// yawObject.position.y = 10;
	// yawObject.position.z = 200;
	yawObject.add( pitchObject );

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var doRotate = false;
	var rotateX=0;
	var rotateY=0;

	var isOnObject = false;
	var canJump = false;

	var prevTime = performance.now();

	var velocity = new THREE.Vector3(0,0,0);

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		// yawObject.rotation.y -= movementX * 0.002;
		rotateY = -movementX * 0.002;
		rotateX = -movementY * 0.002;

		doRotate = true;
		// pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	this.rotateY=function(val){
		rotateY = val;
		doRotate = true;
	}

	this.onKeyDown = function ( event ) {
		// console.log(event.keyCode);
		// pitchObject.getDirection;
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				moveLeft = true;
				break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ){
					yawObject.applyCentralImpulse(new THREE.Vector3(0, 200000, 0));
					// velocity.y += 100;
				}
				canJump = false;
				break;

			case 90: //z for testing
				cube2.setLinearVelocity(new THREE.Vector3(10, 40, 10));
				break;

			case 70: //f for flipping
				yawObject.applyImpulse(new THREE.Vector3(0, 100000, 0), new THREE.Vector3(10, 0, 0));
				break;
		}

	};

	this.onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;

		}

	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', this.onKeyDown, false );
	document.addEventListener( 'keyup', this.onKeyUp, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

	};

	this.getDirection = function() {

		// assumes the camera itself is not rotated
		console.log("getting direction");

		var direction = new THREE.Vector3( 0, 0, -1 );
		var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );

		return function( v ) {

			// rotation.set( pitchObject.rotation.x+yawObject.rotation.x, yawObject.rotation.y, yawObject.rotation.z );
			// console.log(yawObject.rotation);
			// v.copy( direction ).applyEuler( rotation );
			v.copy( direction ).applyEuler( yawObject.rotation );
			// console.log(v);

			return v;

		}

	}();

	this.update = function ( ) {
		var time = performance.now();

		if ( scope.enabled === false ){
			prevTime = time;
			return;
		}

		var delta = ( time - prevTime ) / 1000;
		// if(debugOn) debugger
		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 3.0 * delta;
		if(velocity.z > 100) velocity.z = 100;
		if(velocity.z< -100) velocity.z = -100;
		// velocity.z = 0;
		// velocity.x = 0;

		// velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

		if ( moveForward ) velocity.z -= 500 * delta;
		if ( moveBackward ) velocity.z += 500 * delta;
		
		if ( moveLeft ) velocity.x -= 500 * delta;
		if ( moveRight ) velocity.x += 500 * delta;

		if ( isOnObject === true ) {

			velocity.y = Math.max( 0, velocity.y );

		}
		if(doRotate){
			// console.log("rotating Y "+rotateY);
			yawObject.rotateY(rotateY);
			yawObject.__dirtyRotation = true;
			pitchObject.rotation.x += rotateX; //disable pitchObject rotation
			doRotate = false;
		}

		yawObject.translateX( velocity.x * delta );
		yawObject.translateY( velocity.y * delta ); 
		yawObject.translateZ( velocity.z * delta );
		yawObject.__dirtyPosition = true;

		if(velocity.length()>0.1){
			pointCloud.addInFrontOfCamera();
			lineTrace.addInFrontOfCamera();
		}

		if ( yawObject.position.y < 10 ) {
			// yawObject.position.y = 10;

			canJump = true;

		}

		prevTime = time;

	};


	this.moveLeft = function() {
		return moveLeft;
	};
	
	this.moveRight = function() {
		return moveRight;
	};
	
	this.moveForward = function() {
		return moveForward;
	};

	this.moving = function(dv){
		// debugOn = true;
		var delta = 0.16; //assume 60 frame per second
		velocity.z += dv*delta;
	};

	this.moveBackward = function() {
		return moveBackward;
	};
};