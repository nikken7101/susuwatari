var Spectrum = require('audio-spectrum');
var Generator = require('audio-generator');
var isBrowser = require('is-browser');
 
 
//create spectrum plotter 
var plotter = new Spectrum({
            //Frequency diapasone 
            minFrequency:  20,
                maxFrequency:  20000,
                 
                    //Magnitude diapasone, in dB 
                    minDecibels:  -90,
                        maxDecibels:  -0,
                         
                            //FFT transform size 
                            fftSize:  1024,
                                smoothingTimeConstant:  0.2
                                 
                                    //...also pcm-format and rendering properties, see pcm-util and audio-render 
                                });
 
//visualise, depending on the environment 
if (isBrowser) {
        document.body.appendChild(plotter.element);
}
else {
        plotter.on('render', function (canvas) {
                        process.stdout.write(canvas._canvas.frame());
                            });
}
 
//send audio-stream to the plitter 
Generator(function (time) {
            return Math.sin(Math.PI * 2 * 440 * time);
            }).pipe(plotter);
