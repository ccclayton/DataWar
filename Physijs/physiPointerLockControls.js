/**
 * @author mrdoob / http://mrdoob.com/
 */

THREE.PointerLockControls = function (yawObject, camera ) {

	var scope = this;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	// var yawObject = new THREE.Object3D();
	// yawObject.position.y = 10;
	// yawObject.position.z = 200;
	yawObject.add( pitchObject );

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;

	var lockMoveForward = false;
	var lockMoveBackward = false;
	var lockMoveLeft = false;
	var lockMoveRight = false;

	var isOnObject = false;
	var canJump = false;

	var lastKey = null;

	var prevTime = performance.now();

	var velocity = new THREE.Vector3();

	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		// yawObject.rotation.y -= movementX * 0.002;
		console.log("rotating Y "+(-movementX * 0.002));
		yawObject.rotateY(-movementX * 0.002);
		yawObject._dirtyRotation = true;
		pitchObject.rotation.x -= movementY * 0.002;

		// pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	var onKeyDown = function ( event ) {

		console.log(event.keyCode);
		switch ( event.keyCode ) {

			case 38: // up
			case 87: // w
				lastKey = "up";
				moveForward = true;
				break;

			case 37: // left
			case 65: // a
				lastKey = "left";
				moveLeft = true;
				break;

			case 40: // down
			case 83: // s
				lastKey = "down";
				moveBackward = true;
				break;

			case 39: // right
			case 68: // d
				lastKey = "right";
				moveRight = true;
				break;

			case 32: // space
				if ( canJump === true ) velocity.y += 350;
				canJump = false;
				break;

			case 90: //z for testing
				cube2.setLinearVelocity(new THREE.Vector3(10, 40, 10));
				break;
		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: // up
			case 87: // w
				moveForward = false;
				if (moveBackward) {
					lastKey = "down";
				} else if (moveRight) {
					lastKey = "right";
				} else if (moveLeft) {
					lastKey = "left";
				}
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				if (moveForward) {
					lastKey = "up";
				} else if (moveRight) {
					lastKey = "right";
				} else if (moveBackward) {
					lastKey = "down";
				}
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				if (moveForward) {
					lastKey = "up";
				} else if (moveRight) {
					lastKey = "right";
				} else if (moveLeft) {
					lastKey = "left";
				}
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				if (moveForward) {
					lastKey = "up";
				} else if (moveBackward) {
					lastKey = "down";
				} else if (moveLeft) {
					lastKey = "left";
				}
				break;

		}

	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

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

			rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

			v.copy( direction ).applyEuler( rotation );

			return v;

		}

	}();

	this.update = function ( ) {

		if ( scope.enabled === false ) return;

		var time = performance.now();
		var delta = ( time - prevTime ) / 1000;

		velocity.x -= velocity.x * 5.0 * delta;
		velocity.z -= velocity.z * 5.0 * delta;
		// velocity.z = 0;
		// velocity.x = 0;

		velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

		if ( moveForward && !lockMoveForward ) velocity.z -= 2000 * delta;
		if ( moveBackward && !lockMoveBackward ) velocity.z += 2000 * delta;
		
		if ( moveLeft && !lockMoveLeft ) velocity.x -= 2000 * delta;
		if ( moveRight && !lockMoveRight ) velocity.x += 2000 * delta;

		if ( isOnObject === true ) {

			velocity.y = Math.max( 0, velocity.y );

		}

		// yawObject.translateX( velocity.x * delta );
		// yawObject.translateY( velocity.y * delta ); 
		// yawObject.translateZ( velocity.z * delta );
		// yawObject.__dirtyPosition = true;

		// if ( yawObject.position.y < 10 ) {

		// 	velocity.y = 0;
		// 	yawObject.position.y = 10;

		// 	canJump = true;

		// }

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
	
	this.moveBackward = function() {
		return moveBackward;
	};
	
	this.lockMoveForward = function(boolean){
		lockMoveForward = boolean;
	};
	
	this.lockMoveBackward = function(boolean){
		lockMoveBackward = boolean;
	};
	
	this.lockMoveLeft = function(boolean){
		lockMoveLeft = boolean;
	};
	
	this.lockMoveRight = function(boolean){
		lockMoveRight = boolean;
	};

	this.getLastKey = function() {
		return lastKey;
	}

};