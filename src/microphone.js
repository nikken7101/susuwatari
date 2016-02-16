var mic = require('microphone');

mic.startCapture();
mic.audioStream.on('data', function(data) {
    process.stdout.write(data);
});
