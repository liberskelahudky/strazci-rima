// Mikroodměny: cinknutí mince přes WebAudio (bez souborů, funguje offline) + krátká vibrace.
let ctx: AudioContext | null = null

function tone(freq: number, start: number, dur: number, gain = 0.18) {
  if (!ctx) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'triangle'
  o.frequency.setValueAtTime(freq, ctx.currentTime + start)
  g.gain.setValueAtTime(0, ctx.currentTime + start)
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.01)
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur)
  o.connect(g).connect(ctx.destination)
  o.start(ctx.currentTime + start)
  o.stop(ctx.currentTime + start + dur + 0.05)
}

export function playCoin(times = 1) {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    for (let i = 0; i < Math.min(times, 5); i++) {
      tone(1318, i * 0.12, 0.12)
      tone(1976, i * 0.12 + 0.06, 0.35)
    }
  } catch {
    /* zvuk není nutný */
  }
  navigator.vibrate?.([30, 40, 30])
}

export function playFanfare() {
  try {
    ctx ??= new AudioContext()
    ;[523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.16, 0.5, 0.15))
  } catch {
    /* zvuk není nutný */
  }
  navigator.vibrate?.([60, 60, 60, 60, 200])
}
