import { useFrame } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import type { Mesh, MeshBasicMaterial } from "three"
import * as THREE from "three"

function createDiskTexture() {

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
      const diskMask =
        smoothBand(radius, 0.28, 0.62, 0.09) *
        (0.55 + 0.45 * Math.max(0, Math.cos(angle + 0.95)))

      const turbulence =
        0.8 +
        0.2 *
          Math.sin((angle * 18) + radius * 44) *
          Math.cos(radius * 56)
      const alpha = Math.max(0, Math.min(1, diskMask * turbulence))
      const color = new THREE.Color(
        radius < 0.39
          ? "#fff3b5"
          : radius < 0.48
            ? "#ffb357"
            : "#ff5f22"
      )

      const index = (y * size + x) * 4
      data[index] = Math.floor(color.r * 255)
      data[index + 1] = Math.floor(color.g * 255)
      data[index + 2] = Math.floor(color.b * 255)
      data[index + 3] = Math.floor(alpha * 255)
    }
  }

  ctx.putImageData(image, 0, 0)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping

  return texture
}

function smoothBand(
  radius: number,
  inner: number,
  outer: number,
  blur: number,
) {

  const enter = THREE.MathUtils.smoothstep(radius, inner - blur, inner + blur)
  const exit = 1 - THREE.MathUtils.smoothstep(radius, outer - blur, outer + blur)

  return Math.max(0, Math.min(1, enter * exit))
}

export default function AccretionDisk() {

  const mainRef = useRef<Mesh>(null)
  const hazeRef = useRef<Mesh>(null)
  const mainMaterialRef = useRef<MeshBasicMaterial>(null)
  const hazeMaterialRef = useRef<MeshBasicMaterial>(null)
  const texture = useMemo(() => createDiskTexture(), [])

  useFrame(({ clock }) => {

    const elapsed = clock.getElapsedTime()

    if (mainRef.current) {
      mainRef.current.rotation.z = elapsed * 0.09
    }

    if (hazeRef.current) {
      hazeRef.current.rotation.z = -elapsed * 0.04
    }

    if (mainMaterialRef.current?.map) {
      mainMaterialRef.current.map.offset.x = elapsed * 0.01
    }

    if (hazeMaterialRef.current?.map) {
      hazeMaterialRef.current.map.offset.x = -elapsed * 0.006
    }
  })

  return (
    <group rotation={[Math.PI / 2.45, 0.38, -0.08]}>
      <mesh ref={hazeRef}>
        <ringGeometry args={[2.35, 5.45, 160]} />
        <meshBasicMaterial
          ref={hazeMaterialRef}
          blending={THREE.AdditiveBlending}
          color="#ff8d3c"
          depthWrite={false}
          map={texture}
          opacity={0.36}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>

      <mesh ref={mainRef}>
        <ringGeometry args={[2.48, 4.72, 160]} />
        <meshBasicMaterial
          ref={mainMaterialRef}
          blending={THREE.AdditiveBlending}
          color="#ffffff"
          depthWrite={false}
          map={texture}
          opacity={0.94}
          side={THREE.DoubleSide}
          transparent
        />
      </mesh>
    </group>
  )
}
