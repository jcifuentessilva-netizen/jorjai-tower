import { useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { deriveAtmosphere } from '../../lib/xMachine'

/* eslint-disable react-hooks/immutability -- mutación intencional de objetos Three.js en useFrame */

/**
 * Atmósfera por fase: fondo, niebla y luces mutados en caliente (sin alloc).
 * Refactoriza las luces que antes vivían en App.tsx.
 */
export default function AtmosphereRig() {
  const scene = useThree((s) => s.scene)
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const pointRef = useRef<THREE.PointLight>(null)
  const bgColor = useRef(new THREE.Color())
  const fogColor = useRef(new THREE.Color())
  const pointColor = useRef(new THREE.Color())

  useFrame(() => {
    const a = deriveAtmosphere(window.__JORJAI_PROGRESS__ ?? 0)
    scene.background = bgColor.current.set(a.bgColor)
    const fog = scene.fog as THREE.Fog | null
    if (fog) {
      fog.color = fogColor.current.set(a.fogColor)
      fog.near = a.fogNear
      fog.far = a.fogFar
    }
    if (ambientRef.current) ambientRef.current.intensity = a.ambientIntensity
    if (pointRef.current) {
      pointRef.current.intensity = a.pointIntensity
      pointRef.current.color = pointColor.current.set(a.pointColor)
    }
  })

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.16} />
      <pointLight ref={pointRef} position={[-9, 4, -7]} intensity={3} color="#42D879" />
    </>
  )
}
