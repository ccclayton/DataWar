/**
 * @author:Weidong Yang
 * @author:Travis Bennett
 */
"use strict";

var OscControl = function (_scene) {
    this.scene = _scene;
    this.socket = null;
    this.wiiBalanceBoard = new WiiBalanceBoard(_scene);
    this.init();
};

OscControl.prototype.init = function () {
    var scope = this;
    if (typeof io !== "undefined") { //Failover for running on non Node server / Web Demo
        this.socket = io.connect(window.location.origin);
        this.socket.on('wiibalanceboard', function (msg) {
            scope.wiiBalanceBoard.messageIn(msg);
        });
    }
};

