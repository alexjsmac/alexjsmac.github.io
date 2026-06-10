/**
 * A slow detuned drone on D2 — root, two near-unison voices a few cents
 * off, and a fifth at half level. A very slow LFO leans the detune so the
 * chord never quite sits still. Gains weight as you descend.
 */
export interface Drone {
  output: GainNode
  send: GainNode
  /** 0 surface .. 1 abyss */
  setDepth(depth: number, time: number): void
}

const D2 = 73.42

export function buildDrone(ctx: BaseAudioContext): Drone {
  const output = ctx.createGain()
  output.gain.value = 0.05
  const send = ctx.createGain()
  send.gain.value = 0.3

  const filter = ctx.createBiquadFilter()
  filter.type = 'lowpass'
  filter.frequency.value = 520
  filter.Q.value = 0.6
  filter.connect(output)
  filter.connect(send)

  const voices: Array<{ freq: number; type: OscillatorType; level: number }> =
    [
      { freq: D2, type: 'sine', level: 0.5 },
      { freq: D2 * Math.pow(2, 7 / 1200), type: 'triangle', level: 0.28 },
      { freq: D2 * Math.pow(2, -5 / 1200), type: 'sine', level: 0.34 },
      { freq: D2 * 1.5, type: 'sine', level: 0.2 }, // fifth
    ]

  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.08
  const lfoAmount = ctx.createGain()
  lfoAmount.gain.value = 1.2 // Hz of gentle pitch lean
  lfo.connect(lfoAmount)

  for (const v of voices) {
    const osc = ctx.createOscillator()
    osc.type = v.type
    osc.frequency.value = v.freq
    const g = ctx.createGain()
    g.gain.value = v.level
    lfoAmount.connect(osc.detune)
    osc.connect(g)
    g.connect(filter)
    osc.start()
  }
  lfo.start()

  return {
    output,
    send,
    setDepth(depth, time) {
      // The drone swells and darkens with depth
      output.gain.setTargetAtTime(0.04 + depth * 0.09, time, 0.8)
      filter.frequency.setTargetAtTime(520 - depth * 280, time, 0.8)
    },
  }
}
