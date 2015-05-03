"use strict";

var OscControl = function(){
	this.socket = null;
	this.init();
};

OscControl.prototype.init=function(){
	var scope = this;
	if(typeof io !== "undefined") { //Failover for running on non Node server / Web Demo
		this.socket = io.connect(window.location.origin);
		this.socket.on('wiibalanceboard', function(msg){
			var vel = msg[6]-0.5;
			var velSign = vel > 0 ? 1 : -1;
			var sqrtVel = Math.sqrt(velSign*vel)
			if(Math.abs(vel)>0.02){
				controls.enabled = true;
				controls.moving(velSign * sqrtVel*50);
			}

			var rotate = msg[5]-0.5;
			if(Math.abs(rotate)>0.02){
				var sign = rotate > 0 ? 1 : -1;
				controls.rotateY(-0.1*sign*Math.sqrt(sign*rotate)*sqrtVel*velSign);
			}

			//[bl, br, tl, tr, sum x, y], all (0, 1) range
			// console.log(msg);
			// scope.processOSCData(msg);
			// console.log(msg);
		});
	}
};

OscControl.prototype.processOSCData=function(msg){
	var z=0.9;
	if(msg[1]>0){
		motionVector.x = z*motionVector.x + (1-z)*map(msg[1], 0, 640, -1, 1);
		motionVector.y = z*motionVector.y + (1-z)*map(msg[2], 0, 480, 1, -1);
		bFoundTarget = true;
	}else{
		bFoundTarget = false;
	}
};

var map=function(val, inMin, inMax, outMin, outMax){
	if(val<inMin) return outMin;
	if(val>inMax) return outMax;

	return (val-inMin)/(inMax-inMin) * (outMax-outMin) + outMin;
};