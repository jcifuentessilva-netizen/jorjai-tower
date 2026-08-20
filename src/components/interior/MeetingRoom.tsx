import { useMemo } from 'react'
import * as THREE from 'three'
import { glassMat, metalMat, leatherMat, carpetMat } from '../../lib/materials'
import { createCarpetTexture } from '../../lib/textures'
import LiveScreen from '../ui/LiveScreen'
import CityWindow from '../environment/CityWindow'

const isHermesTUI = typeof __HERMES_TUI__ !== 'undefined' && __HERMES_TUI__

/* ---------- silla ejecutiva reclinable ---------- */
function RecliningChair({ position, rotationY }: { position: [number, number, number]; rotationY: number }) {
  const leather = useMemo(() => leatherMat('#20241f'), [])
  const metal = useMemo(() => metalMat('#1a1d1b', 0.35), [])
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* base 5 patas */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh
          key={i}
          position={[0, 0.04, 0]}
          rotation={[0, (i * Math.PI * 2) / 5, Math.PI / 2]}
          material={metal}
        >
          <cylinderGeometry args={[0.015, 0.015, 0.34, 6]} />
        </mesh>
      ))}
      <mesh position={[0, 0.05, 0]} material={metal}>
        <cylinderGeometry args={[0.07, 0.09, 0.04, 10]} />
      </mesh>
      <mesh position={[0, 0.3, 0]} material={metal}>
        <cylinderGeometry args={[0.028, 0.028, 0.5, 8]} />
      </mesh>
      {/* asiento */}
      <mesh position={[0, 0.52, 0]} material={leather}>
        <cylinderGeometry args={[0.21, 0.21, 0.07, 18]} />
      </mesh>
      {/* respaldo reclinable */}
      <mesh position={[0, 0.72, -0.17]} rotation={[0.32, 0, 0]} material={leather}>
        <boxGeometry args={[0.42, 0.52, 0.07]} />
      </mesh>
      {/* reposabrazos */}
      <mesh position={[-0.24, 0.6, -0.02]} material={leather}>
        <boxGeometry args={[0.045, 0.05, 0.3]} />
      </mesh>
      <mesh position={[0.24, 0.6, -0.02]} material={leather}>
        <boxGeometry args={[0.045, 0.05, 0.3]} />
      </mesh>
      {/* ruedas */}
      {Array.from({ length: 5 }, (_, i) => {
        const a = (i * Math.PI * 2) / 5
        return <mesh key={i} position={[Math.cos(a) * 0.17, 0.015, Math.sin(a) * 0.17]} material={metal}>
          <sphereGeometry args={[0.02, 8, 8]} />
        </mesh>
      })}
    </group>
  )
}

/* ---------- stand de café: espresso + tazas + platitos + cucharitas ---------- */
function CoffeeStand({ position }: { position: [number, number, number] }) {
  const metal = useMemo(() => metalMat('#2a2f2b', 0.4), [])
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: '#14181a', roughness: 0.5, metalness: 0.4 }), [])
  const porcelain = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#f4f1ea', roughness: 0.2, clearcoat: 0.9 }),
    [],
  )
  const steam = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#ffffff', transparent: true, opacity: 0.12, roughness: 1 }),
    [],
  )

  return (
    <group position={position}>
      {/* mesón */}
      <mesh position={[0, 0.42, 0]} material={metal}>
        <boxGeometry args={[0.9, 0.04, 0.42]} />
      </mesh>
      <mesh position={[-0.36, 0.2, 0.14]} material={dark}>
        <boxGeometry args={[0.05, 0.42, 0.05]} />
      </mesh>
      <mesh position={[0.36, 0.2, 0.14]} material={dark}>
        <boxGeometry args={[0.05, 0.42, 0.05]} />
      </mesh>
      <mesh position={[-0.36, 0.2, -0.14]} material={dark}>
        <boxGeometry args={[0.05, 0.42, 0.05]} />
      </mesh>
      <mesh position={[0.36, 0.2, -0.14]} material={dark}>
        <boxGeometry args={[0.05, 0.42, 0.05]} />
      </mesh>

      {/* máquina espresso */}
      <mesh position={[-0.22, 0.62, 0]} material={dark}>
        <boxGeometry args={[0.24, 0.36, 0.2]} />
      </mesh>
      <mesh position={[-0.22, 0.78, 0.11]} material={metal}>
        <boxGeometry args={[0.18, 0.04, 0.02]} />
      </mesh>
      <mesh position={[-0.22, 0.6, 0.12]} material={metal}>
        <cylinderGeometry args={[0.015, 0.02, 0.1, 8]} />
      </mesh>
      {/* vapor */}
      <mesh position={[-0.22, 0.92, 0]} material={steam}>
        <boxGeometry args={[0.02, 0.1, 0.02]} />
      </mesh>

      {/* tazas + platitos + cucharitas */}
      {[-0.05, 0.18].map((x, i) => (
        <group key={i} position={[x, 0.45, 0]}>
          <mesh position={[0, 0.006, 0]} material={porcelain}>
            <cylinderGeometry args={[0.075, 0.055, 0.012, 16]} />
          </mesh>
          <mesh position={[0, 0.035, 0]} material={porcelain}>
            <cylinderGeometry args={[0.042, 0.03, 0.05, 14]} />
          </mesh>
          <mesh position={[0.045, 0.035, 0]} rotation={[0, 0, Math.PI / 2]} material={porcelain}>
            <torusGeometry args={[0.02, 0.007, 8, 10]} />
          </mesh>
          <mesh position={[0.02, 0.015, 0.035]} rotation={[0.2, 0, 0.4]} material={metal}>
            <cylinderGeometry args={[0.005, 0.005, 0.16, 6]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/* ---------- planta ornamental (variación) ---------- */
function OrnamentalPlant({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const pot = useMemo(() => new THREE.MeshStandardMaterial({ color: '#3a3228', roughness: 0.7 }), [])
  const leaf = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1f5233', roughness: 0.85 }), [])
  const leaf2 = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2a6b41', roughness: 0.85 }), [])
  return (
    <group position={position} scale={[scale, scale, scale]}>
      <mesh position={[0, 0.16, 0]} material={pot}>
        <cylinderGeometry args={[0.16, 0.11, 0.34, 14]} />
      </mesh>
      <mesh position={[0, 0.6, 0]} material={leaf}>
        <sphereGeometry args={[0.26, 12, 12]} />
      </mesh>
      <mesh position={[0.18, 0.46, 0.06]} material={leaf2}>
        <sphereGeometry args={[0.13, 10, 10]} />
      </mesh>
      <mesh position={[-0.16, 0.5, -0.05]} material={leaf2}>
        <sphereGeometry args={[0.11, 10, 10]} />
      </mesh>
      <mesh position={[0.02, 0.78, 0.02]} material={leaf}>
        <sphereGeometry args={[0.12, 10, 10]} />
      </mesh>
    </group>
  )
}

/* ================================================================== */
/* Sala de reuniones (piso 4): mesa vidrio, 6 sillas, proyector,       */
/* stand de café, plantas.                                             */
/* ================================================================== */
export default function MeetingRoom() {
  const glassTop = useMemo(() => glassMat({ transmission: 0.8, roughness: 0.06 }), [])
  const metal = useMemo(() => metalMat('#1c211e', 0.35), [])
  const carpetTex = useMemo(() => createCarpetTexture('#cdd2ce', 33), [])
  const carpet = useMemo(() => carpetMat(carpetTex), [carpetTex])

  const chairs: [number, number, number][] = [
    [-0.9, 3.62, 0.78], [0.9, 3.62, 0.78], [-0.9, 3.62, -0.78], [0.9, 3.62, -0.78],
    [1.62, 3.62, 0], [-1.62, 3.62, 0],
  ]
  const chairRots = [Math.PI, Math.PI, 0, 0, -Math.PI / 2, Math.PI / 2]

  return (
    <group>
      {/* piso alfombrado */}
      <mesh position={[0, 3.63, 0]} rotation={[-Math.PI / 2, 0, 0]} material={carpet}>
        <planeGeometry args={[4.4, 3.2]} />
      </mesh>
      {/* ventanal con vista a Santiago */}
      <CityWindow position={[0, 4.25, -1.58]} width={2.2} height={1.2} />

      {/* luz central sobre la mesa */}
      <pointLight position={[0, 4.6, 0]} intensity={isHermesTUI ? 2 : 4} distance={6} color="#ffe8c8" />

      {/* mesa de vidrio */}
      <mesh position={[0, 4.02, 0]} material={glassTop}>
        <boxGeometry args={[2.7, 0.055, 1.15]} />
      </mesh>
      <mesh position={[0, 3.92, 0]} material={metal}>
        <boxGeometry args={[2.7, 0.05, 0.06]} />
      </mesh>
      <mesh position={[0, 3.92, 0]} material={metal}>
        <boxGeometry args={[0.06, 0.05, 1.15]} />
      </mesh>
      <mesh position={[0, 3.78, 0]} material={metal}>
        <cylinderGeometry args={[0.06, 0.09, 0.3, 10]} />
      </mesh>
      <mesh position={[0, 3.64, 0]} material={metal}>
        <cylinderGeometry args={[0.2, 0.2, 0.03, 16]} />
      </mesh>

      {/* sillas reclinables */}
      {chairs.map((p, i) => (
        <RecliningChair key={i} position={p} rotationY={chairRots[i]} />
      ))}

      {/* proyector en la pared norte + haz + pantalla con gráfico verde */}
      <LiveScreen kind="growth" seed={303} size={[2.2, 1.24]} position={[0, 4.3, -1.55]} />
      <mesh position={[0, 4.62, 0.9]} material={metal}>
        <boxGeometry args={[0.26, 0.12, 0.3]} />
      </mesh>
      <mesh position={[0, 4.62, 0.72]} rotation={[Math.PI / 2, 0, 0]} material={metal}>
        <cylinderGeometry args={[0.05, 0.09, 0.14, 10]} />
      </mesh>
      {/* haz de luz del proyector */}
      <mesh position={[0, 4.5, -0.2]} rotation={[0.35, 0, 0]}>
        <coneGeometry args={[0.9, 2.4, 16, 1, true]} />
        <meshBasicMaterial
          color="#42D879"
          transparent
          opacity={0.05}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* stand de café */}
      <CoffeeStand position={[-1.85, 3.62, 1.35]} />

      {/* plantas ornamentales */}
      <OrnamentalPlant position={[1.95, 3.62, 1.3]} />
      <OrnamentalPlant position={[-1.95, 3.62, -1.25]} scale={0.8} />
    </group>
  )
}
