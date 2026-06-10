import { create } from 'zustand'
import { detectQuality, degrade, type QualityTier } from '@/lib/quality'

interface AppState {
  quality: QualityTier
  /** True once the user has chosen sound on/off in the intro gate this session */
  introDismissed: boolean
  audioOn: boolean
  /** Mood key for the WebGL scene, derived from the current route */
  moodKey: string
  degradeQuality: () => void
  dismissIntro: () => void
  setAudioOn: (on: boolean) => void
  setMoodKey: (key: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  quality: detectQuality(),
  introDismissed: sessionStorage.getItem('intro-dismissed') === '1',
  audioOn: false,
  moodKey: 'home',
  degradeQuality: () => set((s) => ({ quality: degrade(s.quality) })),
  dismissIntro: () => {
    sessionStorage.setItem('intro-dismissed', '1')
    set({ introDismissed: true })
  },
  setAudioOn: (on) => set({ audioOn: on }),
  setMoodKey: (key) => set({ moodKey: key }),
}))
