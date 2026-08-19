# JORJAI Tower — Project Config (Fuente de Verdad)

## Variables de Marca (Brief JORJAI)

| Variable | Valor |
|----------|-------|
| **Marca** | JORJAI (JORJAI Digitalizaciones) |
| **Sector** | Tecnología / IA / Digitalización PYMEs / Automatización |
| **Tagline** | "Dar átomos a la IA" |
| **Promesa** | "Tu negocio merece una presencia digital a la altura de lo que quieres construir" |
| **Protagonista 3D** | **Edificio corporativo JORJAI** (torre de vidrio, 6+ pisos) |
| **Origen** | Puente Alto, Santiago de Chile |
| **Fundadores** | Jordan + Jaime |
| **Paleta** | #050505 negro profundo · #0B3D25 verde oscuro · #42D879 verde neón · #F4F7F4 blanco hielo · #A7B0AA gris neutro · #FFFFFF |
| **Fuentes** | Space Grotesk / Sora / Manrope (display) · Inter / IBM Plex Sans (body) |
| **Referencias estéticas** | Linear, Stripe, Vercel, Apple, Awwwards/SOTD |

## Concepto Narrativo

**"Entra al edificio donde JORJAI construye el futuro."**
Scroll = viaje de inmersión: exterior nocturno → lobby → oficinas → servicios → tecnología → valores → datos → conversión → despegue final.
El edificio es el protagonista absoluto; la cámara lo rodea, entra y asciende por sus pisos.

## Protagonista: Torre JORJAI (6 pisos conceptuales)

| Piso | Función narrativa | Elementos 3D |
|------|-------------------|--------------|
| P0 Lobby | Inmersión de entrada | Recepción, vidrio, logo JORJAI iluminado |
| P1 Fundadores | Jordan + Jaime | Escritorios, pantallas, prototipos |
| P2 Oficinas | Equipo construyendo | Mesas, monitores, código, nodos IA |
| P3 Labs | IA + Automatización | Servidores, hologramas, data |
| P4 Terraza | Puente Alto → Futuro | Vista nocturna de la ciudad |
| Rooftop | Cierre / despegue | Helipuerto, tagline, CTA |

## Personalidad de Marca → Animación

| Rasgo | Comportamiento |
|-------|----------------|
| Visionario | Cámara ascensos lentos, vista amplia |
| Preciso | Movimiento fluido, sin jitter, easing controlado |
| Cercano | Inmersión en oficinas, escala humana |
| Técnico | Geometría limpia, líneas HUD, blueprint |
| Rebelde | Luz neón #42D879 como acento disruptivo |
| Accesible | prefers-reduced-motion respetado |

## Arco de 11 Escenas

| # | Escena | Edificio | Cámara | Atmósfera | UI |
|---|--------|----------|--------|-----------|-----|
| 1 | Apertura | Torre nocturna, ventanas encendidas | Travelling lento frontal | Noche azul, partículas sutiles | Logo + tagline gigante |
| 2 | Presentación | Fachada vidrio, 6 pisos | Orbita lateral, zoom | Amanecer frío | Specs: pisos, oficinas, stack |
| 3 | Lobby | Inmersión: puertas abren, lobby interior | Push-in por la entrada | Lobby cálido, cristal | "Bienvenido" + fundadores |
| 4 | Oficinas | Piso 1-2: equipo, monitores, código | Dolly lateral entre escritorios | Luz diurna | Paneles: qué hacemos |
| 5 | Labs | Piso 3: servidores + IA | Orbit + descenso | Azul digital | HUD servicios: web, e-com, automatización, IA |
| 6 | Experiencia | Oficinas vivas: usuarios/cliente | Ángulos múltiples | Cálido atardecer | Glassmorphism beneficios |
| 7 | Tecnología | Torre expandida, blueprint | Vista arquitectónica | Espacio digital | HUD: arquitectura, integraciones |
| 8 | Valores | Torre estable, terraza | Centro estable | Luz cálida | 6 valores con frases cortas |
| 9 | Datos | Torre en túnel de datos | Zoom out | Túnel luminoso | Counters: proyectos, clientes, uptime |
| 10 | Conversión | Lobby de nuevo, panel cristal | Frente al panel | Noche elegante | Cotizador integrado (no formulario tradicional) |
| 11 | Cierre | Rooftop, despegue vertical | Ascenso final, zoom out | Cielo estrellado | "Dar átomos a la IA" + CTA final |

## Paleta Técnica (CSS Variables)

```css
:root {
  --bg-deep: #050505;
  --green-dark: #0B3D25;
  --green-neon: #42D879;
  --ice-white: #F4F7F4;
  --gray-neutral: #A7B0AA;
  --pure-white: #FFFFFF;
  --font-display: 'Space Grotesk', 'Sora', 'Manrope', sans-serif;
  --font-body: 'Inter', 'IBM Plex Sans', sans-serif;
}
```

## Stack (instalado — Paso 1)

- Vite 8.2.1 · React 19.2.8 · TypeScript 6.0.3 · pnpm 11.22
- three 0.185.1 · @react-three/fiber 9.7.0 · @react-three/drei 10.7.8
- gsap 3.15.0 · @gsap/react 2.1.2 · lenis 1.3.26
- tailwindcss 3.4.17 · postcss · autoprefixer
- @fontsource/space-grotesk · @fontsource/inter

## Performance Targets

| Métrica | Target |
|---------|--------|
| FPS Desktop | 60 |
| FPS Mobile | 30+ |
| LCP | < 2.5s |
| Bundle JS | < 250KB gzip |
| GLB (si se usa) | < 500KB Draco+KTX2 |
| Partículas (TUI) | ≤ 1000 · (prod) ≤ 2000 |
| dpr | [1, 1.5] TUI · [1, 2] prod |
