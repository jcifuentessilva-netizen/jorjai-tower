import * as THREE from 'three'

/* ================================================================== */
/* Texturas procedurales compartidas (canvas, deterministas)           */
/* ================================================================== */

/** Grid de ventanas para fachadas. Algunas iluminadas (seed-driven). */
export function createFacadeTexture(seed: number, cols = 6, rows = 14): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 1024
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#080d0b'
  ctx.fillRect(0, 0, 512, 1024)

  const pad = 14
  const gap = 8
  const w = (512 - pad * 2 - gap * (cols - 1)) / cols
  const h = (1024 - pad * 2 - gap * (rows - 1)) / rows

  let s = seed >>> 0
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = pad + c * (w + gap)
      const y = pad + r * (h + gap)
      const lit = rand() > 0.42
      if (lit) {
        const warm = rand() > 0.55
        ctx.fillStyle = warm ? 'rgba(255, 208, 150, 0.92)' : 'rgba(178, 232, 200, 0.88)'
      } else {
        ctx.fillStyle = 'rgba(14, 24, 20, 0.96)'
      }
      ctx.fillRect(x, y, w, h)
      ctx.strokeStyle = 'rgba(90, 116, 104, 0.55)'
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, w, h)
      ctx.fillStyle = 'rgba(255,255,255,0.06)'
      ctx.fillRect(x + w * 0.15, y, w * 0.18, h)
    }
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

/** Pantalla de monitor con pseudo-código. */
export function createCodeTexture(seed: number, neon: string, dim: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 160
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#070b09'
  ctx.fillRect(0, 0, 256, 160)

  let s = seed >>> 0
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }

  for (let y = 10; y < 150; y += 12) {
    ctx.fillStyle = rand() > 0.5 ? neon : dim
    const indent = Math.floor(rand() * 4) * 14
    let x = 8 + indent
    while (x < 240) {
      const w = 10 + rand() * 34
      ctx.globalAlpha = 0.35 + rand() * 0.65
      ctx.fillRect(x, y, w, 4)
      x += w + 6
    }
  }
  ctx.globalAlpha = 1
  ctx.fillStyle = neon
  ctx.fillRect(120, 34, 3, 10)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Sprite radial suave (glow) para partículas y nubes. */
export function createGlowTexture(): THREE.CanvasTexture {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.6)')
  g.addColorStop(0.6, 'rgba(255,255,255,0.15)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Vetas de madera procedural (bump + color). */
export function createWoodTexture(seed = 3): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#6b4a2e'
  ctx.fillRect(0, 0, 256, 256)

  let s = seed >>> 0
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  for (let y = 0; y < 256; y += 2 + rand() * 7) {
    const shade = 75 + Math.floor(rand() * 35)
    ctx.strokeStyle = `rgba(${shade}, ${shade * 0.7}, ${shade * 0.42}, ${0.25 + rand() * 0.35})`
    ctx.lineWidth = 1 + rand() * 2
    ctx.beginPath()
    ctx.moveTo(0, y)
    for (let x = 0; x <= 256; x += 32) {
      ctx.lineTo(x, y + Math.sin(x * 0.05 + y * 0.3) * 3 + rand() * 2)
    }
    ctx.stroke()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

const SKIN_TONES = ['#d9a47e', '#b57e5a', '#8d5a3b', '#e8b98f']

/** Rostro humano equirectangular: piel + ojos + cejas + boca (+ barba opcional). */
export function createFaceTexture(seed = 1): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!

  let s = seed >>> 0
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }

  const skin = SKIN_TONES[seed % SKIN_TONES.length]
  ctx.fillStyle = skin
  ctx.fillRect(0, 0, 256, 256)

  // sombreado suave del rostro (luz frontal)
  const grad = ctx.createRadialGradient(128, 108, 30, 128, 128, 120)
  grad.addColorStop(0, 'rgba(255,255,255,0.10)')
  grad.addColorStop(1, 'rgba(0,0,0,0.18)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 256, 256)

  const ey = 118
  const eGap = 42

  // ojos: blanco + iris + pupila
  for (const side of [-1, 1]) {
    const cx = 128 + side * eGap
    ctx.fillStyle = '#f4f2ee'
    ctx.beginPath()
    ctx.ellipse(cx, ey, 17, 10.5, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = 'rgba(60,45,35,0.5)'
    ctx.lineWidth = 1.5
    ctx.stroke()
    // iris
    ctx.fillStyle = rand() > 0.5 ? '#3e4a33' : '#4a3b2a'
    ctx.beginPath()
    ctx.arc(cx, ey, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#0d0d0d'
    ctx.beginPath()
    ctx.arc(cx, ey, 3.4, 0, Math.PI * 2)
    ctx.fill()
    // brillo
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
    ctx.beginPath()
    ctx.arc(cx - 2.2, ey - 2.4, 1.6, 0, Math.PI * 2)
    ctx.fill()
  }

  // cejas
  ctx.strokeStyle = 'rgba(40,28,18,0.75)'
  ctx.lineWidth = 3.2
  ctx.lineCap = 'round'
  for (const side of [-1, 1]) {
    const cx = 128 + side * eGap
    ctx.beginPath()
    ctx.moveTo(cx - 12, ey - 18)
    ctx.quadraticCurveTo(cx, ey - 23, cx + 12, ey - 18)
    ctx.stroke()
  }

  // nariz (sombra sutil)
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(128, ey + 6)
  ctx.quadraticCurveTo(132, ey + 18, 128, ey + 26)
  ctx.stroke()

  // boca
  ctx.strokeStyle = 'rgba(120,60,45,0.85)'
  ctx.lineWidth = 2.6
  ctx.beginPath()
  ctx.moveTo(108, ey + 48)
  ctx.quadraticCurveTo(128, ey + 56, 148, ey + 48)
  ctx.stroke()

  // barba / vello opcional
  if (rand() > 0.55) {
    ctx.fillStyle = `rgba(45,32,20,${0.18 + rand() * 0.2})`
    ctx.beginPath()
    ctx.ellipse(128, ey + 44, 42, 20, 0, 0, Math.PI * 2)
    ctx.fill()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}
