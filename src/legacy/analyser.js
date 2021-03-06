var Analyser = require('audio-analyser');
//var Generator = require('audio-generator');

var analyser = new Analyser({
    // Magnitude diapasone, in dB 
    minDecibels: -100,
    maxDecibels: -30,

    // Number of time samples to transform to frequency 
    fftSize: 1024,

    // Number of frequencies, twice less than fftSize 
    frequencyBinCount: 1024/2,

    // Smoothing, or the priority of the old data over the new data 
    smoothingTimeConstant: 0.2,

    // Number of channel to analyse 
    channel: 0,

    // Size of time data to buffer 
    bufferSize: 44100,

    // Windowing function for fft, https://github.com/scijs/window-functions 
    applyWindow: function (sampleNumber, totalSamples) {
        console.log(sampleNumber);
        console.log(totalSamples);
    }

    //...pcm-stream params, if required 
});


//AnalyserNode methods 

// Copies the current frequency data into a Float32Array array passed into it. 
/*process.stdin.resume();
process.stdin.on('data', function(chunk) {
    console.log(chunk);
    var data = analyser.getFloatFrequencyData(chunk);
    console.log(data);
});*/

// Copies the current frequency data into a Uint8Array passed into it. 
process.stdin.resume();
process.stdin.on('data', function(chunk) {
    var len = chunk.length;
    //console.log(chunk.length);

    /*for (var i = 0; i < 8; i++) {
        console.log(chunk[len/8 + i]);
    }*/
    var count = 0;
    var count_all = 0;
    for (var i = 0; i < len; i++) {
        //console.log(chunk[i]);
        count_all++;
        if (255 <= chunk[i]) {
            count++;
        }
    }
    console.log(count / count_all);

    //console.log(chunk.length);
    //console.log(chunk);
    /*var arr = [];
    for (var i = 0, l = chunk.length; i < l; i++) {
        arr[i] = chunk[i];
    }*/
    var data = analyser.getByteFrequencyData(chunk);
    //console.log(data.length);
    //console.log(data[0]);
    //console.log(data[1]);

    // data[1] is arround 0 (254, 255, 0, or 1) then stop
    /*if (data[1] == 254 || data[1] == 255 || data[1] == 0 || data[1] == 1) {
        console.log('stop');
    } else {
        console.log('play');
    }*/
});


//Can be used both as a sink or pass-through 
//Generator().pipe(analyser);
