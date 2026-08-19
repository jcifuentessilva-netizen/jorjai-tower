import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ContactShadows, Text } from '@react-three/drei'
import OfficeInterior from '../interior/OfficeInterior'
import CreativeStudio from '../interior/CreativeStudio'
import { createFacadeTexture } from '../../lib/textures'

const isHermesTUI = typeof __HERMES_TUI__ !== 'undefined' && __HERMES_TUI__
const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

/* ------------------------------------------------------------------ */
/* Torre JORJAI: 6 pisos + lobby de vidrio + rooftop con helipuerto    */
/* ------------------------------------------------------------------ */
export default function JorjaiTower() {
  const groupRef = useRef<THREE.Group>(null)

  const { facadeTex, facadeEmissive } = useMemo(() => {
    const t = createFacadeTexture(20260819)
    return { facadeTex: t, facadeEmissive: t }
  }, [])

  const FLOORS = 6
  const FLOOR_H = 1.25
  const TOWER_H = FLOORS * FLOOR_H
  const WIDTH = 4.6
  const DEPTH = 3.4

  /* vidrio de fachada: map = ventanas, emissiveMap = mismas ventanas */
  const glassMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: facadeTex,
        emissiveMap: facadeEmissive,
        emissive: new THREE.Color('#ffe9c4'),
        emissiveIntensity: isHermesTUI ? 0.45 : 0.75,
        roughness: 0.35,
        metalness: 0.25,
        side: THREE.DoubleSide, // visible desde dentro (inmersión oficinas)
      }),
    [facadeTex, facadeEmissive],
  )

  const slabMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#101714',
        roughness: 0.6,
        metalness: 0.5,
      }),
    [],
  )

  const frameMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1a2420',
        roughness: 0.45,
        metalness: 0.85,
      }),
    [],
  )

  /* lobby: vidrio real con transmisión */
  const lobbyGlass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#9fd8bd',
        transmission: 0.92,
        thickness: 0.4,
        roughness: 0.08,
        metalness: 0,
        ior: 1.45,
        clearcoat: 1,
      }),
    [],
  )

  const neon = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#42D879',
        emissive: new THREE.Color('#42D879'),
        emissiveIntensity: isHermesTUI ? 1.2 : 2,
        roughness: 0.3,
      }),
    [],
  )

  /* animación sutil: el edificio respira */
  useFrame(({ clock }) => {
    const g = groupRef.current
    if (!g) return
    const t = clock.elapsedTime
    g.position.y = Math.sin(t * 0.4) * 0.03
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ---- Lobby (planta baja, vidrio real) ---- */}
      <mesh position={[0, 0.55, 0]} material={lobbyGlass}>
        <boxGeometry args={[WIDTH + 1.2, 1.1, DEPTH + 1.2]} />
      </mesh>
      <mesh position={[0, 0.55, 0]} material={frameMat}>
        <boxGeometry args={[WIDTH + 1.4, 0.12, DEPTH + 1.4]} />
      </mesh>
      {/* luz interior del lobby */}
      <pointLight position={[0, 0.9, 1.2]} intensity={isHermesTUI ? 2 : 4} distance={6} color="#ffd9a0" />

      {/* ---- Losas entre pisos ---- */}
      {Array.from({ length: FLOORS + 1 }, (_, i) => (
        <mesh
          key={i}
          position={[0, 1.1 + i * FLOOR_H, 0]}
          material={slabMat}
        >
          <boxGeometry args={[WIDTH + 0.7, 0.1, DEPTH + 0.7]} />
        </mesh>
      ))}

      {/* ---- Cuerpo de la torre (ventanas) ---- */}
      <mesh position={[0, 1.1 + TOWER_H / 2, 0]} material={glassMat}>
        <boxGeometry args={[WIDTH, TOWER_H, DEPTH]} />
      </mesh>

      {/* ---- Columnas de esquina ---- */}
      {[
        [-WIDTH / 2 - 0.18, DEPTH / 2 + 0.18],
        [WIDTH / 2 + 0.18, DEPTH / 2 + 0.18],
        [-WIDTH / 2 - 0.18, -DEPTH / 2 - 0.18],
        [WIDTH / 2 + 0.18, -DEPTH / 2 - 0.18],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.1 + TOWER_H / 2, z]} material={frameMat}>
          <boxGeometry args={[0.24, TOWER_H, 0.24]} />
        </mesh>
      ))}

      {/* ---- Rooftop: helipuerto + antena + logo ---- */}
      <mesh position={[0, 1.1 + TOWER_H + 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} material={slabMat}>
        <cylinderGeometry args={[1.5, 1.5, 0.06, 32]} />
      </mesh>
      <mesh position={[0, 1.1 + TOWER_H + 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]} material={neon}>
        <ringGeometry args={[0.55, 0.75, 40]} />
      </mesh>
      {/* H del helipuerto */}
      <Text
        position={[0, 1.1 + TOWER_H + 0.18, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.42}
        color="#42D879"
        anchorX="center"
        anchorY="middle"
      >
        H
      </Text>
      {/* antena */}
      <mesh position={[WIDTH / 2 - 0.4, 1.1 + TOWER_H + 1.1, -DEPTH / 2 + 0.4]} material={frameMat}>
        <cylinderGeometry args={[0.03, 0.05, 2.2, 8]} />
      </mesh>
      <mesh position={[WIDTH / 2 - 0.4, 1.1 + TOWER_H + 2.35, -DEPTH / 2 + 0.4]} material={neon}>
        <sphereGeometry args={[0.09, 12, 12]} />
      </mesh>

      {/* ---- Logo JORJAI en la entrada ---- */}
      <Text
        position={[0, 0.62, DEPTH / 2 + 1.15]}
        fontSize={0.42}
        letterSpacing={0.18}
        color="#42D879"
        anchorX="center"
        anchorY="middle"
      >
        JORJAI
      </Text>
      <Text
        position={[0, 0.28, DEPTH / 2 + 1.15]}
        fontSize={0.13}
        letterSpacing={0.5}
        color="#A7B0AA"
        anchorX="center"
        anchorY="middle"
      >
        DIGITALIZACIONES
      </Text>

      {/* sombra de contacto suave */}
      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.55}
        scale={14}
        blur={2.6}
        far={4}
        resolution={isHermesTUI || isMobile ? 256 : 512}
      />

      {/* interiores: lobby + oficinas + estudio creativo */}
      <OfficeInterior />
      <CreativeStudio />

      {/* limpieza de textura al desmontar */}
      <primitive object={facadeTex} />
    </group>
  )
}
