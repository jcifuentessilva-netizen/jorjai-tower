/* ------------------------------------------------------------------ */
/* xMachine — state machine puro (sin React/Three): 11 fases del viaje */
/* El progreso global (0..1) deriva cámara y atmósfera interpoladas.   */
/* ------------------------------------------------------------------ */

export type Phase =
  | 'apertura'
  | 'presentacion'
  | 'lobby'
  | 'oficinas'
  | 'labs'
  | 'experiencia'
  | 'tecnologia'
  | 'valores'
  | 'datos'
  | 'conversion'
  | 'cierre'

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface CameraKeyframe {
  position: Vec3
  target: Vec3
  fov: number
}

export interface AtmosphereKeyframe {
  bgColor: string
  fogColor: string
  fogNear: number
  fogFar: number
  ambientIntensity: number
  pointIntensity: number
  pointColor: string
}

export interface PhaseData {
  name: Phase
  progressStart: number
  progressEnd: number
  camera: CameraKeyframe
  atmosphere: AtmosphereKeyframe
  title: string
  subtitle: string
}

/* ---------------- Paleta JORJAI ---------------- */
const NEGRO = '#050505'
const NEON = '#42D879'
const HIELO = '#F4F7F4'
const CALIDO = '#ffd9a0'
const AZUL_NOCHE = '#0a1120'
const AMARILLO_TARDE = '#ffb36b'

export const PHASES: PhaseData[] = [
  {
    name: 'apertura',
    progressStart: 0.0,
    progressEnd: 0.09,
    camera: { position: { x: 0, y: 4.2, z: 17 }, target: { x: 0, y: 3, z: 0 }, fov: 42 },
    atmosphere: {
      bgColor: NEGRO,
      fogColor: NEGRO,
      fogNear: 20,
      fogFar: 46,
      ambientIntensity: 0.16,
      pointIntensity: 3,
      pointColor: NEON,
    },
    title: 'JORJAI',
    subtitle: 'Dar átomos a la IA',
  },
  {
    name: 'presentacion',
    progressStart: 0.09,
    progressEnd: 0.18,
    camera: { position: { x: 8, y: 5.2, z: 6 }, target: { x: 0, y: 4, z: 0 }, fov: 40 },
    atmosphere: {
      bgColor: AZUL_NOCHE,
      fogColor: AZUL_NOCHE,
      fogNear: 18,
      fogFar: 44,
      ambientIntensity: 0.22,
      pointIntensity: 4,
      pointColor: NEON,
    },
    title: 'La torre donde se construye el futuro',
    subtitle: '6 pisos · IA · Automatización · Web',
  },
  {
    name: 'lobby',
    progressStart: 0.18,
    progressEnd: 0.3,
    camera: { position: { x: 0, y: 1.65, z: 1.25 }, target: { x: 0, y: 1.4, z: -0.8 }, fov: 58 },
    atmosphere: {
      bgColor: '#0d1512',
      fogColor: '#0d1512',
      fogNear: 6,
      fogFar: 20,
      ambientIntensity: 0.35,
      pointIntensity: 6,
      pointColor: CALIDO,
    },
    title: 'Bienvenido al lobby',
    subtitle: 'Jordan + Jaime · Puente Alto, Santiago',
  },
  {
    name: 'oficinas',
    progressStart: 0.3,
    progressEnd: 0.42,
    camera: { position: { x: 1.9, y: 3.55, z: 1.45 }, target: { x: -0.4, y: 3.15, z: -0.6 }, fov: 55 },
    atmosphere: {
      bgColor: '#101a16',
      fogColor: '#101a16',
      fogNear: 8,
      fogFar: 24,
      ambientIntensity: 0.4,
      pointIntensity: 5,
      pointColor: HIELO,
    },
    title: 'Las oficinas',
    subtitle: 'Ideas → código → productos reales',
  },
  {
    name: 'labs',
    progressStart: 0.42,
    progressEnd: 0.54,
    camera: { position: { x: 0, y: 4.2, z: 1.3 }, target: { x: 0, y: 4.05, z: -0.5 }, fov: 52 },
    atmosphere: {
      bgColor: '#0c1410',
      fogColor: '#0c1410',
      fogNear: 6,
      fogFar: 16,
      ambientIntensity: 0.4,
      pointIntensity: 5,
      pointColor: NEON,
    },
    title: 'Sala de reuniones',
    subtitle: 'Estrategia, decisiones y datos en tiempo real',
  },
  {
    name: 'experiencia',
    progressStart: 0.54,
    progressEnd: 0.64,
    camera: { position: { x: 0, y: 5.5, z: 1.3 }, target: { x: 0, y: 5.3, z: -0.4 }, fov: 55 },
    atmosphere: {
      bgColor: '#15100b',
      fogColor: '#15100b',
      fogNear: 6,
      fogFar: 16,
      ambientIntensity: 0.45,
      pointIntensity: 5,
      pointColor: AMARILLO_TARDE,
    },
    title: 'Esparcimiento',
    subtitle: 'Pausa, café y buen ambiente',
  },
  {
    name: 'tecnologia',
    progressStart: 0.64,
    progressEnd: 0.74,
    camera: { position: { x: 0, y: 7.55, z: 1.3 }, target: { x: 0, y: 7.35, z: -0.4 }, fov: 55 },
    atmosphere: {
      bgColor: '#0b100d',
      fogColor: '#0b100d',
      fogNear: 6,
      fogFar: 16,
      ambientIntensity: 0.4,
      pointIntensity: 5,
      pointColor: CALIDO,
    },
    title: 'El estudio creativo',
    subtitle: 'Inspiración con vista a todo Santiago',
  },
  {
    name: 'valores',
    progressStart: 0.74,
    progressEnd: 0.82,
    camera: { position: { x: 0, y: 4, z: 8 }, target: { x: 0, y: 3.6, z: 0 }, fov: 42 },
    atmosphere: {
      bgColor: '#121008',
      fogColor: '#121008',
      fogNear: 10,
      fogFar: 26,
      ambientIntensity: 0.45,
      pointIntensity: 4,
      pointColor: CALIDO,
    },
    title: 'Valores',
    subtitle: 'Curiosidad · Construcción · Cercanía · Ambición',
  },
  {
    name: 'datos',
    progressStart: 0.82,
    progressEnd: 0.9,
    camera: { position: { x: 0, y: 6, z: 16 }, target: { x: 0, y: 4, z: 0 }, fov: 38 },
    atmosphere: {
      bgColor: '#04120b',
      fogColor: '#04120b',
      fogNear: 16,
      fogFar: 38,
      ambientIntensity: 0.28,
      pointIntensity: 6,
      pointColor: NEON,
    },
    title: 'Datos',
    subtitle: 'Proyectos · Clientes · Crecimiento',
  },
  {
    name: 'conversion',
    progressStart: 0.9,
    progressEnd: 0.96,
    camera: { position: { x: 0, y: 1.8, z: 4.2 }, target: { x: 0, y: 1.5, z: 0 }, fov: 45 },
    atmosphere: {
      bgColor: '#0a0d0b',
      fogColor: '#0a0d0b',
      fogNear: 8,
      fogFar: 22,
      ambientIntensity: 0.35,
      pointIntensity: 5,
      pointColor: NEON,
    },
    title: 'Construyamos tu torre',
    subtitle: 'Cotiza tu proyecto digital',
  },
  {
    name: 'cierre',
    progressStart: 0.96,
    progressEnd: 1.0,
    camera: { position: { x: 0, y: 13, z: 13 }, target: { x: 0, y: 6.5, z: 0 }, fov: 35 },
    atmosphere: {
      bgColor: '#020409',
      fogColor: '#020409',
      fogNear: 18,
      fogFar: 44,
      ambientIntensity: 0.2,
      pointIntensity: 4,
      pointColor: HIELO,
    },
    title: 'El futuro se construye desde Puente Alto',
    subtitle: 'JORJAI · Dar átomos a la IA',
  },
]

/* ---------------- Helpers de interpolación ---------------- */

export function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}

function hexToRgb(hex: string): Vec3 {
  const n = parseInt(hex.slice(1), 16)
  return { x: (n >> 16) & 255, y: (n >> 8) & 255, z: n & 255 }
}

function rgbToHex(rgb: Vec3): string {
  const c = (v: number) => Math.round(clamp01(v / 255) * 255).toString(16).padStart(2, '0')
  return `#${c(rgb.x)}${c(rgb.y)}${c(rgb.z)}`
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function lerpVec(a: Vec3, b: Vec3, t: number): Vec3 {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), z: lerp(a.z, b.z, t) }
}

function lerpColor(a: string, b: string, t: number): string {
  return rgbToHex(lerpVec(hexToRgb(a), hexToRgb(b), t))
}

/** Índice de la fase actual + progreso local 0..1 dentro de ella. */
function phaseWindow(progress: number): { index: number; local: number } {
  const p = clamp01(progress)
  for (let i = PHASES.length - 1; i >= 0; i--) {
    const ph = PHASES[i]
    if (p >= ph.progressStart) {
      const span = Math.max(0.0001, ph.progressEnd - ph.progressStart)
      return { index: i, local: clamp01((p - ph.progressStart) / span) }
    }
  }
  return { index: 0, local: 0 }
}

export function derivePhase(progress: number): Phase {
  return PHASES[phaseWindow(progress).index].name
}

export function deriveLocalProgress(progress: number): number {
  return phaseWindow(progress).local
}

/** Cámara interpolada entre el keyframe actual y el siguiente (movimiento continuo). */
export function deriveCamera(progress: number): CameraKeyframe {
  const { index, local } = phaseWindow(progress)
  const a = PHASES[index]
  const b = PHASES[Math.min(index + 1, PHASES.length - 1)]
  const t = local
  return {
    position: lerpVec(a.camera.position, b.camera.position, t),
    target: lerpVec(a.camera.target, b.camera.target, t),
    fov: lerp(a.camera.fov, b.camera.fov, t),
  }
}

export function deriveAtmosphere(progress: number): AtmosphereKeyframe {
  const { index, local } = phaseWindow(progress)
  const a = PHASES[index]
  const b = PHASES[Math.min(index + 1, PHASES.length - 1)]
  const t = local
  return {
    bgColor: lerpColor(a.atmosphere.bgColor, b.atmosphere.bgColor, t),
    fogColor: lerpColor(a.atmosphere.fogColor, b.atmosphere.fogColor, t),
    fogNear: lerp(a.atmosphere.fogNear, b.atmosphere.fogNear, t),
    fogFar: lerp(a.atmosphere.fogFar, b.atmosphere.fogFar, t),
    ambientIntensity: lerp(a.atmosphere.ambientIntensity, b.atmosphere.ambientIntensity, t),
    pointIntensity: lerp(a.atmosphere.pointIntensity, b.atmosphere.pointIntensity, t),
    pointColor: lerpColor(a.atmosphere.pointColor, b.atmosphere.pointColor, t),
  }
}

/* Progreso global publicado por el scroll controller */
declare global {
  interface Window {
    __JORJAI_PROGRESS__?: number
  }
}
