// https://github.com/101100/pca9685/blob/master/examples/servo.ts
// Converted using tsc

"use strict";
var i2cBus = require("i2c-bus");
var Pca9685Driver = require("pca9685");

var options = {
    i2c: i2cBus.openSync(1),
    address: 0x42,
    frequency: 50,
    debug: true
};

// [function]
// Degree to pulse-length
function deg2pulse(degree) {
    return Math.round(1900.0 / 180.0 * degree + 1450);
}

// pulse lengths in microseconds (theoretically, 1.5 ms
// is the middle of a typical servo's range)
// position "-90": 500
// position "0"  : 1450
// position "90" : 2400
var pulseLengths = [deg2pulse(0)];
//var steeringChannel = 0;
var numChannels = 16;

// variables used in servoLoop
var pwm;
var nextPulse = 0;
var timer;

var numLoops;

////////////////////////////////////////////////
// loop to cycle through pulse lengths
function servoLoop(loops) {
    numLoops = loops;
    _servoLoop(0);
}
function _servoLoop(loop) {
    if (loop < numLoops) {
        timer = setTimeout(_servoLoop, 500, loop + 1);
    }
    //pwm.setPulseLength(steeringChannel, pulseLengths[nextPulse]);
    for (var i = 0; i < numChannels; i++) {
        pwm.setPulseLength(i, pulseLengths[nextPulse]);
    }
    nextPulse = (nextPulse + 1) % pulseLengths.length;
}

// set-up CTRL-C with graceful shutdown
process.on('SIGINT', function () {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
    pwm.allChannelsOff();
});

// initialize PCA9685 and start loop once initialized
pwm = new Pca9685Driver.Pca9685Driver(options, function startLoop(err) {
    if (err) {
        console.error("Error initializing PCA9685");
        process.exit(-1);
    }
    console.log("Starting servo loop...");

    servoLoop(20);
});
