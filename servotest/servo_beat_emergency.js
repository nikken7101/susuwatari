// servo_beat.js
//   classify bpm and move servo!!!!

var i2cBus = require('i2c-bus');
var Pca9685Driver = require('pca9685');

// Three drivers
var numDrivers = 3;

var options = [];
for (var d = 0; d < numDrivers; d++) {
    options[d] = {
        i2c: i2cBus.openSync(1),
        address: 0x40 + d,
        frequency: 50,
        debug: false
    }
}

// [function]
// Degree to pulse-length
function deg2pulse(degree) {
    return Math.round(1900.0 / 180.0 * degree + 1450);
}

function checkHairColor(d, i) {
    if (d == 0 || d == 2) {
        // 0x40 and 0x42
        switch (i) {
            case 0:
            case 1:
                return "brown";
            case 2:
            case 3:
                return "gold";
            case 4:
            case 5:
                return "brown";
            case 6:
            case 7:
                return "brown";
            case 8:
            case 9:
                return "brown";
            case 10:
            case 11:
                return "brown";
            case 12:
            case 13:
                return "gold";
            case 14:
            case 15:
                return "brown";
        }
    } else {
        // 0x41
        switch (i) {
            case 0:
            case 1:
                return "brown";
            case 2:
            case 3:
                return "gold";
            case 4:
            case 5:
                return "brown";
            case 6:
            case 7:
                return "gold";
            case 8:
            case 9:
                return "brown";
            case 10:
            case 11:
                return "gold";
            case 12:
            case 13:
                return "brown";
        }
    }
}


function checkGuuki(d, i) {
    if (d == 0) {
        // 0x40
        switch (i) {
            case 0:
            case 1:
                return "guu";
            case 2:
            case 3:
                return "guu";
            case 4:
            case 5:
                return "guu";
            case 6:
            case 7:
                return "ki";
            case 8:
            case 9:
                return "ki";
            case 10:
            case 11:
                return "guu";
            case 12:
            case 13:
                return "ki";
            case 14:
            case 15:
                return "guu";
        }
    } else if (d == 1) {
        // 0x41
        switch (i) {
            case 0:
            case 1:
                return "ki";
            case 2:
            case 3:
                return "guu";
            case 4:
            case 5:
                return "ki";
            case 6:
            case 7:
                return "ki";
            case 8:
            case 9:
                return "guu";
            case 10:
            case 11:
                return "guu";
            case 12:
            case 13:
                return "guu";
        }
    } else {
        // 0x42
        switch (i) {
            case 0:
            case 1:
                return "ki";
            case 2:
            case 3:
                return "ki";
            case 4:
            case 5:
                return "ki";
            case 6:
            case 7:
                return "guu";
            case 8:
            case 9:
                return "guu";
            case 10:
            case 11:
                return "ki";
            case 12:
            case 13:
                return "guu";
            case 14:
            case 15:
                return "ki";
        }
    }
}

// pulse lengths in microseconds (theoretically, 1.5 ms
// is the middle of a typical servo's range)
// position "-90": 500
// position "0"  : 1450
// position "90" : 2400
//var pulseLengths = [deg2pulse(-45), deg2pulse(0), deg2pulse(45), deg2pulse(0)];
//var pulseLengths = [deg2pulse(-20), deg2pulse(0), deg2pulse(-20), deg2pulse(0)];

// for Douji
var pulseLengthsDown = [deg2pulse(-30), deg2pulse(0), deg2pulse(30), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0)];
var pulseLengthsUp = [deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(-30), deg2pulse(0), deg2pulse(30), deg2pulse(0)];

// for HairColor
//var pulseLengthsBrownDown = [deg2pulse(-30), deg2pulse(0), deg2pulse(30), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0)];
//var pulseLengthsBrownUp = [deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(-30), deg2pulse(0), deg2pulse(30), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0)];
//var pulseLengthsGoldDown = [deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(-30), deg2pulse(0), deg2pulse(30), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0)];
//[deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(-30), deg2pulse(0), deg2pulse(30), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0)];var pulseLengthsGoldUp = [deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(-30), deg2pulse(0), deg2pulse(30), deg2pulse(0)];
var pulseLengthsBrownDown = [deg2pulse(-30), deg2pulse(0), deg2pulse(30), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0)];
var pulseLengthsBrownUp = [deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(-30), deg2pulse(0), deg2pulse(30), deg2pulse(0)];
var pulseLengthsGoldDown = [deg2pulse(30), deg2pulse(0), deg2pulse(-30), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0)];
var pulseLengthsGoldUp = [deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(30), deg2pulse(0), deg2pulse(-30), deg2pulse(0)];

//for Guuki
var pulseLengthsGuuDown = [deg2pulse(-30), deg2pulse(0), deg2pulse(30), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0)];
var pulseLengthsGuuUp = [deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(-30), deg2pulse(0), deg2pulse(30), deg2pulse(0)];
var pulseLengthsKiDown = [deg2pulse(30), deg2pulse(0), deg2pulse(-30), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0)];
var pulseLengthsKiUp = [deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(0), deg2pulse(30), deg2pulse(0), deg2pulse(-30), deg2pulse(0)];


var numChannels = [16, 14, 16];

// variables used in servoLoop
var pwm = [];
var nextPulse = 0;
var timer;

// BPM and interval
var bpm;
var interval;

function calc_interval() {
    //interval = bpm / 60.0 / 4.0 * 1000;
    interval = (1.0 / bpm) * 60.0 * 1000;
    console.log(interval);
}

////////////////////////////////
// douji
function servoLoopDouji() {
    if (playing == true) {
        timer = setTimeout(servoLoopDouji, interval);
    }
    for (var d = 0; d < numDrivers; d++) {
        for (var i = 0; i < numChannels[d]; i++) {
            if (i % 2 == 0) {
                pwm[d].setPulseLength(i, pulseLengthsDown[nextPulse]);
            } else {
                pwm[d].setPulseLength(i, pulseLengthsUp[nextPulse]);
            }
        }
    }
    nextPulse = (nextPulse + 1) % pulseLengthsDown.length;
}

// wave
function getPosFromLeft(driver, channel) {
    var p = [];
    p[0] = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2];
    p[1] = [3, 3, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4];
    p[2] = [5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 6, 6, 7, 7];
    return p[driver][channel];
}
function servoLoopWave(driver, channel) {
    if (playing == true) {
        timer = setTimeout(servoLoopNext, interval);
    }
    for (var d = 0; d < numDrivers; d++) {
        for (var i = 0; i < numChannels[d]; i++) {
            if (i % 2 == 0) {
                setTimeout(function (_i, _d) {
                    pwm[_d].setPulseLength(_i, pulseLengthsDown[nextPulse]);
                }, getPosFromLeft(d, i) * 50, i, d);
            } else {
                setTimeout(function (_i, _d) {
                    pwm[_d].setPulseLength(_i, pulseLengthsUp[nextPulse]);
                }, getPosFromLeft(d, i) * 50, i, d);
            }
        }
    }
    if ((nextPulse + 1) < pulseLengthsDown.length) {
        nextPulse = (nextPulse + 1);
    } else {
        guuki = true;
        nextPulse = 0;
    }
    // nextPulse = (nextPulse + 1) % pulseLengthsDown.length;
}

// HairColor
function servoLoopHairColor() {
    if (playing == true) {
        timer = setTimeout(servoLoopHairColor, interval);
    }
    for (var d = 0; d < numDrivers; d++) {
        for (var i = 0; i < numChannels[d]; i++) {
            if (checkHairColor(d, i) == "brown") {
                if (i % 2 == 0) {
                    pwm[d].setPulseLength(i, pulseLengthsBrownDown[nextPulse]);
                } else {
                    pwm[d].setPulseLength(i, pulseLengthsBrownUp[nextPulse]);
                }
            } else {
                if (i % 2 == 0) {
                    pwm[d].setPulseLength(i, pulseLengthsGoldDown[nextPulse]);
                } else {
                    pwm[d].setPulseLength(i, pulseLengthsGoldUp[nextPulse]);
                }
            }
        }
    }
    nextPulse = (nextPulse + 1) % pulseLengthsBrownDown.length;
}

// guuki
function servoLoopGuuki() {
    if (playing == true) {
        timer = setTimeout(servoLoopNext, interval);
    }
    for (var d = 0; d < numDrivers; d++) {
        for (var i = 0; i < numChannels[d]; i++) {
            if (checkGuuki(d, i) == "guu") {
                if (i % 2 == 0) {
                    pwm[d].setPulseLength(i, pulseLengthsGuuDown[nextPulse]);
                } else {
                    pwm[d].setPulseLength(i, pulseLengthsGuuUp[nextPulse]);
                }
            } else {
                if (i % 2 == 0) {
                    pwm[d].setPulseLength(i, pulseLengthsKiDown[nextPulse]);
                } else {
                    pwm[d].setPulseLength(i, pulseLengthsKiUp[nextPulse]);
                }
            }
        }
    }
    if ((nextPulse + 1) < pulseLengthsGuuDown.length) {
        nextPulse = (nextPulse + 1);
    } else {
        guuki = false;
        nextPulse = 0;
    }
}

var guuki = true;

// next
function servoLoopNext() {
    if (guuki) {
        servoLoopGuuki();
    } else {
        servoLoopWave();
    }
}

// reset
function servoReset() {
    for (var d = 0; d < numDrivers; d++) {
        for (var i = 0; i < numChannels[d]; i++) {
            pwm[d].setPulseLength(i, deg2pulse(0));
        }
    }
}

// set-up CTRL-C with graceful shutdown
process.on('SIGINT', function () {
    servoReset();
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    if (timer) {
        clearTimeout(timer);
        timer = null;
    }
    for (var d = 0; d < numDrivers; d++) {
        pwm[d].allChannelsOff();
    }
});

// initialize PCA9685 and start loop once initialized
for (var d = 0; d < numDrivers; d++) {
    pwm[d] = new Pca9685Driver.Pca9685Driver(options[d], function startLoop(err) {
        if (err) {
            console.error("Error initializing PCA9685");
            process.exit(-1);
        }
        console.log("Starting servo loop...");
        //servoLoopDouji();
    });
}


////////////////////////////////
// beat !!

var count_arr = [];
var count_all_arr = [];
var times = 0;
var playing = false;


var N_SUM = 20;

process.stdin.resume();
process.stdin.on('data', function (chunk) {
    var count = 0;
    var count_all = 0;

    for (var i = 0, l = chunk.length; i < l; i++) {
        count_all++;
        if (255 <= chunk[i]) {
            count++;
        }
    }
    count_arr[times] = count;
    count_all_arr[times] = count_all;

    if (N_SUM < times) {
        var sum = 0;
        var sum_all = 0;
        for (var i = 0; i < N_SUM; i++) {
            sum += count_arr[times - i];
            sum_all += count_all_arr[times - i];
        }

        var peaks_ratio = sum / sum_all;
        if (peaks_ratio < 0.00001) {
            console.log('stop (' + peaks_ratio + ')');
            bpm = 140;
            calc_interval();
            if (playing == false) {
                playing = true;
                //servoLoopDouji();
                servoLoopNext();
                //servoLoopHairColor();
                //servoLoopGuuki();
                //servoLoopWave();
            }
            //playing = false;
            //servoReset();
        } else if (peaks_ratio < 0.08) {
            console.log('beat80 (' + peaks_ratio + ')');
            if (bpm != 80) {
                bpm = 80;
                calc_interval();
                if (playing == false) {
                    playing = true;
                    //servoLoopDouji();
                    servoLoopNext();
                    //servoLoopHairColor();
                    //servoLoopGuuki();
                    //servoLoopWave();
                }
            }
        } else {
            console.log('beat140 (' + peaks_ratio + ')');
            if (bpm != 140) {
                bpm = 140;
                calc_interval();
                if (playing == false) {
                    playing = true;
                    //servoLoopDouji();
                    servoLoopNext();
                    //servoLoopHairColor();
                    //servoLoopGuuki();
                    //servoLoopWave();
                }
                //servoLoopDouji();
            }
        }
    }

    times++;
});
