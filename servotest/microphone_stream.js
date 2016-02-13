var getUserMedia = require('getusermedia');
var MicrophoneStream = require('microphone-stream');

getUserMedia({ video: false, audio: true }, function(err, stream) {
    var micStream = new MicrophoneStream(stream);

    micStream.on('data', function(chunk) {
        var raw = MicrophoneStream.toRaw(chunk);
    });

    micStream.on('format', function(format) {
        console.log(format);
    });
});
