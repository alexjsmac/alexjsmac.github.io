import * as THREE from 'three'
import { frameBus } from '@/lib/frameBus'

const ray = new THREE.Vector3()

/** Unproject the current pointer onto a camera-facing plane at z=planeZ. */
export function pointerToWorld(
  camera: THREE.Camera,
  planeZ: number,
  out: THREE.Vector3,
): THREE.Vector3 {
  ray.set(frameBus.pointer.x, frameBus.pointer.y, 0.5).unproject(camera)
  ray.sub(camera.position).normalize()
  const t = (planeZ - camera.position.z) / ray.z
  return out.copy(camera.position).addScaledVector(ray, t)
}
