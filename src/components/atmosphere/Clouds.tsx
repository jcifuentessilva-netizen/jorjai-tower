import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { createGlowTexture } from '../../lib/textures'

const CLOUDS = (() => {
  let s = 77 >>> 0
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  return Array.from({ length: 12 }, () => ({
    pos: [rand() * 60 - 30, 5 + rand() * 9, -8 - rand() * 22],
    scale: 3 + rand() * 6,
    opacity: 0.05 + rand() * 0.06,
    speed: 0.1 + rand() * 0.2,
  }))
})()

/** Nubes suaves: sprites glow grandes con deriva lenta. */
export default function Clouds() {
  const groupRef = useRef<THREE.Group>(null)
  const glowTex = useMemo(() => createGlowTexture(), [])

  useFrame(({ clock }) => {
    const g = groupRef.current
    if (!g) return
    g.children.forEach((s, i) => {
      const c = CLOUDS[i]
      s.position.x = c.pos[0] + Math.sin(clock.elapsedTime * c.speed + i) * 1.5
    })
  })

  return (
    <group ref={groupRef}>
      {CLOUDS.map((c, i) => (
        <sprite key={i} position={c.pos as [number, number, number]} scale={[c.scale, c.scale * 0.4, 1]}>
          <spriteMaterial
            map={glowTex}
            color="#dfe9e4"
            transparent
            opacity={c.opacity}
            depthWrite={false}
          />
        </sprite>
      ))}
    </group>
  )
}
