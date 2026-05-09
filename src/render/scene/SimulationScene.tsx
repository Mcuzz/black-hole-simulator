import { Stars } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import AccretionDisk from "../objects/AccretionDisk"
import BlackHole from "../objects/BlackHole"
import Spacecraft from "../objects/Spacecraft"
import { SkySphere } from "../environment/SkySphere"
import { HawkingParticles } from "../objects/HawkingParticles"
import { useSimulationEngine } from "../hooks/useSimulationEngine"
import { SceneCameraRig } from "./SceneCameraRig"

interface SimulationSceneProps {
  view: SceneView
}

export function SimulationScene({ view }: SimulationSceneProps) {
  const engine = useSimulationEngine()

  useFrame((_, delta) => {
    engine.step(delta)
  })

  return (
    <>
      <SceneCameraRig view={view} />

      <color attach="background" args={["#05070d"]} />
      <fog attach="fog" args={["#05070d", 16, 80]} />

      <ambientLight intensity={0.22} />
      <pointLight color="#ff9b4a" position={[0, 0, 0]} intensity={24} />
      <directionalLight color="#9ad0ff" position={[12, 6, 8]} intensity={0.9} />

      <Stars radius={200} depth={60} count={7000} factor={4} />

      <BlackHole />
      <AccretionDisk />
      <Spacecraft type="near" />
      <Spacecraft type="far" />
      <HawkingParticles />
      <SkySphere />
    </>
  )
}

export type SceneView = "external" | "near" | "far"