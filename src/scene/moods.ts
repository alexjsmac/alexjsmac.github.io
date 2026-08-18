import * as THREE from 'three'

export interface SceneMood {
  /** Portion of the water column this route occupies; scroll interpolates it */
  depthRange: [number, number]
  bloom: number
  fogDensity: number
  caustics: number
  particleEnergy: number
  /** Optional color identity: the water ramp lerps toward this tint */
  tint?: THREE.Color
  /** 0..1 — how far toward the tint the ramp travels */
  tintStrength?: number
}

export const MOODS: Record<string, SceneMood> = {
  home: {
    depthRange: [0, 1],
    bloom: 0.9,
    fogDensity: 0.042,
    caustics: 1.0,
    particleEnergy: 1.0,
  },
  work: {
    depthRange: [0.35, 0.55],
    bloom: 0.8,
    fogDensity: 0.05,
    caustics: 0.5,
    particleEnergy: 0.9,
  },
  detail: {
    depthRange: [0.45, 0.7],
    bloom: 0.85,
    fogDensity: 0.055,
    caustics: 0.35,
    particleEnergy: 0.75,
  },
  // The performance zone: midwater, energetic, biolum-leaning —
  // stage-lit violet, like the live photos
  sunntack: {
    depthRange: [0.55, 0.78],
    bloom: 1.05,
    fogDensity: 0.06,
    caustics: 0.15,
    particleEnergy: 1.15,
    tint: new THREE.Color('#3d2a6e'),
    tintStrength: 0.3,
  },
  // Sunlit shallows, a touch of green water
  about: {
    depthRange: [0.05, 0.3],
    bloom: 0.7,
    fogDensity: 0.038,
    caustics: 1.0,
    particleEnergy: 0.8,
    tint: new THREE.Color('#0d4a3a'),
    tintStrength: 0.22,
  },
  // The cold, blue-black floor of the column
  contact: {
    depthRange: [0.85, 1],
    bloom: 1.15,
    fogDensity: 0.07,
    caustics: 0.0,
    particleEnergy: 0.6,
    tint: new THREE.Color('#04102e'),
    tintStrength: 0.35,
  },
  abyss: {
    depthRange: [0.9, 1],
    bloom: 1.0,
    fogDensity: 0.08,
    caustics: 0.0,
    particleEnergy: 0.4,
  },
}

export function moodOf(key: string): SceneMood {
  return MOODS[key] ?? MOODS.home!
}

/** Water column, surface → abyss. Linear-space mirrors of the CSS tokens. */
export const RAMP_HEX = [
  '#0d3b5e',
  '#0a2c49',
  '#061b30',
  '#03101e',
  '#020610',
] as const

/**
 * Linear-space colors (THREE.Color(hex) converts sRGB→linear once via
 * ColorManagement). The scene always renders through the EffectComposer,
 * which applies the final linear→sRGB encode — so shader output in linear
 * round-trips back to the CSS token values on screen. Do not add manual
 * convertSRGBToLinear calls on top.
 */
export const RAMP_COLORS = RAMP_HEX.map((hex) => new THREE.Color(hex))

/** JS mirror of the shader's 5-stop ramp, for fog + clear color.
 *  Pass the live (mood-tinted) uniform stops to keep fog in step. */
export function rampColor(
  t: number,
  out: THREE.Color,
  stops: readonly THREE.Color[] = RAMP_COLORS,
): THREE.Color {
  const x = THREE.MathUtils.clamp(t, 0, 1) * 4
  const i = Math.min(Math.floor(x), 3)
  const f = x - i
  return out.copy(stops[i]!).lerp(stops[i + 1]!, f)
}

/** How far down the camera travels, in world units. */
export const COLUMN_HEIGHT = 40
