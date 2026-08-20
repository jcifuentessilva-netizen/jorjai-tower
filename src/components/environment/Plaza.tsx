import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { metalMat, leatherMat, concreteMat } from '../../lib/materials'
import { createPlazaTexture, createGrassTexture, createGlowTexture } from '../../lib/textures'
import { Person } from '../people/OfficePeople'

const isHermesTUI = typeof __HERMES_TUI__ !== 'undefined' && __HERMES_TUI__
const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches

/* ---------- logo JORJAI en relieve de cemento (extruido) ---------- */
function LogoRelief() {
  const font = useLoader(FontLoader, '/helvetiker_bold.typeface.json')
  const concrete = useMemo(() => concreteMat('#b4bab6'), [])

  const geo = useMemo(() => {
    const g = new TextGeometry('JORJAI', {
      font,
      size: 0.46,
      depth: 0.025,
      curveSegments: 6,
      bevelEnabled: true,
      bevelSize: 0.006,
      bevelThickness: 0.006,
      bevelSegments: 2,
    })
    g.computeBoundingBox()
    const bb = g.boundingBox!
    g.translate(-(bb.max.x + bb.min.x) / 2, -(bb.max.y + bb.min.y) / 2, 0)
    return g
  }, [font])

  return (
    <mesh geometry={geo} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 3.6]} material={concrete} />
  )
}

/* ---------- jardinera con césped y flores ---------- */
function FlowerBed({ position, rotationY = 0, length = 4, flowers = 6 }: { position: [number, number, number]; rotationY?: number; length?: number; flowers?: number }) {
  const planter = useMemo(() => concreteMat('#a8aeaa'), [])
  const grassTex = useMemo(() => createGrassTexture(23), [])
  const grass = useMemo(
    () => new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.95 }),
    [grassTex],
  )
  const soil = useMemo(() => new THREE.MeshStandardMaterial({ color: '#3a2c1c', roughness: 1 }), [])
  const petals = ['#e05252', '#f2c14e', '#f2f2f2', '#d66ec4', '#f2f2f2']

  const flowerPos: [number, number, number][] = useMemo(() => {
    const out: [number, number, number][] = []
    for (let i = 0; i < flowers; i++) {
      out.push([-length / 2 + 0.5 + (i * (length - 1)) / Math.max(1, flowers - 1), 0.45, (i % 2 === 0 ? -1 : 1) * 0.18])
    }
    return out
  }, [flowers, length])

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* macetero de hormigón */}
      <mesh position={[0, 0.18, 0]} material={planter}>
        <boxGeometry args={[length, 0.36, 0.7]} />
      </mesh>
      {/* tierra */}
      <mesh position={[0, 0.34, 0]} material={soil}>
        <boxGeometry args={[length - 0.08, 0.04, 0.62]} />
      </mesh>
      {/* césped */}
      <mesh position={[0, 0.37, 0]} rotation={[-Math.PI / 2, 0, 0]} material={grass}>
        <planeGeometry args={[length - 0.08, 0.62]} />
      </mesh>
      {/* flores: tallo + cabeza */}
      {flowerPos.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh position={[0, 0.06, 0]} material={grass}>
            <cylinderGeometry args={[0.012, 0.014, 0.16, 6]} />
          </mesh>
          <mesh position={[0, 0.16, 0]} material={leatherMat(petals[i % petals.length])}>
            <sphereGeometry args={[0.045, 10, 10]} />
          </mesh>
          <mesh position={[0, 0.17, 0]} material={leatherMat('#f2c14e')}>
            <sphereGeometry args={[0.018, 8, 8]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ---------- banca ---------- */
function Bench({ position, rotationY = 0 }: { position: [number, number, number]; rotationY?: number }) {
  const wood = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#7a5a38', roughness: 0.6, clearcoat: 0.2 }), [])
  const metal = useMemo(() => metalMat('#2a2f2c', 0.4), [])
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, 0.42, 0]} material={wood}>
        <boxGeometry args={[1.5, 0.06, 0.42]} />
      </mesh>
      <mesh position={[0, 0.62, -0.2]} rotation={[0.18, 0, 0]} material={wood}>
        <boxGeometry args={[1.5, 0.06, 0.3]} />
      </mesh>
      {[-0.65, 0.65].map((x) => (
        <mesh key={x} position={[x, 0.2, 0]} material={metal}>
          <boxGeometry args={[0.06, 0.42, 0.06]} />
        </mesh>
      ))}
      <mesh position={[0, 0.36, 0.26]} material={metal}>
        <boxGeometry args={[1.5, 0.04, 0.05]} />
      </mesh>
    </group>
  )
}

/* ---------- farol ---------- */
function StreetLamp({ position, light }: { position: [number, number, number]; light?: boolean }) {
  const metal = useMemo(() => metalMat('#2c3233', 0.45), [])
  const lampMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ffe2b8',
        emissive: new THREE.Color('#ffca85'),
        emissiveIntensity: isHermesTUI ? 1 : 2.2,
      }),
    [],
  )
  return (
    <group position={position}>
      <mesh position={[0, 1.3, 0]} material={metal}>
        <cylinderGeometry args={[0.045, 0.06, 2.6, 10]} />
      </mesh>
      <mesh position={[0, 2.55, 0]} rotation={[0, 0, 0.45]} material={metal}>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
      </mesh>
      <mesh position={[0.22, 2.68, 0]} material={lampMat}>
        <boxGeometry args={[0.16, 0.1, 0.16]} />
      </mesh>
      {light && !isHermesTUI && (
        <pointLight position={[0.22, 2.55, 0]} intensity={1.6} distance={5} color="#ffca85" />
      )}
    </group>
  )
}

/* ---------- bicicleta con repartidor ---------- */
function DeliveryBike({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null)
  const wheelFL = useRef<THREE.Mesh>(null)
  const wheelBL = useRef<THREE.Mesh>(null)
  const wheelFR = useRef<THREE.Mesh>(null)
  const wheelBR = useRef<THREE.Mesh>(null)
  const metal = useMemo(() => metalMat('#8b9491', 0.35), [])
  const dark = useMemo(() => metalMat('#1d2123', 0.5), [])
  const frame = useMemo(() => metalMat('#1f5c3a', 0.4), [])
  const bag = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e8b03c', roughness: 0.6 }), [])

  useFrame(({ clock }) => {
    const g = groupRef.current
    if (!g) return
    const t = clock.elapsedTime
    g.position.x = 6 + Math.sin(t * 0.3) * -7
    g.position.z = 6.5
    g.rotation.y = Math.cos(t * 0.3) > 0 ? 0 : Math.PI
    const spin = t * 4
    for (const w of [wheelFL, wheelBL, wheelFR, wheelBR]) {
      if (w.current) w.current.rotation.x = spin
    }
  })

  const WHEEL = 0.26
  const wheelGeo = useMemo(() => new THREE.TorusGeometry(WHEEL, 0.022, 8, 20), [])
  const wheelMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#23282a', roughness: 0.8 }), [])

  return (
    <group ref={groupRef} position={position}>
      {/* ruedas */}
      <mesh ref={wheelBL} position={[-0.35, WHEEL, 0]} geometry={wheelGeo} material={wheelMat} rotation={[0, 0, Math.PI / 2]} />
      <mesh ref={wheelBR} position={[0.35, WHEEL, 0]} geometry={wheelGeo} material={wheelMat} rotation={[0, 0, Math.PI / 2]} />
      <mesh ref={wheelFL} position={[-0.35, WHEEL, 0.02]} geometry={wheelGeo} material={wheelMat} rotation={[0, 0, Math.PI / 2]} />
      <mesh ref={wheelFR} position={[0.35, WHEEL, 0.02]} geometry={wheelGeo} material={wheelMat} rotation={[0, 0, Math.PI / 2]} />
      {/* cuadro */}
      <mesh position={[0, 0.62, 0]} rotation={[0, 0, 0.3]} material={frame}>
        <cylinderGeometry args={[0.022, 0.022, 0.75, 6]} />
      </mesh>
      <mesh position={[0, 0.62, 0]} rotation={[0, 0, -0.35]} material={frame}>
        <cylinderGeometry args={[0.022, 0.022, 0.6, 6]} />
      </mesh>
      <mesh position={[0, 0.62, 0]} rotation={[Math.PI / 2.4, 0, 0]} material={frame}>
        <cylinderGeometry args={[0.018, 0.018, 0.5, 6]} />
      </mesh>
      {/* manubrio */}
      <mesh position={[0, 0.92, 0.3]} material={metal}>
        <cylinderGeometry args={[0.015, 0.015, 0.4, 6]} />
      </mesh>
      {/* asiento */}
      <mesh position={[0, 0.88, -0.18]} material={dark}>
        <boxGeometry args={[0.1, 0.03, 0.24]} />
      </mesh>
      {/* pedales */}
      <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]} material={metal}>
        <cylinderGeometry args={[0.012, 0.012, 0.3, 6]} />
      </mesh>
      {/* caja de reparto */}
      <mesh position={[-0.28, 0.75, -0.05]} rotation={[0, 0, 0.15]} material={bag}>
        <boxGeometry args={[0.22, 0.3, 0.3]} />
      </mesh>
      {/* repartidor montado */}
      <Person position={[0, 0.3, 0]} rotationY={0} mode="meeting" seed={69} height={0.72} />
    </group>
  )
}

/* ================================================================== */
/* Plaza de entrada: adoquín, logo relieve, jardines, bancas, faroles, */
/* bicicleta.                                                          */
/* ================================================================== */
export default function Plaza() {
  const plazaTex = useMemo(() => createPlazaTexture(17), [])
  const plaza = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: plazaTex,
        roughness: 0.95,
        metalness: 0,
        envMapIntensity: 0.3,
      }),
    [plazaTex],
  )
  const glowTex = useMemo(() => createGlowTexture(), [])

  return (
    <group>
      {/* piso de la plaza */}
      <mesh position={[0, 0.005, 4]} rotation={[-Math.PI / 2, 0, 0]} material={plaza} receiveShadow>
        <planeGeometry args={[22, 16]} />
      </mesh>

      {/* logo JORJAI en relieve de cemento */}
      <LogoRelief />

      {/* jardineras con flores */}
      <FlowerBed position={[-6.5, 0, 4]} rotationY={0} length={4.2} flowers={7} />
      <FlowerBed position={[6.5, 0, 4]} rotationY={0} length={4.2} flowers={7} />
      <FlowerBed position={[-4.5, 0, 9.5]} rotationY={Math.PI / 2} length={3.4} flowers={5} />
      <FlowerBed position={[4.5, 0, 9.5]} rotationY={Math.PI / 2} length={3.4} flowers={5} />

      {/* bancas */}
      <Bench position={[-3.2, 0, 6.2]} rotationY={0.25} />
      <Bench position={[3.4, 0, 5.4]} rotationY={-0.2} />

      {/* faroles */}
      <StreetLamp position={[-5, 0, 2.5]} light />
      <StreetLamp position={[5, 0, 2.5]} light />
      <StreetLamp position={[-3, 0, 8.5]} />
      <StreetLamp position={[3, 0, 8.5]} />
      <StreetLamp position={[0, 0, 11.5]} light />

      {/* repartidor en bicicleta */}
      {!isHermesTUI && !isMobile && <DeliveryBike position={[-1, 0, 6.5]} />}

      {/* brillo sutil de la entrada */}
      <sprite position={[0, 1.2, 2.2]} scale={[2.4, 2.4, 1]}>
        <spriteMaterial map={glowTex} color="#42D879" transparent opacity={0.1} depthWrite={false} />
      </sprite>
    </group>
  )
}
