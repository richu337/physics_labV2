export function speakText(text: string, onEnd?: () => void): void {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported')
    return
  }

  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = 1.0
  utterance.pitch = 1.0
  utterance.volume = 1.0

  const voices = window.speechSynthesis.getVoices()
  const englishVoice = voices.find(
    (v) => v.lang.startsWith('en') && v.name.includes('Google')
  ) || voices.find((v) => v.lang.startsWith('en')) || voices[0]
  if (englishVoice) utterance.voice = englishVoice

  if (onEnd) {
    utterance.onend = onEnd
  }

  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

export function isSpeaking(): boolean {
  return 'speechSynthesis' in window && window.speechSynthesis.speaking
}

export function startListening(
  onResult: (text: string) => void,
  onError?: (error: string) => void,
  lang: string = 'en-US'
): SpeechRecognitionInstance | null {
  const SR =
    window.SpeechRecognition || window.webkitSpeechRecognition

  if (!SR) {
    onError?.('Speech recognition not supported in this browser')
    return null
  }

  const recognition = new SR()
  recognition.continuous = false
  recognition.interimResults = false
  recognition.lang = lang

  recognition.onresult = (event: Event) => {
    const e = event as SpeechRecognitionEvent
    const transcript = e.results[0][0].transcript
    onResult(transcript)
  }

  recognition.onerror = (event: Event) => {
    const e = event as SpeechRecognitionErrorEvent
    onError?.(e.error)
  }

  recognition.start()
  return recognition
}

export function stopListening(recognition: SpeechRecognitionInstance | null): void {
  if (recognition) {
    try {
      recognition.stop()
    } catch {
      // already stopped
    }
  }
}
