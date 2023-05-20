let counter;
const timerDisplay = document.querySelector('#timer');
const startButton = document.querySelector('#start');
const resetButton = document.querySelector('#reset');
const beep = document.querySelector('#beep');
const targetInterval = 180;
const intervals = [
    { seconds: 10, name: "Test", audioFile: "test.wav" },
    { seconds: 60, name: "Demon", audioFile: "demon.wav" },
    { seconds: 90, name: "Normal", audioFile: "normal.wav" },
    { seconds: 170, name: "Spirit", audioFile: "spirit.wav" }
];

// set initial count
displayCount(0);

function timer() {
    clearInterval(counter);

    const then = Date.now();
    console.log(then);

    counter = setInterval(() => {
        const elapsedSeconds = Math.round((Date.now() - then ) / 1000);
        console.log(elapsedSeconds);

        // check for matching interval to alert / play sound
        const interval = intervals.find(i => i.seconds === elapsedSeconds);
        if(interval) {
            document.body.style.background = '#ff0000'; // change color

            // display interval name
            displayCount(interval.name);

            // play audio
            const audio = new Audio(interval.audioFile);
            audio.play(); // play sound

            setTimeout(() => {
                document.body.style.background = ''
            }, 1000); // revert color after 1 sec
        }

        // check whether elapsedSeconds is equal to or greater than targetInterval
        if(elapsedSeconds >= targetInterval) {
            clearInterval(counter);
            return;
        }

        // display for each tick
        displayCount(elapsedSeconds);
    }, 1000);
}

function displayCount(seconds) {
    timerDisplay.textContent = seconds;
}

startButton.addEventListener('click', () => {
    // Play a silent audio to unlock audio playback
    const unlockAudio = new Audio();
    unlockAudio.play();

    timer(0);
});

resetButton.addEventListener('click', () => {
    clearInterval(counter);
    timerDisplay.textContent = 0;
});
