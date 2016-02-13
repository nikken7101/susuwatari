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
        address: 0x40 + 1,
        frequency: 50,
        debug: false
    }
}

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
var pulseLengths = [deg2pulse(-45), deg2pulse(0), deg2pulse(45), deg2pulse(0)];

var numChannels = [16, 14, 16];

// variables used in servoLoop
var pwm = [];
var nextPulse = 0;
var timer;

// BPM and interval
var bpm;
var interval;
function calc_interval() {
    interval = bpm / 60.0 / 4.0 * 1000;
    console.log(interval);
}

////////////////////////////////
// douji
function servoLoopDouji() {
    timer = setTimeout(servoLoopDouji, interval);
    for (var d = 0; d < numDrivers; d++) {
        for (var i = 0; i < numChannels[d]; i++) {
            pwm[d].setPulseLength(i, pulseLengths[nextPulse]);
        }
        nextPulse = (nextPulse + 1) % pulseLengths.length;
    }
}

// set-up CTRL-C with graceful shutdown
process.on('SIGINT', function () {
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
var prev_bpm = -1;

var N_SUM = 20;

process.stdin.resume();
process.stdin.on('data', function(chunk) {
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
        } else if (peaks_ratio < 0.08) {
            console.log('beat80 (' + peaks_ratio + ')');
            if (prev_bpm != bpm) {
                bpm = 80;
                prev_bpm = bpm;
                calc_interval();
                servoLoopDouji();
            }
        } else {
            console.log('beat140 (' + peaks_ratio + ')');
            if (prev_bpm != bpm) {
                bpm = 140;
                prev_bpm = bpm;
                calc_interval();
                servoLoopDouji();
            }
        }
    }

    times++;
});
