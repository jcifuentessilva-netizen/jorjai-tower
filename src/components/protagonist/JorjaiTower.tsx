import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { ContactShadows, Text } from '@react-three/drei'
import OfficeInterior from '../interior/OfficeInterior'
import CreativeStudio from '../interior/CreativeStudio'
import MeetingRoom from '../interior/MeetingRoom'
import LoungeRoom from '../interior/LoungeRoom'
import OfficePeople from '../people/OfficePeople'
import { createFacadeTexture } from '../../lib/textures'
import { glassMat, metalMat } from '../../lib/materials'

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

  /* ---------- fachada real: foto del edificio (cara frontal +z) ---------- */
  const facadeImg = useLoader(THREE.TextureLoader, '/facade.jpg')

  useEffect(() => {
    // mantiene la proporción de la imagen (731x1280) sobre la cara 4.6x7.5
    const texAspect = 731 / 1280
    const faceAspect = WIDTH / TOWER_H
    const rx = faceAspect / texAspect
    // eslint-disable-next-line react/immutability -- mutación intencional de textura
    facadeImg.colorSpace = THREE.SRGBColorSpace
    facadeImg.repeat.set(rx, 1)
    facadeImg.offset.set(-(rx - 1) / 2, 0)
    facadeImg.needsUpdate = true
    // eslint-disable-next-line react/immutability -- mutación intencional de textura Three.js
  }, [facadeImg, WIDTH, TOWER_H])

  const facadeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: facadeImg,
        emissiveMap: facadeImg,
        emissive: new THREE.Color('#ffffff'),
        emissiveIntensity: isHermesTUI ? 0.15 : 0.3,
        color: new THREE.Color('#8fa09a'), // atenúa el día para integrarse a la noche
        roughness: 0.35,
        metalness: 0.25,
      }),
    [facadeImg],
  )

  /* vidrio de fachada: transmisión parcial (actividad visible) + ventanas */
  const glassMat_ = useMemo(
    () =>
      glassMat({
        map: facadeTex,
        emissiveMap: facadeEmissive,
        emissiveIntensity: isHermesTUI ? 0.45 : 0.75,
        transmission: 0.35,
      }),
    [facadeTex, facadeEmissive],
  )

  const slabMat = useMemo(() => metalMat('#101714', 0.55), [])

  const frameMat = useMemo(() => metalMat('#1a2420', 0.35), [])

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
      <mesh position={[0, 0.55, 0]} material={frameMat} castShadow receiveShadow>
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
          castShadow
          receiveShadow
        >
          <boxGeometry args={[WIDTH + 0.7, 0.1, DEPTH + 0.7]} />
        </mesh>
      ))}

      {/* ---- Cuerpo de la torre (ventanas) ----
           materiales por cara: [px,nx,py,ny,pz,nz] — frontal (+z) = foto real */}
      <mesh
        position={[0, 1.1 + TOWER_H / 2, 0]}
        material={[glassMat_, glassMat_, glassMat_, glassMat_, facadeMat, glassMat_]}
        castShadow
      >
        <boxGeometry args={[WIDTH, TOWER_H, DEPTH]} />
      </mesh>

      {/* ---- Columnas de esquina ---- */}
      {[
        [-WIDTH / 2 - 0.18, DEPTH / 2 + 0.18],
        [WIDTH / 2 + 0.18, DEPTH / 2 + 0.18],
        [-WIDTH / 2 - 0.18, -DEPTH / 2 - 0.18],
        [WIDTH / 2 + 0.18, -DEPTH / 2 - 0.18],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 1.1 + TOWER_H / 2, z]} material={frameMat} castShadow>
          <boxGeometry args={[0.24, TOWER_H, 0.24]} />
        </mesh>
      ))}

      {/* ---- Rooftop: helipuerto + antena + logo ---- */}
      <mesh position={[0, 1.1 + TOWER_H + 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} material={slabMat} castShadow receiveShadow>
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

      {/* interiores: lobby + oficinas + sala de reuniones + lounge + estudio (piso 6) + personas */}
      <OfficeInterior />
      <MeetingRoom />
      <LoungeRoom />
      <group position={[0, 1.25, 0]}>
        <CreativeStudio />
      </group>
      <OfficePeople />

      {/* limpieza de textura al desmontar */}
      <primitive object={facadeTex} />
    </group>
  )
}
