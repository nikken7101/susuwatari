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
    var data = analyser.getFloatFrequencyData(chunk);
    console.log(data);
});*/

// Copies the current frequency data into a Uint8Array passed into it. 
process.stdin.resume();
process.stdin.on('data', function(chunk) {
    var data = analyser.getByteFrequencyData(chunk);
    console.log(data);
});

// Copies the current waveform, or time-domain data into a Float32Array array passed into it. 
//analyser.getFloatTimeDomainData(arr);

// Copies the current waveform, or time-domain data into a Uint8Array passed into it. 
//analyser.getByteTimeDomainData(arr);


//Shortcut methods 

//return array with frequency data in decibels of size <= fftSize 
//analyser.getFrequencyData(size);

//return array with time data of size <= self.bufferSize (way more than fftSize) 
//analyser.getTimeData(size);


//Can be used both as a sink or pass-through 
//Generator().pipe(analyser);
