/**
 * Probabilistic sonar/bell events: D-minor-pentatonic sines with a ×2.01
 * inharmonic partial and long exponential decays, sent mostly into the
 * reverb. Notes bias lower and arrive more sparsely as depth grows.
 */
export interface Pings {
  dry: GainNode
  send: GainNode
  setDepth(depth: number): void
  start(): void
  stop(): void
}

// D minor pentatonic degrees as ratios from D
const RATIOS = [1, 6 / 5, 4 / 3, 3 / 2, 9 / 5]
const D3 = 146.83

export function buildPings(ctx: BaseAudioContext): Pings {
  const dry = ctx.createGain()
  dry.gain.value = 0.3
  const send = ctx.createGain()
  send.gain.value = 0.7

  let depth = 0
  let timer: ReturnType<typeof setTimeout> | null = null
  let running = false

  function ping() {
    const now = ctx.currentTime
    const octave = Math.random() < 0.4 + depth * 0.4 ? 0.5 : 1
    const ratio = RATIOS[Math.floor(Math.random() * RATIOS.length)]!
    const freq = D3 * octave * ratio * (Math.random() < 0.25 ? 2 : 1)

    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, now)
    const peak = 0.12 + Math.random() * 0.08
    const decay = 3.5 + Math.random() * 3.5

    env.gain.exponentialRampToValueAtTime(peak, now + 0.012)
    env.gain.exponentialRampToValueAtTime(0.0001, now + decay)
    env.connect(dry)
    env.connect(send)

    const osc = ctx.createOscillator()
    osc.frequency.value = freq
    const partial = ctx.createOscillator()
    partial.frequency.value = freq * 2.01
    const partialGain = ctx.createGain()
    partialGain.gain.value = 0.25

    // Rare sonar variant: slow downward glide
    if (Math.random() < 0.06) {
      osc.frequency.setValueAtTime(freq * 2.2, now)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, now + 1.4)
    }

    osc.connect(env)
    partial.connect(partialGain)
    partialGain.connect(env)
    osc.start(now)
    partial.start(now)
    osc.stop(now + decay + 0.1)
    partial.stop(now + decay + 0.1)
  }

  function schedule() {
    if (!running) return
    const interval = 2000 + Math.random() * 2500 + depth * 1800
    timer = setTimeout(() => {
      if (Math.random() < 0.45) ping()
      schedule()
    }, interval)
  }

  return {
    dry,
    send,
    setDepth(d) {
      depth = d
    },
    start() {
      if (running) return
      running = true
      schedule()
    },
    stop() {
      running = false
      if (timer) clearTimeout(timer)
      timer = null
    },
  }
}
