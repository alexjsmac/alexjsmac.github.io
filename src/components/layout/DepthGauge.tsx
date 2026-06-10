import { useEffect, useRef } from 'react'
import { frameBus } from '@/lib/frameBus'
import { useAppStore } from '@/store/app'
import styles from './DepthGauge.module.css'

const MAX_METERS = 4000

/** Right-edge depth readout — the site as a scientific instrument. */
export function DepthGauge() {
  const quality = useAppStore((s) => s.quality)
  const value = useRef<HTMLSpanElement>(null)
  const fill = useRef<HTMLSpanElement>(null)
  const lastShown = useRef(-1)

  useEffect(() => {
    if (quality === 'static') return
    let raf = 0
    const tick = () => {
      const meters = Math.round(frameBus.depth * MAX_METERS)
      if (meters !== lastShown.current) {
        lastShown.current = meters
        if (value.current) value.current.textContent = `−${meters}m`
        if (fill.current) {
          fill.current.style.transform = `scaleY(${frameBus.depth})`
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [quality])

  if (quality === 'static') return null

  return (
    <div className={styles.gauge} aria-hidden="true">
      <span className={styles.track}>
        <span ref={fill} className={styles.fill} />
      </span>
      <span ref={value} className={styles.value}>
        −0m
      </span>
    </div>
  )
}
