let voices = [];

window.speechSynthesis.onvoiceschanged = () => {
  voices = window.speechSynthesis.getVoices();
};

function getFemaleVoice() {
  voices = window.speechSynthesis.getVoices();
  return voices.find(v => v.name.toLowerCase().includes("female") || v.name.toLowerCase().includes("en-in")) || null;
}

function speakText(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = getFemaleVoice();
  utterance.rate = parseFloat(document.getElementById("rate").value);
  utterance.pitch = parseFloat(document.getElementById("pitch").value);
  utterance.volume = parseFloat(document.getElementById("volume").value);
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

document.getElementById("read").addEventListener("click", () => {
  chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    chrome.scripting.executeScript({
      target: {tabId: tabs[0].id},
      func: () => window.getSelection().toString()
    }, (results) => {
      const selectedText = results[0].result.trim();
      if (!selectedText) {
        alert("Please select some text first.");
        return;
      }
      speakText(selectedText);
    });
  });
});

document.getElementById("pause").addEventListener("click", () => speechSynthesis.pause());
document.getElementById("resume").addEventListener("click", () => speechSynthesis.resume());
document.getElementById("stop").addEventListener("click", () => speechSynthesis.cancel());

// ensure voices are loaded on popup open
window.onload = () => {
  speechSynthesis.getVoices();
  setTimeout(() => speechSynthesis.getVoices(), 100);
};
