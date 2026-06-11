import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { frameBus } from '@/lib/frameBus'
import { COLUMN_HEIGHT } from './moods'

/**
 * Critically-damped descent through the water column plus a gentle pointer
 * parallax. Reads only from the frameBus — no React state.
 */
export function CameraRig() {
  useFrame(({ camera }, delta) => {
    const d = Math.min(delta, 0.1)
    const targetY = -frameBus.depth * COLUMN_HEIGHT
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      targetY,
      4.2,
      d,
    )
    camera.rotation.x = THREE.MathUtils.damp(
      camera.rotation.x,
      frameBus.pointer.y * 0.045,
      2.4,
      d,
    )
    camera.rotation.y = THREE.MathUtils.damp(
      camera.rotation.y,
      -frameBus.pointer.x * 0.055,
      2.4,
      d,
    )
  })
  return null
}
