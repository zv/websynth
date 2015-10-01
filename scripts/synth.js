var keyboard = new QwertyHancock({
     id: 'keyboard',
     width: 600,
     height: 150,
     octaves: 3
});

var context = new AudioContext(),
    masterVolume = context.createGain(),
    oscillators = {};

masterVolume.gain.value = 0.2;
 
masterVolume.connect(context.destination);

function frequencyModulation (note, frequency, ratio, index) {
    var osc = context.createOscillator(),   // A1 = a1*cos(w1*t), carrier oscillator
        osc2 = context.createOscillator();  // A2 = a2*cos(w2*t), modulating oscillator

    // FM is A1 = cos((w1 + a2*cos(w2t))t) 

    osc.frequency.value = osc2.frequency.value * index;
    osc.type = 'sine';
    // osc.detune.value = -10;

    osc2.frequency.value = frequency;
    osc2.type = 'sine';
    // osc2.detune.value = 10;

    osc.connect(masterVolume);

    masterVolume.connect(context.destination);

    oscillators[frequency] = [osc, osc2];

    osc.start(context.currentTime);
    osc2.start(context.currentTime);
};

keyboard.keyDown = generateTone;

keyboard.keyUp = function (note, frequency) {
    oscillators[frequency].forEach(function (oscillator) {
        oscillator.stop(context.currentTime);
    });
};
