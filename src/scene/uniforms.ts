import * as THREE from 'three'
import { RAMP_COLORS } from './moods'

/**
 * Uniform objects shared by reference across every scene material —
 * one write in the per-frame tick updates all shaders.
 */
export const sharedUniforms = {
  uTime: { value: 0 },
  uDepth: { value: 0 },
  uCaustics: { value: 1 },
  uParticleEnergy: { value: 1 },
  uAudioLow: { value: 0 },
  uAudioMid: { value: 0 },
  uAudioHigh: { value: 0 },
  uAudioLevel: { value: 0 },
  uRamp: { value: RAMP_COLORS.map((c) => new THREE.Color().copy(c)) },
}
