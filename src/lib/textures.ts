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

/** Alfombra de oficina: base clara + speckle fino de tejido. */
export function createCarpetTexture(base = '#b9bfbb', seed = 9): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 256, 256)

  let s = seed >>> 0
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  for (let i = 0; i < 9000; i++) {
    const v = 60 + Math.floor(rand() * 60)
    ctx.fillStyle = `rgba(${v},${v + 6},${v + 8},${0.10 + rand() * 0.12})`
    ctx.fillRect(rand() * 256, rand() * 256, 1.6, 1.6)
  }
  for (let y = 0; y < 256; y += 3) {
    ctx.fillStyle = `rgba(255,255,255,${0.015 + (y % 6 === 0 ? 0.02 : 0)})`
    ctx.fillRect(0, y, 256, 1)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

/** Tela de sofá: color base + tejido diagonal fino (tweed). */
export function createFabricTexture(base = '#8a8f8c', seed = 4): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 256, 256)

  let s = seed >>> 0
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  for (let i = 0; i < 1200; i++) {
    ctx.strokeStyle = `rgba(${20 + rand() * 40},${20 + rand() * 40},${22 + rand() * 40},${0.10 + rand() * 0.15})`
    ctx.lineWidth = 1
    ctx.beginPath()
    const x = rand() * 256
    ctx.moveTo(x, 0)
    ctx.lineTo(x + 14, 256)
    ctx.stroke()
  }
  for (let i = 0; i < 4000; i++) {
    const v = 70 + Math.floor(rand() * 50)
    ctx.fillStyle = `rgba(${v},${v},${v + 4},${0.12 + rand() * 0.1})`
    ctx.fillRect(rand() * 256, rand() * 256, 1.5, 1.5)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

/** Vista nocturna de Santiago: cordillera de los Andes + skyline con ventanas. */
export function createSantiagoViewTexture(seed = 5): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  let s = seed >>> 0
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }

  const sky = ctx.createLinearGradient(0, 0, 0, 512)
  sky.addColorStop(0, '#0b1522')
  sky.addColorStop(0.55, '#101e30')
  sky.addColorStop(1, '#152437')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, 1024, 512)

  // cordillera de los Andes
  ctx.fillStyle = '#1b2636'
  ctx.beginPath()
  ctx.moveTo(0, 512)
  for (let x = 0; x <= 1024; x += 8) {
    const y = 330 - (Math.sin(x * 0.004) * 46 + Math.sin(x * 0.011 + 2) * 30 + Math.sin(x * 0.027 + 1) * 12)
    ctx.lineTo(x, y)
  }
  ctx.lineTo(1024, 512)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = 'rgba(190,215,235,0.10)'
  for (let x = 0; x < 1024; x += 8) {
    const y = 330 - (Math.sin(x * 0.004) * 46 + Math.sin(x * 0.011 + 2) * 30 + Math.sin(x * 0.027 + 1) * 12)
    if (y < 292) ctx.fillRect(x, y, 8, 10)
  }

  const rows: { base: number; hmin: number; hmax: number; color: string }[] = [
    { base: 512, hmin: 120, hmax: 210, color: '#0e1a26' },
    { base: 512, hmin: 230, hmax: 330, color: '#0a131c' },
  ]
  let wx = 0
  rows.forEach((row, ri) => {
    wx = ri * 60
    while (wx < 1024) {
      const w = 26 + rand() * 44
      const h = row.hmin + rand() * (row.hmax - row.hmin)
      ctx.fillStyle = row.color
      ctx.fillRect(wx, row.base - h, w, h)
      const cols = Math.floor(w / 8)
      const rowsW = Math.floor(h / 10)
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rowsW; r++) {
          if (rand() > 0.62) {
            ctx.fillStyle = rand() > 0.55 ? 'rgba(255,208,150,0.85)' : 'rgba(170,215,235,0.7)'
            ctx.fillRect(wx + 3 + c * 8, row.base - h + 4 + r * 10, 4, 5)
          }
        }
      }
      if (rand() > 0.7) {
        ctx.fillStyle = '#ff5555'
        ctx.fillRect(wx + w / 2 - 2, row.base - h - 6, 4, 4)
      }
      wx += w + 4 + rand() * 10
    }
  })

  const glow = ctx.createLinearGradient(0, 430, 0, 512)
  glow.addColorStop(0, 'rgba(255,180,110,0)')
  glow.addColorStop(1, 'rgba(255,180,110,0.14)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 430, 1024, 82)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

const SKIN_TONES = ['#d9a47e', '#b57e5a', '#8d5a3b', '#e8b98f']

/** Adoquín/cemento de plaza: losas con juntas y variación. */
export function createPlazaTexture(seed = 17): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#8d928e'
  ctx.fillRect(0, 0, 512, 512)

  let s = seed >>> 0
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  // variación de tono por losa (grid 4x4)
  const grid = 4
  const cell = 512 / grid
  for (let gx = 0; gx < grid; gx++) {
    for (let gy = 0; gy < grid; gy++) {
      const v = 120 + Math.floor(rand() * 40)
      ctx.fillStyle = `rgb(${v},${v + 3},${v + 4})`
      ctx.fillRect(gx * cell + 2, gy * cell + 2, cell - 4, cell - 4)
      // speckle
      for (let i = 0; i < 400; i++) {
        const sv = 90 + Math.floor(rand() * 60)
        ctx.fillStyle = `rgba(${sv},${sv},${sv - 4},0.12)`
        ctx.fillRect(gx * cell + rand() * cell, gy * cell + rand() * cell, 2.5, 2.5)
      }
    }
  }
  // juntas oscuras
  ctx.strokeStyle = 'rgba(40,44,42,0.55)'
  ctx.lineWidth = 3
  for (let i = 0; i <= grid; i++) {
    ctx.beginPath()
    ctx.moveTo(i * cell, 0)
    ctx.lineTo(i * cell, 512)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, i * cell)
    ctx.lineTo(512, i * cell)
    ctx.stroke()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

/** Césped: verde base con variación de hojas. */
export function createGrassTexture(seed = 23): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#2c5e33'
  ctx.fillRect(0, 0, 256, 256)

  let s = seed >>> 0
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  for (let i = 0; i < 14000; i++) {
    const g = 60 + Math.floor(rand() * 60)
    ctx.fillStyle = `rgba(${g - 20},${g + 20},${g - 10},${0.25 + rand() * 0.35})`
    const x = rand() * 256
    const y = rand() * 256
    ctx.fillRect(x, y, 1.5, 2 + rand() * 2)
  }
  for (let y = 0; y < 256; y += 4) {
    ctx.fillStyle = `rgba(255,255,255,${0.012 + (y % 8 === 0 ? 0.018 : 0)})`
    ctx.fillRect(0, y, 256, 1)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

/** Hoja de papel con texto (briefs, documentos, wireframes). */
export function createPaperTexture(seed = 8, lines = 7): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 160
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#f7f5ef'
  ctx.fillRect(0, 0, 256, 160)
  // borde de hoja
  ctx.strokeStyle = 'rgba(160,150,130,0.5)'
  ctx.lineWidth = 1
  ctx.strokeRect(1, 1, 254, 158)

  let s = seed >>> 0
  const rand = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  // título garabateado
  ctx.strokeStyle = 'rgba(60,70,90,0.75)'
  ctx.lineWidth = 2.4
  ctx.beginPath()
  ctx.moveTo(14, 18)
  ctx.quadraticCurveTo(40, 12, 70, 17)
  ctx.quadraticCurveTo(110, 23, 150, 16)
  ctx.stroke()
  // líneas de texto
  ctx.strokeStyle = 'rgba(90,95,105,0.55)'
  ctx.lineWidth = 1.6
  for (let i = 0; i < lines; i++) {
    const y = 30 + i * 15
    const w = 60 + rand() * 160
    ctx.beginPath()
    ctx.moveTo(14, y)
    ctx.quadraticCurveTo(14 + w / 2, y - 2, 14 + w, y)
    ctx.stroke()
  }
  // caja de wireframe (rect con cruz)
  if (rand() > 0.3) {
    ctx.strokeStyle = 'rgba(70,80,95,0.7)'
    ctx.lineWidth = 1.5
    const x = 20 + rand() * 100
    const y = 36 + rand() * 60
    ctx.strokeRect(x, y, 40 + rand() * 60, 24 + rand() * 24)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/** Pizarra blanca con diagrama de flujo UX (cajas, flechas, notas). */
export function createWhiteboardTexture(_seed = 31): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 288
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#eef2ee'
  ctx.fillRect(0, 0, 512, 288)

  const ink = 'rgba(30,60,90,0.8)'
  const ink2 = 'rgba(190,60,50,0.75)'
  const ink3 = 'rgba(40,120,70,0.8)'

  // nodos del flujo
  const nodes: [number, number, number, number, string][] = [
    [30, 60, 120, 44, ink], [200, 60, 130, 44, ink], [380, 60, 110, 44, ink2],
    [110, 180, 140, 44, ink3], [320, 180, 130, 44, ink],
  ]
  for (const [x, y, w, h, c] of nodes) {
    ctx.strokeStyle = c
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.roundRect(x, y, w, h, 8)
    ctx.stroke()
    // texto garabateado dentro
    ctx.beginPath()
    ctx.moveTo(x + 14, y + h / 2)
    ctx.quadraticCurveTo(x + w / 2, y + h / 2 - 3, x + w - 14, y + h / 2)
    ctx.stroke()
  }
  // flechas
  ctx.strokeStyle = ink
  ctx.lineWidth = 2
  const links: [number, number][] = [[0, 1], [1, 2], [0, 3], [1, 3], [2, 4], [3, 4]]
  for (const [a, b] of links) {
    const [ax, ay, aw] = nodes[a]
    const [bx, by] = nodes[b]
    const x1 = ax + aw
    const y1 = ay + 22
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(bx, by + 22)
    ctx.stroke()
    // punta de flecha
    ctx.beginPath()
    ctx.moveTo(bx, by + 22)
    ctx.lineTo(bx - 10, by + 16)
    ctx.lineTo(bx - 10, by + 28)
    ctx.closePath()
    ctx.fillStyle = ink
    ctx.fill()
  }
  // nota al margen
  ctx.fillStyle = 'rgba(255,240,150,0.9)'
  ctx.fillRect(420, 190, 70, 60)
  ctx.strokeStyle = 'rgba(120,100,30,0.6)'
  ctx.strokeRect(420, 190, 70, 60)
  ctx.beginPath()
  ctx.moveTo(432, 210)
  ctx.quadraticCurveTo(455, 205, 478, 210)
  ctx.stroke()

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

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
