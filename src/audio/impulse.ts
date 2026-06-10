/**
 * Generated impulse response — a dark, underwater-feeling 5s tail.
 * Exponentially decaying noise, progressively low-passed so the tail gets
 * murkier as it fades. Zero audio file assets.
 */
export function buildImpulseResponse(ctx: BaseAudioContext): AudioBuffer {
  const seconds = 5
  const rate = ctx.sampleRate
  const length = Math.floor(seconds * rate)
  const buffer = ctx.createBuffer(2, length, rate)

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel)
    let smoothed = 0
    for (let i = 0; i < length; i++) {
      const t = i / length
      const envelope = Math.pow(1 - t, 2.5)
      // One-pole lowpass whose cutoff falls along the tail
      const k = 0.04 + t * 0.2
      smoothed += ((Math.random() * 2 - 1) - smoothed) * (1 - k)
      data[i] = smoothed * envelope * 0.5
    }
  }
  return buffer
}
