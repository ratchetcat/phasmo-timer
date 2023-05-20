let countdown;
const timerDisplay = document.querySelector('#timer');
const startButton = document.querySelector('#start');
const resetButton = document.querySelector('#reset');
const beep = document.querySelector('#beep');
const startInterval = 180;
const intervals = [
    { seconds: 10, name: "Test", audioFile: "test.wav" },
    { seconds: 60, name: "Demon", audioFile: "demon.wav" },
    { seconds: 90, name: "Normal", audioFile: "normal.wav" },
    { seconds: 170, name: "Spirit", audioFile: "spirit.wav" }
];

timerDisplay.textContent = startInterval;

function timer(seconds) {
    clearInterval(countdown);

    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);

    countdown = setInterval(() => {
        const elapsedSeconds = Math.round((Date.now() - then) / 1000) + startInterval;
        console.log(elapsedSeconds);

        const secondsLeft = Math.round((then - Date.now()) / 1000);

        const interval = intervals.find(i => i.seconds === elapsedSeconds);
        if(interval) {
            document.body.style.background = '#ff0000'; // change color

            timerDisplay.textContent = interval.name;

            const audio = new Audio(interval.audioFile);
            audio.play(); // play sound

            setTimeout(() => document.body.style.background = '', 1000); // revert color after 1 sec
        }

        if(secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }

        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    timerDisplay.textContent = seconds;
}

startButton.addEventListener('click', () => {
    // Play a silent audio to unlock audio playback
    const unlockAudio = new Audio();
    unlockAudio.play();

    timer(startInterval)
});
resetButton.addEventListener('click', () => {
    clearInterval(countdown);
    timerDisplay.textContent = startInterval;
});
