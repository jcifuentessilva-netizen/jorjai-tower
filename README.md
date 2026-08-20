# 🏢 JORJAI Tower — Web Inmersiva 3D

**"Dar átomos a la IA"** · JORJAI Digitalizaciones · Fundadores: Jordan + Jaime · Puente Alto, Santiago

Web corporativa interactiva en 3D: una torre de 6 pisos que se recorre con scroll — lobby, oficinas con gente trabajando, sala de reuniones, esparcimiento, estudio creativo y plaza con logo en relieve.

## 🌍 En vivo

**https://jcifuentessilva-netizen.github.io/jorjai-tower/** (GitHub Pages, rama `gh-pages`)

## 🏗 Stack

- Vite 8 · React 19 · TypeScript
- three.js · @react-three/fiber 9 · @react-three/drei · @react-three/postprocessing
- GSAP + Lenis (scroll cinematográfico) · Tailwind CSS 3.4
- pnpm

## 🚀 Desarrollo

```bash
pnpm install
pnpm dev        # http://localhost:5174
pnpm build      # dist/ (base relativa './')
pnpm preview    # http://localhost:4173
pnpm lint       # oxlint
```

## 🏢 Recorrido (11 fases de scroll)

1. **Apertura** — torre nocturna, logo, concepto
2. **Presentación** — exterior (fachada de foto real)
3. **Lobby** — cámara dentro del edificio: logo neón, recepción, ventanal con vista de Santiago
4. **Oficinas** — 6 estaciones, personas con rostros tecleando, pantallas vivas (code/sales/clients/automation/ai/metrics)
5. **Sala de reuniones** — mesa vidrio, sillas reclinables, proyector con gráfico verde, pizarra UX
6. **Esparcimiento** — sofás tweed, ping-pong, futbolito, máquina de bebidas
7. **Estudio creativo** — mural del brief, lápices, tablet, cámara
8-10. **Valores · Datos · Conversión** — exterior y plaza: logo relieve, flores, bancas, faroles, repartidor en bici
11. **Cierre** — rooftop

## 📦 Deploy (GitHub Pages)

```bash
pnpm build
git worktree add <tmp> gh-pages && cd <tmp> \
  && git rm -rf . && cp -r <proyecto>/dist/* . \
  && git add -A && git commit -m deploy && git push origin gh-pages
```

## 🎨 Identidad

Paleta `#050505 #0B3D25 #42D879 #F4F7F4 #A7B0AA` · Space Grotesk + Inter · CTA WhatsApp `wa.me/56966101914`

## 📁 Estructura

```
src/
├── App.tsx                    # Canvas + postprocessing + lazy
├── lib/                       # xMachine (fases), materiales PBR, texturas, pantallas
├── components/
│   ├── protagonist/           # JorjaiTower (torre 4.6×3.4×7.5, 6 pisos)
│   ├── interior/              # Lobby, Oficinas, Sala, Lounge, Estudio
│   ├── environment/           # Skyline, Plaza, CityWindow, ChileMap
│   ├── people/                # Personas procedurales con rostros
│   ├── props/                 # Microdetalle (tazas, briefs, laptops...)
│   ├── camera/ atmosphere/ ui/
└── hooks/                     # useScrollController (Lenis+ScrollTrigger)
```
