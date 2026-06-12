/**
 * Mutable singleton for values that change every frame.
 *
 * Shaders, the camera rig, and the audio analyser read/write here directly
 * inside rAF/useFrame loops — never through React state, so nothing
 * re-renders at 60fps.
 */
export const frameBus = {
  scroll: { progress: 0, velocity: 0 },
  /** Normalized pointer, -1..1, +y up */
  pointer: { x: 0, y: 0 },
  /** Smoothed FFT band energies, 0..1; warp = extra-slow bilateral swell */
  audio: { low: 0, mid: 0, high: 0, level: 0, warp: 0 },
  /** Current depth through the water column, 0 (surface) .. 1 (abyss) */
  depth: 0,
  /** Latest sonar ping: world-space origin + uTime timestamp. The
   *  wavefront propagates spherically; listeners (jellyfish) compute
   *  their own arrival time from distance. */
  ping: { x: 0, y: 0, z: 0, time: -1000 },
}
