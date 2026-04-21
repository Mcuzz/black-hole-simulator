import { useFrame, useLoader } from "@react-three/fiber"
import { useMemo, useRef } from "react"
import {
  BackSide,
  LinearFilter,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from "three"
import { useSimulationEngine } from "../hooks/useSimulationEngine"
import "../effects/GravitationalLensing"

type LensingMaterialType = ShaderMaterial & {
  skyTexture: Texture | null
  blackHolePos: [number, number, number]
  lensingStrength: number
}

export function SkySphere() {

  const engine = useSimulationEngine()
  const materialRef = useRef<LensingMaterialType | null>(null)
  const texture = useLoader(TextureLoader, "/textures/starmap_4k.jpg")
  const skyTexture = useMemo(() => {
    const configuredTexture = texture.clone()
    configuredTexture.colorSpace = SRGBColorSpace
    configuredTexture.minFilter = LinearFilter
    configuredTexture.magFilter = LinearFilter
    configuredTexture.needsUpdate = true

    return configuredTexture
  }, [texture])

  useFrame(() => {

    const state = engine.getState()

    if (!materialRef.current) {
      return
    }

    materialRef.current.lensingStrength =
      0.16 + state.effects.lensingStrength * 0.24
    materialRef.current.blackHolePos = [0, 0, 0]
  })

  return (
    <mesh scale={500}>
      <sphereGeometry args={[1, 96, 96]} />

      <lensingMaterial
        ref={materialRef}
        blackHolePos={[0, 0, 0]}
        lensingStrength={0.18}
        skyTexture={skyTexture}
        side={BackSide}
      />
    </mesh>
  )
}
