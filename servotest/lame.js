var lame = require('lame');

var encoder = new lame.Encoder({
    channels: 2,
    bitDepth: 16,
    sampleRate: 44100,

    bitRate: 128,
    outSampleRate: 22050,
    mode: lame.STEREO
});

process.stdin.pipe(encoder);
encoder.pipe(process.stdout);
