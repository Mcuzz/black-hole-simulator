import { OrbitControls } from "@react-three/drei"
import { useFrame, useThree } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib"
import { useSimulationEngine } from "../hooks/useSimulationEngine"

export type SceneView = "external" | "near" | "far"

interface SceneCameraRigProps {
  view: SceneView
}

export function SceneCameraRig({ view }: SceneCameraRigProps) {

  const engine = useSimulationEngine()
  const { camera } = useThree()
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const externalPosition = useMemo(
    () => new THREE.Vector3(0, 5, 10),
    []
  )
  const desiredPosition = useMemo(() => new THREE.Vector3(), [])
  const lookAtTarget = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    cameraRef.current = camera as THREE.PerspectiveCamera
  }, [camera])

  useEffect(() => {
    const perspectiveCamera = cameraRef.current

    if (!perspectiveCamera) {
      return
    }

    if (view === "external") {
      perspectiveCamera.position.copy(externalPosition)
      perspectiveCamera.fov = 60
      perspectiveCamera.updateProjectionMatrix()

      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, 0)
        controlsRef.current.update()
      }
    }
  }, [externalPosition, view])

  useFrame(() => {
    const perspectiveCamera = cameraRef.current

    if (!perspectiveCamera || view === "external") {
      return
    }

    const state = engine.getState()
    const near = state.spacecraftNear.position
    const far = state.spacecraftFar.position
    const spag = state.effects.spaghettificationFactor

    if (view === "near") {
      desiredPosition.set(
        near[0] + 0.9,
        0.3 + spag * 0.04,
        0.18,
      )
      lookAtTarget.set(0, 0, 0)
      perspectiveCamera.position.lerp(desiredPosition, 0.1)
      perspectiveCamera.lookAt(lookAtTarget)
      perspectiveCamera.fov += ((58 + spag * 2.2) - perspectiveCamera.fov) * 0.08
      perspectiveCamera.updateProjectionMatrix()
      return
    }

    desiredPosition.set(
      far[0] - 1.8,
      0.55,
      1.2,
    )
    lookAtTarget.set(near[0] * 0.4, 0, 0)
    perspectiveCamera.position.lerp(desiredPosition, 0.1)
    perspectiveCamera.lookAt(lookAtTarget)
    perspectiveCamera.fov += (34 - perspectiveCamera.fov) * 0.08
    perspectiveCamera.updateProjectionMatrix()
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      enablePan={false}
      enabled={view === "external"}
      maxDistance={50}
      minDistance={3}
      rotateSpeed={0.75}
      target={[0, 0, 0]}
      zoomSpeed={0.8}
    />
  )
}
