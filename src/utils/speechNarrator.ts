/**
 * Speech Narrator Utility for Komputer Ceria
 * Uses Web Speech API with Indonesian (id-ID) voice.
 */

let currentUtterance: SpeechSynthesisUtterance | null = null;

export const speakText = (
  text: string,
  onEnd?: () => void,
  rate = 0.95,
  pitch = 1.05
) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean HTML tags from text
  const cleanText = text.replace(/<[^>]*>?/gm, '').trim();
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'id-ID';
  utterance.rate = rate;
  utterance.pitch = pitch;

  // Try to find an Indonesian voice if available
  const voices = window.speechSynthesis.getVoices();
  const idVoice = voices.find(
    (v) => v.lang.includes('id') || v.lang.includes('ID') || v.name.toLowerCase().includes('indonesia')
  );
  if (idVoice) {
    utterance.voice = idVoice;
  }

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
};

export const isSpeaking = (): boolean => {
  return 'speechSynthesis' in window && window.speechSynthesis.speaking;
};
