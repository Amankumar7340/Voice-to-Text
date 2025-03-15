const startBtn = document.getElementById('start-btn');
const transcriptBox = document.getElementById('transcript');
const inputLang = document.getElementById('input-lang');
const savedConversations = document.getElementById('saved-conversations');

let recognition;
let currentTranscript = '';

// Initialize Speech Recognition
if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
} else if ('SpeechRecognition' in window) {
    recognition = new SpeechRecognition();
} else {
    transcriptBox.textContent = "Speech recognition not supported in this browser.";
    startBtn.disabled = true;
}

recognition.continuous = true;
recognition.interimResults = true;

// Start/Stop Listening
startBtn.addEventListener('click', () => {
    if (startBtn.textContent === "Start Listening") {
        recognition.lang = inputLang.value; // Set input language
        recognition.start();
        startBtn.textContent = "Stop Listening";
        startBtn.style.backgroundColor = "#ff4b4b";
        currentTranscript = ''; // Reset current transcript
    } else {
        recognition.stop();
        startBtn.textContent = "Start Listening";
        startBtn.style.backgroundColor = "#2575fc";

        // Save the current transcript as a new conversation
        if (currentTranscript.trim() !== '') {
            saveConversation(currentTranscript);
        }
    }
});

// Handle Speech Recognition Results
recognition.onresult = (event) => {
    currentTranscript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
    }
    transcriptBox.textContent = currentTranscript;
};

// Save Conversation and Create a New Section
function saveConversation(transcript) {
    const conversationSection = document.createElement('div');
    conversationSection.className = 'conversation-section';

    const conversationText = document.createElement('div');
    conversationText.className = 'conversation-text';
    conversationText.textContent = transcript;

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-btn';
    copyButton.textContent = 'Copy';
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(transcript).then(() => {
            alert('Text copied to clipboard!');
        }).catch(() => {
            alert('Failed to copy text.');
        });
    });

    conversationSection.appendChild(conversationText);
    conversationSection.appendChild(copyButton);
    savedConversations.appendChild(conversationSection);
}

// Handle Errors
recognition.onerror = (event) => {
    transcriptBox.textContent = `Error: ${event.error}`;
};

// Stop Recognition When Done
recognition.onend = () => {
    if (startBtn.textContent === "Stop Listening") {
        startBtn.textContent = "Start Listening";
        startBtn.style.backgroundColor = "#2575fc";

        // Save the current transcript as a new conversation
        if (currentTranscript.trim() !== '') {
            saveConversation(currentTranscript);
        }
    }
};