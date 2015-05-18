/**
 * @author:Weidong Yang
 * @author:Travis Bennett
 * Modified by Colin Clayton so you are able to stop movement.
 */
"use strict";

var WiiBalanceBoard = function (_scene) {
    this.scene = _scene;
    this.sum = 0;
    this.dsum = 0;
    this.sumOld = 0;
    this.x = 0;
    this.y = 0;
    this.weight = 1.0; //start heavy
    this.z = 0.9;
    this.sensitivity = 3;
    this.weightThreshold = 0.2;
    this.canJump = true;
    this.wait = 30; //wait for 0.5 sec when someone step on board
};

WiiBalanceBoard.prototype.messageIn = function (msg) {
    //[bl, br, tl, tr, sum x, y], all (0, 1) range, sum is 0 to 2
    var scope = this;
    this.sumOld = this.sum;
    this.sum = msg[4];
    var in_x = msg[5];
    var in_y = msg[6];
    this.x = this.z * this.x + (1 - this.z) * in_x;
    this.y = this.z * this.y + (1 - this.z) * in_y;

    // this.wait count down from 60 to 0, then enable
    if (this.sum > this.weightThreshold && this.wait > 0) {
        $('#instructions').hide();
        this.wait--;
        return;
    }

    // if nobody on the board, detect it and start waiting
    if (this.sum < this.weightThreshold) {
        this.wait = Math.min(this.wait + 1, 30);
        this.weight = 1.0;
        return;
    }

    this.weight = this.weight * 0.95 + this.sum * 0.05;

    if (this.sum > Math.max(this.weightThreshold, this.weight * 0.7)) {
        var vel = this.y - 0.5;
        var velSign = vel > 0 ? 1 : -1;
        var sqrtVel = Math.sqrt(velSign * vel)
        if (Math.abs(vel) > 0.1) { //Modified by Colin Clayton so you can stop movement.
            controls.enabled = true;
            controls.moving(velSign * sqrtVel * 50);
            // console.log(velSign*sqrtVel*50);

            // pointCloud.addInFrontOfCamera();
            // lineTrace.addInFrontOfCamera();
        }

        var rotate = this.x - 0.5;
        if (Math.abs(rotate) > 0.0002) {
            var sign = rotate > 0 ? 1 : -1;
            controls.rotateY(-0.1 * sign * Math.sqrt(sign * rotate) * sqrtVel * velSign);
        }
        this.detectJump();
    }


    // console.log(msg);
    // scope.processOSCData(msg);
    // console.log(msg);
};

WiiBalanceBoard.prototype.detectJump = function () {
    var scope = this;
    if (this.sum > (this.weight * 1.2) && this.sum < this.sumOld) {//jump
        //console.log(this.sum);
        if (this.canJump) {
            yawObject.applyCentralImpulse(new THREE.Vector3(0, 400000 * (this.sum / this.weight - 0.8), 0));
            this.canJump = false;
            setTimeout(function () {
                scope.canJump = true;
            }, 500);
        }
    }
};





