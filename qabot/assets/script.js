let audioElement;
let transcriptions = [];

function initAudioSync(audioFile, transcriptionData) {
    if (!audioFile || !transcriptionData) return;

    audioElement = new Audio(audioFile);
    transcriptions = transcriptionData;

    const container = document.getElementById('lyrics-container');
    container.innerHTML = transcriptions.map((t, index) => `
        <p id="line-${index}" class="transcription ${t.color}">
            ${t.text}
        </p>
    `).join('');

    audioElement.ontimeupdate = syncLyrics;
    audioElement.play();
}

function syncLyrics() {
    const currentTime = audioElement.currentTime;

    transcriptions.forEach((t, index) => {
        const startSeconds = timeToSeconds(t.start);
        const endSeconds = timeToSeconds(t.end);
        const lineElement = document.getElementById(`line-${index}`);

        if (currentTime >= startSeconds && currentTime < endSeconds) {
            lineElement.classList.add('active');
            lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            lineElement.classList.remove('active');
        }
    });
}

function timeToSeconds(time) {
    const parts = time.split(':').map(parseFloat);
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
}
