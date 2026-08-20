import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { createScreenTexture, type ScreenKind } from '../../lib/screens'

/* eslint-disable react-hooks/immutability -- mutación intencional de textura canvas en useFrame */

export interface LiveScreenProps {
  kind: ScreenKind
  seed?: number
  size?: [number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
  toneMapped?: boolean
}

/** Monitor con contenido vivo: redibuja el canvas ~8fps (barato). */
export default function LiveScreen({
  kind,
  seed = 1,
  size = [0.52, 0.32],
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  toneMapped = false,
}: LiveScreenProps) {
  const { tex, update } = useMemo(() => createScreenTexture(kind, seed), [kind, seed])
  const acc = useRef(0)

  useFrame((_, delta) => {
    acc.current += delta
    if (acc.current > 0.12) {
      acc.current = 0
      update(performance.now() / 1000)
    }
  })

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={tex} toneMapped={toneMapped} />
    </mesh>
  )
}
