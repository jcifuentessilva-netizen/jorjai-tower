import { useEffect, useMemo, useState } from 'react'
import * as THREE from 'three'
import { Text } from '@react-three/drei'
import { createGlowTexture, createWoodTexture, createCarpetTexture } from '../../lib/textures'
import { woodMat, concreteMat, leatherMat, metalMat, carpetMat } from '../../lib/materials'
import CityWindow from '../environment/CityWindow'

const isHermesTUI = typeof __HERMES_TUI__ !== 'undefined' && __HERMES_TUI__

/* ---------- imágenes reales del Brief JORJAI (Milanote) ---------- */
const BRIEF_IMAGES = [
  'https://app.milanote.com/media/p/images/1WWqeP14ioGwdM/dfV/mixboard-image.webp?w=800',
  'https://app.milanote.com/media/p/images/1WWxKA1gh8RO3O/EUa/mixboard-image.png?w=800',
  'https://app.milanote.com/media/p/images/1WWxH51gh8RO3L/pH6/mixboard-image%20%281%29.jfif.jpeg?w=800',
  'https://app.milanote.com/media/p/images/1WWxH61gh8RO3M/gGz/mixboard-image%20%281%29.png?w=800',
  'https://app.milanote.com/media/p/images/1WWxTa1gh8RO3W/nlV/mixboard-image.png?w=800',
  'https://app.milanote.com/media/p/images/1WWvMk1arGhA5V/yi2/mixboard-image.png?w=800',
  'https://app.milanote.com/media/p/images/1WWxWf1gh8RO40/Czi/mixboard-image%20%281%29.png?w=800',
  'https://app.milanote.com/media/p/images/1WWwtN1gh8RO3F/PhS/descarga.png',
]

/* fallback: moodboard procedural con la paleta de marca */
function createMoodboardTexture(seed: number): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 160
  const ctx = canvas.getContext('2d')!
  let s = seed >>> 0
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  ctx.fillStyle = '#0B3D25'
  ctx.fillRect(0, 0, 256, 160)
  const palette = ['#42D879', '#F4F7F4', '#A7B0AA', '#0B3D25', '#FFFFFF', '#050505']
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = palette[Math.floor(rand() * palette.length)]
    const w = 40 + rand() * 90
    const h = 24 + rand() * 50
    ctx.globalAlpha = 0.5 + rand() * 0.5
    ctx.fillRect(rand() * 180, rand() * 130, w, h)
  }
  ctx.globalAlpha = 1
  ctx.fillStyle = '#42D879'
  ctx.fillRect(16, 140, 90, 4)
  ctx.fillRect(16, 148, 140, 3)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function loadTexture(url: string, seed: number): Promise<THREE.Texture> {
  return new Promise((resolve) => {
    new THREE.TextureLoader().load(
      url,
      (t) => {
        t.colorSpace = THREE.SRGBColorSpace
        resolve(t)
      },
      undefined,
      () => resolve(createMoodboardTexture(seed)),
    )
  })
}

/**
 * Estudio creativo (último piso): diario mural con imágenes del brief,
 * mesa de trabajo, sofá y ventanal con vista al skyline de Santiago.
 */
export default function CreativeStudio() {
  const [posters, setPosters] = useState<THREE.Texture[] | null>(null)

  useEffect(() => {
    let alive = true
    Promise.all(BRIEF_IMAGES.map((url, i) => loadTexture(url, i + 1))).then((texs) => {
      if (alive) setPosters(texs)
    })
    return () => {
      alive = false
    }
  }, [])

  const woodTex = useMemo(() => createWoodTexture(11), [])
  const woodMat_ = useMemo(() => woodMat('#7a5636', woodTex), [woodTex])
  const darkMat = useMemo(() => metalMat('#101412', 0.6), [])
  const cushionMat = useMemo(() => leatherMat('#1d2a23'), [])
  const wallMat = useMemo(() => concreteMat('#111714'), [])
  const carpetTex = useMemo(() => createCarpetTexture('#c7c4be', 44), [])
  const carpet = useMemo(() => carpetMat(carpetTex), [carpetTex])
  const neonMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#42D879',
        emissive: new THREE.Color('#42D879'),
        emissiveIntensity: isHermesTUI ? 1.4 : 2.4,
      }),
    [],
  )
  const glowTex = useMemo(() => createGlowTexture(), [])

  /* grid de posters: 2 filas × 4 columnas en la pared este */
  const POSTER_W = 0.8
  const POSTER_H = 0.52
  const posterPos: [number, number, number][] = []
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 4; c++) {
      posterPos.push([2.26, 6.15 - r * 0.62, -1.05 + c * 0.7])
    }
  }

  return (
    <group>
      {/* piso alfombrado */}
      <mesh position={[0, 4.87, 0]} rotation={[-Math.PI / 2, 0, 0]} material={carpet}>
        <planeGeometry args={[4.4, 3.2]} />
      </mesh>

      {/* ventanal norte → vista a Santiago */}
      <CityWindow position={[0, 6.15, -1.6]} width={2.3} height={1.3} />
      {/* luz que entra por el ventanal */}
      <pointLight position={[0, 6.2, -1.2]} intensity={isHermesTUI ? 1.2 : 2.5} distance={6} color="#bfe8d8" />

      {/* pared este con el diario mural */}
      <mesh position={[2.3, 6.1, 0]} material={wallMat}>
        <boxGeometry args={[0.06, 2.3, 3.1]} />
      </mesh>
      <mesh position={[2.29, 6.15, 0]} material={darkMat}>
        <boxGeometry args={[0.04, 2.2, 3.0]} />
      </mesh>

      {/* posters: imagen + marco */}
      {posters &&
        posterPos.map((pos, i) => (
          <group key={i} position={pos} rotation={[0, -Math.PI / 2, 0]}>
            <mesh position={[0, 0, -0.012]} material={darkMat}>
              <boxGeometry args={[POSTER_W + 0.06, POSTER_H + 0.06, 0.03]} />
            </mesh>
            <mesh>
              <planeGeometry args={[POSTER_W, POSTER_H]} />
              <meshBasicMaterial map={posters[i]} toneMapped={false} />
            </mesh>
          </group>
        ))}
      {/* notas del mural */}
      {['IDEAS', 'WEB', 'IA', 'UX'].map((t, i) => (
        <Text
          key={t}
          position={[2.27, 6.75, -1.05 + i * 0.7]}
          rotation={[0, -Math.PI / 2, 0]}
          fontSize={0.09}
          color="#42D879"
          anchorX="left"
          anchorY="middle"
        >
          {t}
        </Text>
      ))}

      {/* mesa de trabajo central */}
      <mesh position={[0, 5.5, 0]} material={woodMat_}>
        <boxGeometry args={[2.6, 0.06, 1.0]} />
      </mesh>
      <mesh position={[-1.2, 5.2, -0.4]} material={darkMat}>
        <boxGeometry args={[0.05, 0.6, 0.05]} />
      </mesh>
      <mesh position={[1.2, 5.2, -0.4]} material={darkMat}>
        <boxGeometry args={[0.05, 0.6, 0.05]} />
      </mesh>
      <mesh position={[-1.2, 5.2, 0.4]} material={darkMat}>
        <boxGeometry args={[0.05, 0.6, 0.05]} />
      </mesh>
      <mesh position={[1.2, 5.2, 0.4]} material={darkMat}>
        <boxGeometry args={[0.05, 0.6, 0.05]} />
      </mesh>
      {/* sketches sobre la mesa */}
      <mesh position={[-0.7, 5.54, 0.1]} rotation={[0, 0.3, 0]}>
        <planeGeometry args={[0.4, 0.28]} />
        <meshBasicMaterial color="#F4F7F4" />
      </mesh>
      <mesh position={[0.2, 5.545, -0.15]} rotation={[0, -0.2, 0]}>
        <planeGeometry args={[0.35, 0.24]} />
        <meshBasicMaterial color="#0B3D25" />
      </mesh>
      <mesh position={[0.85, 5.54, 0.05]} rotation={[0, 0.15, 0]}>
        <planeGeometry args={[0.38, 0.26]} />
        <meshBasicMaterial color="#A7B0AA" />
      </mesh>

      {/* sofá + mesa de café */}
      <group position={[0, 5.16, 1.05]}>
        <mesh position={[0, 0.18, 0.12]} material={cushionMat}>
          <boxGeometry args={[1.7, 0.32, 0.7]} />
        </mesh>
        <mesh position={[0, 0.42, -0.22]} material={cushionMat}>
          <boxGeometry args={[1.7, 0.5, 0.14]} />
        </mesh>
        <mesh position={[0, 0.22, -0.52]} material={darkMat}>
          <boxGeometry args={[1.7, 0.4, 0.1]} />
        </mesh>
      </group>
      <mesh position={[0, 5.33, 0.55]}>
        <cylinderGeometry args={[0.22, 0.22, 0.04, 20]} />
        <meshBasicMaterial color="#101412" />
      </mesh>

      {/* luz de techo cálida */}
      <pointLight position={[0, 7.0, 0]} intensity={isHermesTUI ? 2 : 4} distance={8} color="#ffd9a0" />
      <mesh position={[0, 7.3, 0]} rotation={[-Math.PI / 2, 0, 0]} material={neonMat}>
        <planeGeometry args={[1.1, 0.2]} />
      </mesh>

      {/* planta decorativa */}
      <group position={[-1.9, 4.87, 1.2]}>
        <mesh position={[0, 0.15, 0]} material={darkMat}>
          <cylinderGeometry args={[0.14, 0.1, 0.3, 12]} />
        </mesh>
        <mesh position={[0, 0.55, 0]} material={cushionMat}>
          <sphereGeometry args={[0.24, 10, 10]} />
        </mesh>
      </group>

      {/* luz neón de acento */}
      <sprite position={[1.9, 6.6, -1.3]} scale={[0.8, 0.8, 1]}>
        <spriteMaterial map={glowTex} color="#42D879" transparent opacity={0.35} depthWrite={false} />
      </sprite>
    </group>
  )
}
