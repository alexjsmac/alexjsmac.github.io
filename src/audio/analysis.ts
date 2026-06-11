import { frameBus } from '@/lib/frameBus'
import { audioEngine } from './engine'

const bins = new Uint8Array(128)

function band(from: number, to: number): number {
  let sum = 0
  for (let i = from; i < to; i++) sum += bins[i]!
  return sum / ((to - from) * 255)
}

/** Fast attack, slow release — visuals snap to hits and breathe out. */
function smooth(prev: number, next: number): number {
  return next > prev ? prev + (next - prev) * 0.55 : prev + (next - prev) * 0.08
}

/**
 * Lazy swell for large-scale motion (cloud warp): slow in BOTH directions
 * so it bends rather than twitches.
 */
function swell(prev: number, next: number): number {
  return next > prev
    ? prev + (next - prev) * 0.03
    : prev + (next - prev) * 0.012
}

/**
 * Called once per rendered frame (from the scene's tick). Reads the FFT,
 * folds it into smoothed low/mid/high band energies on the frameBus.
 */
export function sampleAudio() {
  const analyser = audioEngine.analyser
  const audio = frameBus.audio
  if (!analyser || !audioEngine.enabled) {
    // Breathe back to silence
    audio.low = smooth(audio.low, 0)
    audio.mid = smooth(audio.mid, 0)
    audio.high = smooth(audio.high, 0)
    audio.level = smooth(audio.level, 0)
    audio.warp = swell(audio.warp, 0)
    return
  }
  analyser.getByteFrequencyData(bins)
  audio.low = smooth(audio.low, band(1, 8))
  audio.mid = smooth(audio.mid, band(8, 40))
  audio.high = smooth(audio.high, band(40, 100))
  audio.level = smooth(audio.level, band(1, 100))
  audio.warp = swell(audio.warp, Math.min(1, audio.level * 1.6))
}
