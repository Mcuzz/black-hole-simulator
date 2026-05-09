import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import { useSimulationEngine } from "../hooks/useSimulationEngine"

const PARTICLE_COUNT = 160

interface Particle {
  theta: number
  phi: number
  speed: number
  life: number
  maxLife: number
}

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    theta: Math.random() * Math.PI * 2,
    phi: Math.random() * Math.PI,
    speed: 0.6 + Math.random() * 0.8,
    life: Math.random(),
    maxLife: 2.0 + Math.random() * 2.0,
  }))
}

export function HawkingParticles() {
  const engine = useSimulationEngine()

  const geometry = useMemo(() => new THREE.BufferGeometry(), [])
  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
        size: 0.05, // Tamaño base, modificado dinámicamente
      }),
    [],
  )

  const particlesRef = useRef<Particle[]>(createParticles())
  const positionsRef = useRef(new Float32Array(PARTICLE_COUNT * 3))
  const colorsRef = useRef(new Float32Array(PARTICLE_COUNT * 3))
  const sizesRef = useRef(new Float32Array(PARTICLE_COUNT))

  useEffect(() => {
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionsRef.current, 3),
    )
    geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colorsRef.current, 3),
    )
    geometry.setAttribute(
      "size",
      new THREE.BufferAttribute(sizesRef.current, 1),
    )
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  useFrame((_, delta) => {
    const state = engine.getState()
    const rs = state.blackHole.schwarzschildRadius
    const glow = state.effects.hawkingGlowIntensity
    const horizon = state.effects.horizonProximity

    // Intensidad base siempre visible, amplificada cerca del horizonte
    const baseIntensity = 0.25
    const intensity = baseIntensity + glow * 0.5 + horizon * 0.35

    // Radio de emisión en unidades de render — el agujero negro
    // tiene radio visual ~1.92 unidades, emitimos justo por encima
    const blackHoleVisualRadius = 1
    const emitRadius = blackHoleVisualRadius * 1.05

    // Las partículas se expanden hasta ~4× el radio visual del agujero negro
    const maxExpansion = blackHoleVisualRadius * 4.0

    const particles = particlesRef.current
    const positions = positionsRef.current
    const colors = colorsRef.current
    const sizes = sizesRef.current

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i]

      p.life += delta / p.maxLife

      if (p.life > 1) {
        p.life = 0
        p.theta = Math.random() * Math.PI * 2
        p.phi = Math.random() * Math.PI
        p.speed = 0.6 + Math.random() * 0.8
      }

      const t = p.life
      // Fade in rápido, fade out suave al alejarse
      const fadeIn = Math.min(t * 8, 1)
      const fadeOut = 1 - Math.pow(t, 1.5)
      const alpha = fadeIn * fadeOut * intensity

      // Expansión: desde el borde del agujero hasta maxExpansion
      const r = emitRadius + (maxExpansion - emitRadius) * t * p.speed
      const sinPhi = Math.sin(p.phi)
      const idx3 = i * 3

      positions[idx3]     = r * sinPhi * Math.cos(p.theta)
      positions[idx3 + 1] = r * sinPhi * Math.sin(p.theta)
      positions[idx3 + 2] = r * Math.cos(p.phi)

      // Color: blanco-cálido al nacer → azul-violeta al alejarse
      colors[idx3]     = THREE.MathUtils.lerp(1.0, 0.3, t) * alpha
      colors[idx3 + 1] = THREE.MathUtils.lerp(0.85, 0.4, t) * alpha
      colors[idx3 + 2] = THREE.MathUtils.lerp(0.6, 1.0, t) * alpha

      // Tamaño decrece al alejarse
      sizes[i] = Math.max(0, (1 - t * 0.6) * 0.1 * (0.4 + intensity))
    }

    const posAttr = geometry.getAttribute("position") as THREE.BufferAttribute
    const colAttr = geometry.getAttribute("color") as THREE.BufferAttribute
    const sizeAttr = geometry.getAttribute("size") as THREE.BufferAttribute

    posAttr.needsUpdate = true
    colAttr.needsUpdate = true
    sizeAttr.needsUpdate = true
  })

  return <points geometry={geometry} material={material} />
}