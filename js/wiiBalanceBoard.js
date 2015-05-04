"use strict";

var WiiBalanceBoard=function(_scene){
	this.scene = _scene;
	this.sum =0;
	this.dsum = 0;
	this.sumOld = 0;
	this.x = 0;
	this.y = 0;
	this.weight = 0;
	this.z=0.9;
	this.sensitivity = 3;
	this.weightThreshold = 0.2;
	this.canJump = true;
};

WiiBalanceBoard.prototype.messageIn=function(msg){
	//[bl, br, tl, tr, sum x, y], all (0, 1) range, sum is 0 to 2
	var scope = this;
	this.sumOld = this.sum;
	this.sum = msg[4];
	var in_x = msg[5];
	var in_y = msg[6];
	this.x = this.z * this.x + (1-this.z)*in_x;
	this.y = this.z * this.y + (1-this.z)*in_y;

	if(this.sum>this.weightThreshold){
		var vel = this.y-0.5;
		var velSign = vel > 0 ? 1 : -1;
		var sqrtVel = Math.sqrt(velSign*vel)
		if(Math.abs(vel)>0.0002){
			controls.enabled = true;
			controls.moving(velSign * sqrtVel*50);
			pointCloud.addInFrontOfCamera();
			lineTrace.addInFrontOfCamera();
		}

		var rotate = this.x-0.5;
		if(Math.abs(rotate)>0.0002){
			var sign = rotate > 0 ? 1 : -1;
			controls.rotateY(-0.1*sign*Math.sqrt(sign*rotate)*sqrtVel*velSign);
		}
	}

	this.detectJump();

	// console.log(msg);
	// scope.processOSCData(msg);
	// console.log(msg);
};

WiiBalanceBoard.prototype.detectJump = function(){
	var scope = this;
	if(this.sum>0.8 && this.sum< this.sumOld){//jump
		console.log(this.sum);
		if(this.canJump){
			yawObject.applyCentralImpulse(new THREE.Vector3(0, 300000*(this.sum - 0.6), 0));
			this.canJump = false;
			setTimeout(function(){scope.canJump = true;}, 500);
		}
	}
};





