// utility code to set up cross-browser AudioContext
// from https://curtisrobinson.medium.com/how-to-auto-play-audio-in-safari-with-javascript-21d50b0a2765
let audioContext = new (window.AudioContext || window.webkitAudioContext)()
function loadSound(filename) {
    let sound = {volume: 1, audioBuffer: null}

    let ajax = new XMLHttpRequest()
    ajax.open("GET", filename, true)
    ajax.responseType = "arraybuffer"
    ajax.onload = function() {
        audioContext.decodeAudioData
        (
            ajax.response,
            function(buffer) {
                sound.audioBuffer = buffer
            },
            function(error) {
                debugger
            }
        )
    }

    ajax.onerror = function() {
        debugger
    }

    ajax.send()

    return sound
}
function playSound(sound) {
    if(!sound.audioBuffer)
        return false

    let source = audioContext.createBufferSource()
    if(!source)
        return false

    source.buffer = sound.audioBuffer
    if(!source.start)
        source.start = source.noteOn

    if(!source.start)
        return false
    let gainNode = audioContext.createGain()
    gainNode.gain.value = sound.volume
    source.connect(gainNode)
    gainNode.connect(audioContext.destination)

    source.start(0)

    sound.gainNode = gainNode
    return true
}
function stopSound(sound) {
    if(sound.gainNode)
        sound.gainNode.gain.value = 0
}
function setSoundVolume(sound, volume) {
    sound.volume = volume

    if(sound.gainNode)
        sound.gainNode.gain.value = volume
}

let counter;
const timerDisplay = document.querySelector('#timer');
const startButton = document.querySelector('#start');
const resetButton = document.querySelector('#reset');
const targetInterval = 180;
const intervals = [
    { seconds: 10, name: "Test", audioFile: loadSound("test.wav") },
    { seconds: 60, name: "Demon", audioFile: loadSound("demon.wav") },
    { seconds: 90, name: "Normal", audioFile: loadSound("normal.wav") },
    { seconds: 170, name: "Spirit", audioFile: loadSound("spirit.wav") }
];

// set unlockSound and volume
const unlockSound = loadSound("test.wav");
unlockSound.volume = 0;

// set initial count
displayCount(0);

function timer() {
    clearInterval(counter);

    const then = Date.now();

    counter = setInterval(() => {
        const elapsedSeconds = Math.round((Date.now() - then ) / 1000);

        // display for each tick
        displayCount(elapsedSeconds);

        // check for matching interval to alert / play sound
        const interval = intervals.find(i => i.seconds === elapsedSeconds);
        if(interval) {
            document.body.style.background = '#ff0000'; // change color

            // display interval name
            displayCount(interval.name);

            playSound(interval.audioFile);

            setTimeout(() => {
                document.body.style.background = ''
            }, 1000); // revert color after 1 sec
        }

        // check whether elapsedSeconds is equal to or greater than targetInterval
        if(elapsedSeconds >= targetInterval) {
            clearInterval(counter);
        }
    }, 1000);
}

function displayCount(seconds) {
    timerDisplay.textContent = seconds;
}

// startButton unlocks AudioContext and starts timer
startButton.addEventListener('click', () => {
    playSound(unlockSound)
    timer(0);
});

resetButton.addEventListener('click', () => {
    clearInterval(counter);
    timerDisplay.textContent = 0;
});
