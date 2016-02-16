import pyaudio
import sys
import time
import wave

if __name__ == '__main__':
    chunk = 1024
    FORMAT = pyaudio.paInt16
    CHANNELS = 1

    RATE = 44100
    RECORD_SECONDS = 180

    p = pyaudio.PyAudio()

    input_device_index = 0
    stream = p.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=chunk);
    all = []
    for i in range(0, RATE / chunk * RECORD_SECONDS):
        data = stream.read(chunk)
        all.append(data)

    stream.close()
    p.terminate()
