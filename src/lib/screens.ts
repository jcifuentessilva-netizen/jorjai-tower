import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/* Pantallas vivas por departamento: canvas re-dibujado (barato).      */
/* code | sales | clients | automation | ai | metrics                  */
/* ------------------------------------------------------------------ */

export type ScreenKind = 'code' | 'sales' | 'clients' | 'automation' | 'ai' | 'metrics'

export interface LiveScreen {
  tex: THREE.CanvasTexture
  update: (t: number) => void
}

const NEON = '#42D879'
const ICE = '#F4F7F4'
const GRAY = '#A7B0AA'
const DARK = '#070b09'

function seedRand(seed: number): () => number {
  let s = seed >>> 0
  return () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
}

function bar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string, a = 1) {
  ctx.globalAlpha = a
  ctx.fillStyle = c
  ctx.fillRect(x, y - h, w, h)
  ctx.globalAlpha = 1
}

function label(ctx: CanvasRenderingContext2D, str: string, x: number, y: number, size: number, c: string, bold = true) {
  ctx.fillStyle = c
  ctx.font = `${bold ? '700' : '400'} ${size}px "Segoe UI", sans-serif`
  ctx.fillText(str, x, y)
}

/* ---------------- CODE (IDE con sintaxis) ---------------- */
function drawCode(ctx: CanvasRenderingContext2D, t: number, rand: () => number) {
  ctx.fillStyle = DARK
  ctx.fillRect(0, 0, 512, 288)
  // barra de pestañas
  bar(ctx, 0, 0, 512, 30, '#0d1410')
  label(ctx, 'dashboard.ts', 14, 20, 13, ICE)
  label(ctx, '●  app', 470, 20, 11, GRAY)

  const kw: [string, string][] = [
    ['import', '#c792ea'], ['const', '#c792ea'], ['async', '#c792ea'], ['function', '#c792ea'],
    ['return', '#c792ea'], ['await', '#c792ea'], ['export', '#c792ea'], ['new', '#c792ea'],
  ]
  const str = '#82aaff'
  const fn = '#ffcb6b'
  const com = '#5c6773'
  const lineH = 22
  let y = 48

  for (let i = 0; i < 11; i++) {
    const cols = Math.floor(rand() * 3)
    ctx.fillStyle = com
    ctx.fillRect(14 + cols * 18, y - 12, 5, 13) // indent
    const tokens: [string, string][] = []
    let n = 2 + Math.floor(rand() * 5)
    const kind = rand()
    if (kind < 0.18) tokens.push(['// ' + 'x'.repeat(6 + Math.floor(rand() * 20)), com])
    else {
      if (kind > 0.5) tokens.push([kw[Math.floor(rand() * kw.length)][0], kw[Math.floor(rand() * kw.length)][1]])
      while (n-- > 0) {
        const r = rand()
        if (r < 0.3) tokens.push([`"${'ab'.repeat(1 + Math.floor(rand() * 3))}"`, str])
        else if (r < 0.45) tokens.push([`${Math.floor(rand() * 999)}`, fn])
        else tokens.push(['word' + Math.floor(rand() * 99), ICE])
      }
      if (rand() > 0.6) tokens.push(['()', fn])
      if (rand() > 0.7) tokens.push(['{', fn])
    }
    let x = 26 + cols * 18
    for (const [txt, color] of tokens) {
      ctx.fillStyle = color
      ctx.font = '400 13px "Cascadia Code", Consolas, monospace'
      ctx.fillText(txt, x, y)
      x += ctx.measureText(txt).width + 7
    }
    y += lineH
  }
  // cursor parpadeante
  if (Math.sin(t * 4) > 0) {
    ctx.fillStyle = NEON
    ctx.fillRect(26, y - 14, 8, 15)
  }
}

/* ---------------- SALES (dashboard ventas) ---------------- */
function drawSales(ctx: CanvasRenderingContext2D, t: number, rand: () => number) {
  ctx.fillStyle = DARK
  ctx.fillRect(0, 0, 512, 288)
  label(ctx, 'VENTAS', 20, 30, 16, NEON)
  label(ctx, `$${Math.floor(1200 + 400 * Math.sin(t * 0.5) + rand() * 200)}k`, 20, 66, 34, ICE)
  label(ctx, 'pedidos hoy: ' + Math.floor(60 + 25 * Math.sin(t * 0.8)), 20, 88, 12, GRAY)

  // barras semanales que fluctúan
  const bw = 46
  for (let i = 0; i < 9; i++) {
    const h = 60 + 110 * (0.5 + 0.5 * Math.sin(t * 0.9 + i * 1.3) * 0.6 + rand() * 0.25)
    bar(ctx, 26 + i * (bw + 14), 270, bw, Math.min(h, 190), i % 3 === 2 ? NEON : '#1d3a2b')
  }
  // línea de tendencia
  ctx.strokeStyle = NEON
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let i = 0; i < 9; i++) {
    const x = 26 + i * (bw + 14) + bw / 2
    const y = 270 - Math.min(60 + 110 * (0.5 + 0.5 * Math.sin(t * 0.9 + i * 1.3) * 0.6 + rand() * 0.25), 190)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

/* ---------------- CLIENTS (clientes + donut) ---------------- */
function drawClients(ctx: CanvasRenderingContext2D, t: number, rand: () => number) {
  ctx.fillStyle = DARK
  ctx.fillRect(0, 0, 512, 288)
  label(ctx, 'CLIENTES', 20, 30, 16, NEON)
  label(ctx, String(30 + Math.floor(2 * Math.sin(t * 0.4))), 20, 70, 34, ICE)

  // donut
  const cx = 380
  const cy = 130
  const R = 62
  const vals = [0.42, 0.28, 0.18, 0.12]
  const cols = [NEON, '#1d7a4a', '#2b5c44', GRAY]
  let a0 = -Math.PI / 2 + Math.sin(t * 0.3) * 0.06
  for (let i = 0; i < vals.length; i++) {
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, R, a0, a0 + vals[i] * Math.PI * 2)
    ctx.closePath()
    ctx.fillStyle = cols[i]
    ctx.fill()
    a0 += vals[i] * Math.PI * 2
  }
  ctx.fillStyle = DARK
  ctx.beginPath()
  ctx.arc(cx, cy, R * 0.62, 0, Math.PI * 2)
  ctx.fill()
  label(ctx, '32+', cx - 16, cy + 6, 20, ICE)

  // lista de clientes
  const names = ['Panadería Don Luis', 'Clínica Andes', 'Vivero Los Olivos', 'AutoMecánica R7', 'Kiosco Express', 'Gimnasio FitSur']
  for (let i = 0; i < 6; i++) {
    const yy = 112 + i * 26
    label(ctx, names[i], 20, yy + 10, 12, i % 2 ? GRAY : ICE, false)
    bar(ctx, 210, yy + 4, 60 + rand() * 70, 6, NEON, 0.7)
  }
}

/* ---------------- AUTOMATION (workflow con nodos) ---------------- */
function drawAutomation(ctx: CanvasRenderingContext2D, t: number, _rand: () => number) {
  ctx.fillStyle = DARK
  ctx.fillRect(0, 0, 512, 288)
  label(ctx, 'AUTOMATION', 20, 30, 16, NEON)

  const nodes: [number, number, string][] = [
    [60, 90, 'Webhook'], [200, 60, 'Validar'], [200, 160, 'Filtrar'], [340, 90, 'Enriquecer'],
    [340, 190, 'Notificar'], [470, 140, 'CRM'],
  ]
  // conexiones
  ctx.strokeStyle = '#1d7a4a'
  ctx.lineWidth = 2
  const links: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5]]
  for (const [a, b] of links) {
    ctx.beginPath()
    ctx.moveTo(nodes[a][0] + 40, nodes[a][1])
    ctx.lineTo(nodes[b][0], nodes[b][1])
    ctx.stroke()
  }
  // nodos
  nodes.forEach(([x, y, ttl], i) => {
    const pulse = 0.5 + 0.5 * Math.sin(t * 2 + i)
    ctx.fillStyle = i % 2 ? '#12281c' : '#0d1f16'
    ctx.strokeStyle = NEON
    ctx.globalAlpha = 0.5 + pulse * 0.5
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.roundRect(x, y - 14, 80, 28, 8)
    ctx.fill()
    ctx.stroke()
    ctx.globalAlpha = 1
    label(ctx, ttl, x + 8, y + 5, 12, ICE, false)
  })
  // progreso del pipeline
  bar(ctx, 20, 260, 472 * (0.35 + 0.3 * Math.sin(t * 0.7)), 8, NEON)
}

/* ---------------- AI (red neuronal) ---------------- */
function drawAI(ctx: CanvasRenderingContext2D, t: number, _rand: () => number) {
  ctx.fillStyle = DARK
  ctx.fillRect(0, 0, 512, 288)
  label(ctx, 'IA · DAR ÁTOMOS', 20, 30, 16, NEON)

  const layers = [3, 5, 5, 3]
  const xs = [70, 200, 330, 460]
  const pts: [number, number][] = []
  layers.forEach((n, li) => {
    for (let ni = 0; ni < n; ni++) {
      pts.push([xs[li], 70 + (ni + 1) * (170 / (n + 1))])
    }
  })
  // conexiones
  ctx.strokeStyle = 'rgba(66,216,121,0.16)'
  ctx.lineWidth = 1.2
  let idx = 0
  layers.forEach((n, li) => {
    if (li === layers.length - 1) return
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < layers[li + 1]; j++) {
        const a = pts[idx + i]
        const b = pts[idx + n + j]
        ctx.beginPath()
        ctx.moveTo(a[0], a[1])
        ctx.lineTo(b[0], b[1])
        ctx.stroke()
      }
    }
    idx += n
  })
  // nodos pulsantes
  pts.forEach(([x, y], i) => {
    const r = 7 + 2.5 * Math.sin(t * 2.4 + i * 1.7)
    ctx.fillStyle = i % 4 === 3 ? '#F4F7F4' : NEON
    ctx.globalAlpha = 0.7 + 0.3 * Math.sin(t * 2.4 + i * 1.7)
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  })
}

/* ---------------- METRICS (estadísticas globales) ---------------- */
function drawMetrics(ctx: CanvasRenderingContext2D, t: number, rand: () => number) {
  ctx.fillStyle = DARK
  ctx.fillRect(0, 0, 512, 288)
  label(ctx, 'JORJAI · METRICAS', 20, 30, 16, NEON)

  const rows: [string, number][] = [
    ['CLIENTES', 32], ['PROYECTOS', 47], ['VENTAS', 128], ['CONVERSION', 94],
  ]
  rows.forEach(([ttl, val], i) => {
    const y = 66 + i * 50
    label(ctx, ttl, 20, y, 14, ICE)
    label(ctx, String(Math.floor(val + 3 * Math.sin(t * 0.6 + i))), 140, y, 20, NEON)
    bar(ctx, 200, y + 2, 280 * (0.4 + 0.3 * Math.sin(t * 0.5 + i * 2) + rand() * 0.2), 12, i % 2 ? '#1d7a4a' : NEON)
  })
  label(ctx, 'AUTOMATION · AI · WEB', 20, 270, 11, GRAY, false)
}

/* ---------------- factory ---------------- */
export function createScreenTexture(kind: ScreenKind, seed: number, w = 512, h = 288): LiveScreen {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  const rand = seedRand(seed)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace

  const draw: (c: CanvasRenderingContext2D, t: number, r: () => number) => void =
    kind === 'code' ? drawCode : kind === 'sales' ? drawSales : kind === 'clients' ? drawClients : kind === 'automation' ? drawAutomation : kind === 'ai' ? drawAI : drawMetrics

  draw(ctx, 0, rand)
  tex.needsUpdate = true

  return {
    tex,
    update: (t: number) => {
      draw(ctx, t, rand)
      tex.needsUpdate = true
    },
  }
}
