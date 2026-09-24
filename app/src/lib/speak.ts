// Předčítání pro sedmileté průzkumníky (Web Speech API, česky).
export const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

export function speak(text: string) {
  if (!canSpeak) return
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'cs-CZ'
  u.rate = 0.95
  const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith('cs'))
  if (voice) u.voice = voice
  synth.speak(u)
}

export function stopSpeaking() {
  if (canSpeak) window.speechSynthesis.cancel()
}
