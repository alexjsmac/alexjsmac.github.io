import { audioEngine } from '@/audio/engine'
import { useAppStore } from '@/store/app'
import styles from './SoundToggle.module.css'

export function SoundToggle() {
  const audioOn = useAppStore((s) => s.audioOn)
  const setAudioOn = useAppStore((s) => s.setAudioOn)

  const toggle = () => {
    if (audioOn) {
      audioEngine.stop()
      setAudioOn(false)
    } else {
      audioEngine.start()
      setAudioOn(true)
    }
  }

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-pressed={audioOn}
      aria-label="Toggle sound"
      title={audioOn ? 'Sound on' : 'Sound off'}
    >
      <span className={`${styles.bars} ${audioOn ? styles.on : ''}`} aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className={styles.label}>{audioOn ? 'Sound' : 'Muted'}</span>
    </button>
  )
}
