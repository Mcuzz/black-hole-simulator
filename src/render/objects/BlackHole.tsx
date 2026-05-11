import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import type { Mesh } from "three"
import * as THREE from "three"
import { BLACK_HOLE_VISUAL_RADIUS } from "../../core/units/renderScale"

function createHaloTexture({
  innerRadius,
  outerRadius,
  brightDirection,
  colors,
}: {
  innerRadius: number
  outerRadius: number
  brightDirection: number
  colors: [string, string, string]
}) {

  const size = 1024
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return new THREE.CanvasTexture(canvas)
  }

  const image = ctx.createImageData(size, size)
  const data = image.data

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = (x / (size - 1)) * 2 - 1
      const ny = (y / (size - 1)) * 2 - 1
      const radius = Math.sqrt(nx * nx + ny * ny)
      const angle = Math.atan2(ny, nx)

      const bandCenter = (innerRadius + outerRadius) * 0.5
      const halfWidth = (outerRadius - innerRadius) * 0.5
      const radial = Math.max(0, 1 - Math.abs(radius - bandCenter) / halfWidth)
      const glow = Math.pow(radial, 2.8)

      const directionalBoost =
        0.35 +
        0.65 * Math.max(0, Math.cos(angle - brightDirection))
      const noise =
        0.92 +
        0.08 *
          Math.sin((angle + radius * 10) * 14) *
          Math.cos(radius * 28)
      const alpha = Math.min(255, Math.floor(glow * directionalBoost * noise * 255))

      const index = (y * size + x) * 4
      const colorStop =
        radius < bandCenter
          ? colors[0]
          : radius < bandCenter + halfWidth * 0.45
            ? colors[1]
            : colors[2]
      const color = new THREE.Color(colorStop)

      data[index] = Math.floor(color.r * 255)
      data[index + 1] = Math.floor(color.g * 255)
      data[index + 2] = Math.floor(color.b * 255)
      data[index + 3] = alpha
    }
  }

  ctx.putImageData(image, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace

  return texture
}

function createShadowTexture() {

  const size = 1024
  const canvas = document.createElement("canvas")
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    return new THREE.CanvasTexture(canvas)
  }

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.16,
    size / 2,
    size / 2,
    size * 0.45,
  )

  gradient.addColorStop(0, "rgba(0,0,0,1)")
  gradient.addColorStop(0.42, "rgba(0,0,0,1)")
  gradient.addColorStop(0.63, "rgba(0,0,0,0.94)")
  gradient.addColorStop(0.82, "rgba(0,0,0,0.28)")
  gradient.addColorStop(1, "rgba(0,0,0,0)")

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace

  return texture
}

export default function BlackHole() {

  const coreRef = useRef<Mesh>(null)
  const coreRimRef = useRef<Mesh>(null)
  const shadowRef = useRef<Mesh>(null)
  const photonHaloRef = useRef<Mesh>(null)

  const shadowTexture = useMemo(() => createShadowTexture(), [])
  const photonHaloTexture = useMemo(
    () =>
      createHaloTexture({
        innerRadius: 0.3,
        outerRadius: 0.42,
        brightDirection: Math.PI * 0.6,
        colors: ["#fff0ae", "#ffb357", "#ff6722"],
      }),
    []
  )

  useFrame(({ camera, clock }) => {

    const elapsed = clock.getElapsedTime()

    if (coreRef.current) {
      coreRef.current.rotation.y = elapsed * 0.06
    }

    if (coreRimRef.current) {
      coreRimRef.current.rotation.y = elapsed * 0.06
      coreRimRef.current.rotation.x = Math.sin(elapsed * 0.18) * 0.03
    }

    if (shadowRef.current) {
      shadowRef.current.lookAt(camera.position)
    }

    if (photonHaloRef.current) {
      photonHaloRef.current.lookAt(camera.position)
      photonHaloRef.current.rotation.z = elapsed * 0.08
    }
  })

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[BLACK_HOLE_VISUAL_RADIUS, 96, 96]} />
        <meshStandardMaterial
          color="#010102"
          emissive="#020204"
          emissiveIntensity={0.08}
          roughness={1} 
        />
      </mesh>

      <mesh ref={coreRimRef} scale={1.035}>
        <sphereGeometry args={[BLACK_HOLE_VISUAL_RADIUS, 96, 96]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#ffca68"
          depthWrite={false}
          opacity={0.52}
          side={THREE.BackSide}
          transparent
        />
      </mesh>

      <mesh ref={shadowRef} renderOrder={8}>
        <planeGeometry args={[6.6, 6.6]} />
        <meshBasicMaterial
          alphaMap={shadowTexture}
          color="#000000"
          depthWrite={false}
          map={shadowTexture}
          transparent
        />
      </mesh>

      <mesh ref={photonHaloRef} renderOrder={9}>
        <planeGeometry args={[6.3, 6.3]} />
        <meshBasicMaterial
          blending={THREE.AdditiveBlending}
          color="#ffffff"
          depthWrite={false}
          map={photonHaloTexture}
          transparent
        />
      </mesh>
    </group>
  )
}
