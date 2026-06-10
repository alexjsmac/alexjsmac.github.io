export type QualityTier = 'high' | 'mid' | 'low' | 'static'

export interface QualityProfile {
  tier: QualityTier
  dprMax: number
  planktonCount: number
  medusae: number
  chromaticAberration: boolean
}

const PROFILES: Record<Exclude<QualityTier, 'static'>, QualityProfile> = {
  high: {
    tier: 'high',
    dprMax: 1.75,
    planktonCount: 6000,
    medusae: 3,
    chromaticAberration: true,
  },
  mid: {
    tier: 'mid',
    dprMax: 1.5,
    planktonCount: 3000,
    medusae: 2,
    chromaticAberration: false,
  },
  low: {
    tier: 'low',
    dprMax: 1,
    planktonCount: 1200,
    medusae: 0,
    chromaticAberration: false,
  },
}

export function detectQuality(): QualityTier {
  if (typeof window === 'undefined') return 'static'
  const override = new URLSearchParams(window.location.search).get('q')
  if (
    override === 'high' ||
    override === 'mid' ||
    override === 'low' ||
    override === 'static'
  ) {
    return override
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'static'
  }
  const coarse = window.matchMedia('(pointer: coarse)').matches
  const small = Math.min(window.screen.width, window.screen.height) < 768
  const cores = navigator.hardwareConcurrency ?? 4
  const memory =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8
  if (coarse && small) return 'low'
  if (coarse || cores <= 4 || memory <= 4) return 'mid'
  return 'high'
}

export function qualityProfile(tier: QualityTier): QualityProfile {
  if (tier === 'static') return PROFILES.low
  return PROFILES[tier]
}

/** One tier down, for runtime degradation via PerformanceMonitor. */
export function degrade(tier: QualityTier): QualityTier {
  if (tier === 'high') return 'mid'
  if (tier === 'mid') return 'low'
  return tier
}
