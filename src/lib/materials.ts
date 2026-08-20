import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/* Materiales PBR reutilizables (arquitectura corporativa premium)     */
/* Guard de rendimiento: transmisión/clearcoat se degradan en TUI/móvil */
/* ------------------------------------------------------------------ */

const LOW =
  (typeof __HERMES_TUI__ !== 'undefined' && __HERMES_TUI__) ||
  (typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches)

export interface GlassOpts {
  transmission?: number
  map?: THREE.Texture
  emissiveMap?: THREE.Texture
  emissiveIntensity?: number
  roughness?: number
  doubleSide?: boolean
}

/** Vidrio arquitectónico: transmisión parcial + clearcoat + reflejos env. */
export function glassMat(o: GlassOpts = {}): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    map: o.map,
    emissiveMap: o.emissiveMap,
    emissive: new THREE.Color('#ffe9c4'),
    emissiveIntensity: o.emissiveIntensity ?? 0.5,
    transmission: LOW ? 0 : (o.transmission ?? 0.35),
    thickness: 0.6,
    roughness: o.roughness ?? 0.25,
    metalness: 0.15,
    ior: 1.5,
    clearcoat: 0.9,
    clearcoatRoughness: 0.15,
    envMapIntensity: 1.2,
    side: o.doubleSide === false ? THREE.FrontSide : THREE.DoubleSide,
  })
}

/** Metal arquitectónico: acero/estructura con clearcoat. */
export function metalMat(color = '#1a2420', roughness = 0.4): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness,
    metalness: 0.85,
    clearcoat: LOW ? 0.2 : 0.6,
    clearcoatRoughness: 0.25,
    envMapIntensity: 1.1,
  })
}

/** Madera barnizada con textura de vetas procedural. */
export function woodMat(color = '#6b4a2e', map?: THREE.Texture): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    map,
    bumpMap: map ?? null,
    bumpScale: 0.008,
    roughness: 0.5,
    metalness: 0,
    clearcoat: LOW ? 0.1 : 0.35,
    clearcoatRoughness: 0.25,
    envMapIntensity: 0.6,
  })
}

/** Piso premium: reflejo suave del environment. */
export function floorMat(color = '#161c19', roughness = 0.35): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness,
    metalness: 0.05,
    clearcoat: LOW ? 0 : 0.2,
    envMapIntensity: 0.8,
  })
}

/** Cuero (sillas ejecutivas, sofás). */
export function leatherMat(color = '#241d16'): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.55,
    metalness: 0,
    clearcoat: LOW ? 0 : 0.2,
    clearcoatRoughness: 0.4,
    envMapIntensity: 0.5,
  })
}

/** Hormigón arquitectónico (paredes). */
export function concreteMat(color = '#191c1b'): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: 0.9,
    metalness: 0.02,
    envMapIntensity: 0.4,
  })
}

/** Alfombra clara de oficina con textura de tejido. */
export function carpetMat(map: THREE.Texture): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map,
    roughness: 0.95,
    metalness: 0,
    envMapIntensity: 0.25,
  })
}

/** Tela de sofá/sillón con textura tweed. */
export function fabricMat(map: THREE.Texture, color = '#8a8f8c'): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    map,
    color,
    roughness: 0.85,
    metalness: 0,
    clearcoat: 0.06,
    envMapIntensity: 0.4,
  })
}
