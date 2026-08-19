import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { deriveCamera } from '../../lib/xMachine'

/* eslint-disable react-hooks/immutability -- mutación intencional de objetos Three.js en useFrame */

/**
 * Cámara cinematográfica: lerp continuo hacia el keyframe derivado del
 * progreso global. Un solo useFrame (patrón orchestrator, seguro TUI).
 */
export default function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const lookTarget = useRef(new THREE.Vector3(0, 3, 0))
  const tmpPos = useRef(new THREE.Vector3())
  const tmpTgt = useRef(new THREE.Vector3())

  useFrame((_, delta) => {
    const k = deriveCamera(window.__JORJAI_PROGRESS__ ?? 0)
    const kf = 1 - Math.pow(0.0001, delta) // framerate-independent

    camera.position.lerp(tmpPos.current.set(k.position.x, k.position.y, k.position.z), kf)
    lookTarget.current.lerp(tmpTgt.current.set(k.target.x, k.target.y, k.target.z), kf)
    camera.lookAt(lookTarget.current)
    camera.fov += (k.fov - camera.fov) * kf
    camera.updateProjectionMatrix()
  })

  return null
}
