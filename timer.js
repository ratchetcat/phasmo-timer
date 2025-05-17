'use strict';

// utility code to set up cross-browser AudioContext
// from https://curtisrobinson.medium.com/how-to-auto-play-audio-in-safari-with-javascript-21d50b0a2765
let audioContext = new (window.AudioContext || window.webkitAudioContext)()

/**
 * Loads a sound file and returns a sound object
 * @param {string} filename - Path to the audio file
 * @return {Object} Sound object with volume and audioBuffer properties
 */
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
                console.error('Error setting audio buffer:', error);
            }
        )
    }

    ajax.onerror = function(error) {
        console.error('Error loading sound file:', error);
    }

    ajax.send()

    return sound
}

function playSound(sound) {
    if(!sound.audioBuffer) {
        console.warn("Attempted to play sound that hasn't loaded yet");
        return false;
    }

    try {
        let source = audioContext.createBufferSource();
        if(!source) {
            console.error("Failed to create audio source");
            return false;
        }

        source.buffer = sound.audioBuffer;
        if(!source.start)
            source.start = source.noteOn;

        if(!source.start) {
            console.error("No start method available on audio source");
            return false;
        }

        let gainNode = audioContext.createGain();
        gainNode.gain.value = sound.volume;
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        source.start(0);

        sound.gainNode = gainNode;
        return true;
    } catch (error) {
        console.error("Error playing sound:", error);
        return false;
    }
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

let timerIntervalId;
const timerDisplay = document.querySelector('#timer');
const startButton = document.querySelector('#start');
const resetButton = document.querySelector('#reset');
const targetInterval = 5;

// define intervals and sounds to play at each interval
const intervals = [
    { seconds: 10, name: "Test", audioFile: loadSound("test.wav") },
    { seconds: 60, name: "Demon", audioFile: loadSound("demon.wav") },
    { seconds: 90, name: "Normal", audioFile: loadSound("normal.wav") },
    { seconds: 170, name: "Spirit", audioFile: loadSound("spirit.wav") }
];

// set unlockSound and volume
const unlockSound = loadSound("test.wav");
unlockSound.volume = 0;

/**
 * Starts a timer that updates every second; on each tick, compares tick value to configured intervals and
 * plays sound / shows name if applicable
 * The timer calculates the elapsed time in seconds and triggers updates or notifications accordingly.
 *
 * @return {void} Does not return a value.
 */
function startTimer() {
    clearInterval(timerIntervalId);

    const then = Date.now();

    timerIntervalId = setInterval(() => {
        const elapsedSeconds = Math.round((Date.now() - then ) / 1000);

        // display for each tick
        updateTimerDisplay(elapsedSeconds);

        checkAndNotifyInterval(elapsedSeconds);

    }, 1000);
}

function updateTimerDisplay(seconds) {
    timerDisplay.textContent = seconds;
}

/**
 * Checks if the given elapsed time matches an interval and triggers notifications if a match is found.
 *
 * @param {number} elapsedSeconds - The number of seconds that have elapsed.
 * @return {void} This function does not return a value.
 */
function checkAndNotifyInterval(elapsedSeconds) {
    const interval = intervals.find(i => i.seconds === elapsedSeconds);
    if (interval) {
        document.body.style.background = '#ff0000';
        updateTimerDisplay(interval.name);
        playSound(interval.audioFile);

        setTimeout(() => {
            document.body.style.background = '';
        }, 1000);
    } else {
        if(elapsedSeconds >= targetInterval) {
            clearInterval(timerIntervalId);
            updateTimerDisplay(0);
        }
    }
}

/**
 * Initializes event listeners for start and reset buttons.
 * The start button listener triggers the playSound function with an unlock sound
 * and starts the timer with an initial value of 0.
 * The reset button listener stops the active timer and resets the timer display to 0.
 *
 * @return {void} This method does not return a value.
 */
function initializeEventListeners() {
    startButton.addEventListener('click', () => {
        playSound(unlockSound);
        startTimer(0);
    });

    resetButton.addEventListener('click', () => {
        clearInterval(timerIntervalId);
        updateTimerDisplay(0);
    });
}

initializeEventListeners();

updateTimerDisplay(0);