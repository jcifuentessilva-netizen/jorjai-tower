import { useMemo } from 'react'
import * as THREE from 'three'
import { metalMat, leatherMat, fabricMat, carpetMat } from '../../lib/materials'
import { createFabricTexture, createCarpetTexture } from '../../lib/textures'
import CityWindow from '../environment/CityWindow'

const isHermesTUI = typeof __HERMES_TUI__ !== 'undefined' && __HERMES_TUI__

/* ---------- sofá texturizado ---------- */
function Sofa({ position, rotationY = 0, scale = 1, color = '#7d857f' }: { position: [number, number, number]; rotationY?: number; scale?: number; color?: string }) {
  const tex = useMemo(() => createFabricTexture(color, 4), [color])
  const fabric = useMemo(() => fabricMat(tex, color), [tex, color])
  const dark = useMemo(() => metalMat('#181c1a', 0.6), [])

  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={[scale, scale, scale]}>
      {/* asiento */}
      <mesh position={[0, 0.22, 0]} material={fabric}>
        <boxGeometry args={[1.5, 0.3, 0.72]} />
      </mesh>
      {/* respaldo */}
      <mesh position={[0, 0.48, -0.32]} material={fabric}>
        <boxGeometry args={[1.5, 0.52, 0.16]} />
      </mesh>
      {/* cojines */}
      <mesh position={[-0.38, 0.4, -0.02]} rotation={[0.12, 0, 0]} material={fabric}>
        <boxGeometry args={[0.6, 0.1, 0.4]} />
      </mesh>
      <mesh position={[0.38, 0.4, -0.02]} rotation={[0.12, 0, 0]} material={fabric}>
        <boxGeometry args={[0.6, 0.1, 0.4]} />
      </mesh>
      {/* reposabrazos */}
      <mesh position={[-0.78, 0.3, -0.04]} material={fabric}>
        <boxGeometry args={[0.12, 0.42, 0.76]} />
      </mesh>
      <mesh position={[0.78, 0.3, -0.04]} material={fabric}>
        <boxGeometry args={[0.12, 0.42, 0.76]} />
      </mesh>
      {/* patas */}
      <mesh position={[-0.62, 0.06, 0.26]} material={dark}>
        <cylinderGeometry args={[0.02, 0.025, 0.14, 8]} />
      </mesh>
      <mesh position={[0.62, 0.06, 0.26]} material={dark}>
        <cylinderGeometry args={[0.02, 0.025, 0.14, 8]} />
      </mesh>
      <mesh position={[-0.62, 0.06, -0.28]} material={dark}>
        <cylinderGeometry args={[0.02, 0.025, 0.14, 8]} />
      </mesh>
      <mesh position={[0.62, 0.06, -0.28]} material={dark}>
        <cylinderGeometry args={[0.02, 0.025, 0.14, 8]} />
      </mesh>
    </group>
  )
}

/* ---------- mesa de ping-pong ---------- */
function PingPong({ position }: { position: [number, number, number] }) {
  const wood = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#2e7d4f', roughness: 0.6, clearcoat: 0.3 }), [])
  const metal = useMemo(() => metalMat('#23282a', 0.4), [])
  return (
    <group position={position}>
      {/* tablero */}
      <mesh position={[0, 0.72, 0]} material={wood}>
        <boxGeometry args={[1.5, 0.05, 0.78]} />
      </mesh>
      {/* líneas */}
      <mesh position={[0, 0.745, 0]} material={leatherMat('#f4f7f4')}>
        <boxGeometry args={[1.5, 0.004, 0.012]} />
      </mesh>
      <mesh position={[0, 0.745, 0]} material={leatherMat('#f4f7f4')}>
        <boxGeometry args={[0.012, 0.004, 0.78]} />
      </mesh>
      {/* red */}
      <mesh position={[0, 0.82, 0]} material={leatherMat('#dfe6e2')}>
        <boxGeometry args={[1.5, 0.12, 0.008]} />
      </mesh>
      {/* patas */}
      {[-0.62, 0.62].map((x) => (
        <mesh key={x} position={[x, 0.36, 0]} material={metal}>
          <boxGeometry args={[0.05, 0.7, 0.05]} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------- futbolito ---------- */
function Foosball({ position }: { position: [number, number, number] }) {
  const body = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#2a3140', roughness: 0.5, clearcoat: 0.4 }), [])
  const metal = useMemo(() => metalMat('#9aa3a0', 0.3), [])
  const ballMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f4f7f4', roughness: 0.4 }), [])
  return (
    <group position={position}>
      {/* mesa */}
      <mesh position={[0, 0.55, 0]} material={body}>
        <boxGeometry args={[0.62, 0.14, 1.1]} />
      </mesh>
      {/* campo */}
      <mesh position={[0, 0.63, 0]} material={leatherMat('#1d4a2e')}>
        <planeGeometry args={[0.5, 0.98]} />
      </mesh>
      {/* barras */}
      {[-0.18, 0.18].map((z) => (
        <group key={z}>
          <mesh position={[0, 0.55, z]} rotation={[Math.PI / 2, 0, 0]} material={metal}>
            <cylinderGeometry args={[0.012, 0.012, 0.86, 6]} />
          </mesh>
          {[-0.3, 0.3].map((x) => (
            <mesh key={x} position={[x, 0.55, z]} material={metal}>
              <cylinderGeometry args={[0.02, 0.02, 0.05, 6]} />
            </mesh>
          ))}
        </group>
      ))}
      {/* jugadores */}
      {[-0.3, 0.3].map((x) =>
        [-0.2, 0, 0.2].map((z) => (
          <mesh key={`${x}${z}`} position={[x, 0.55, z * 1.2]} material={leatherMat('#1d3a5f')}>
            <cylinderGeometry args={[0.025, 0.025, 0.07, 6]} />
          </mesh>
        )),
      )}
      {/* balón */}
      <mesh position={[0.05, 0.5, 0.1]} material={ballMat}>
        <sphereGeometry args={[0.03, 10, 10]} />
      </mesh>
      {/* patas */}
      {[-0.25, 0.25].map((x) => (
        <mesh key={x} position={[x, 0.25, -0.4]} material={metal}>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
        </mesh>
      ))}
      {[-0.25, 0.25].map((x) => (
        <mesh key={x} position={[x, 0.25, 0.4]} material={metal}>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
        </mesh>
      ))}
    </group>
  )
}

/* ---------- máquina de bebidas ---------- */
function DrinkMachine({ position }: { position: [number, number, number] }) {
  const body = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#1c2326', roughness: 0.4, clearcoat: 0.7 }), [])
  const glass = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: '#bfe0d4', transmission: 0.85, roughness: 0.15, clearcoat: 1 }),
    [],
  )
  const metal = useMemo(() => metalMat('#2a2f2c', 0.4), [])
  const neon = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#42D879',
        emissive: new THREE.Color('#42D879'),
        emissiveIntensity: 1.8,
      }),
    [],
  )
  return (
    <group position={position}>
      {/* cuerpo */}
      <mesh position={[0, 0.85, 0]} material={body}>
        <boxGeometry args={[0.62, 1.4, 0.5]} />
      </mesh>
      {/* puerta de vidrio con botellas */}
      <mesh position={[0, 0.8, 0.26]} material={glass}>
        <boxGeometry args={[0.5, 1.1, 0.02]} />
      </mesh>
      {[-0.16, 0, 0.16].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.7, 0.25]} material={metal}>
            <cylinderGeometry args={[0.028, 0.028, 0.2, 8]} />
          </mesh>
          <mesh position={[x, 0.62, 0.25]} material={leatherMat(i === 1 ? '#42D879' : '#8fd0ff')}>
            <cylinderGeometry args={[0.012, 0.012, 0.05, 6]} />
          </mesh>
        </group>
      ))}
      {/* panel + botones */}
      <mesh position={[0, 1.45, 0.26]} material={metal}>
        <boxGeometry args={[0.4, 0.12, 0.02]} />
      </mesh>
      <mesh position={[0.12, 1.32, 0.27]} material={neon}>
        <planeGeometry args={[0.06, 0.06]} />
      </mesh>
      {/* rejilla de salida */}
      <mesh position={[0, 0.22, 0.27]} material={metal}>
        <boxGeometry args={[0.3, 0.04, 0.02]} />
      </mesh>
    </group>
  )
}

/* ================================================================== */
/* Esparcimiento (piso 5): lounge + juegos + bebidas + ventanal.       */
/* ================================================================== */
export default function LoungeRoom() {
  const carpetTex = useMemo(() => createCarpetTexture('#c3c8c4', 21), [])
  const carpet = useMemo(() => carpetMat(carpetTex), [carpetTex])
  const wood = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#5c4128', roughness: 0.55, clearcoat: 0.3 }), [])
  const metal = useMemo(() => metalMat('#23282a', 0.4), [])

  return (
    <group>
      {/* alfombra clara */}
      <mesh position={[0, 4.88, 0]} rotation={[-Math.PI / 2, 0, 0]} material={carpet}>
        <planeGeometry args={[4.4, 3.2]} />
      </mesh>

      {/* luz cálida */}
      <pointLight position={[0, 5.9, 0]} intensity={isHermesTUI ? 2 : 4} distance={7} color="#ffdfb0" />

      {/* ventanal con vista a Santiago */}
      <CityWindow position={[0, 5.5, -1.58]} width={2.4} height={1.3} />

      {/* lounge: sofás + mesa de centro */}
      <Sofa position={[-1.05, 4.88, 1.15]} rotationY={0.15} color="#7d857f" />
      <Sofa position={[1.1, 4.88, 1.05]} rotationY={-0.2} scale={0.9} color="#8a929c" />
      <mesh position={[0, 5.22, 0.55]} material={wood}>
        <cylinderGeometry args={[0.26, 0.26, 0.045, 20]} />
      </mesh>
      <mesh position={[0, 5.24, 0.55]} material={metal}>
        <cylinderGeometry args={[0.03, 0.03, 0.3, 8]} />
      </mesh>

      {/* juegos */}
      <PingPong position={[0, 4.88, -0.55]} />
      <Foosball position={[-1.75, 4.88, -0.9]} />

      {/* máquina de bebidas + tazas */}
      <DrinkMachine position={[1.8, 4.88, -1.1]} />
      <mesh position={[1.15, 4.92, -1.35]} material={metal}>
        <boxGeometry args={[0.4, 0.04, 0.25]} />
      </mesh>
      {[0.95, 1.15, 1.35].map((x) => (
        <mesh key={x} position={[x, 4.94, -1.35]} material={leatherMat('#f4f1ea')}>
          <cylinderGeometry args={[0.03, 0.025, 0.06, 10]} />
        </mesh>
      ))}

      {/* plantas */}
      <group position={[-1.9, 4.88, 1.35]}>
        <mesh position={[0, 0.18, 0]} material={metal}>
          <cylinderGeometry args={[0.15, 0.11, 0.36, 12]} />
        </mesh>
        <mesh position={[0, 0.62, 0]} material={leatherMat('#1f5233')}>
          <sphereGeometry args={[0.28, 12, 12]} />
        </mesh>
        <mesh position={[0.18, 0.5, 0.06]} material={leatherMat('#2a6b41')}>
          <sphereGeometry args={[0.13, 10, 10]} />
        </mesh>
      </group>
    </group>
  )
}
