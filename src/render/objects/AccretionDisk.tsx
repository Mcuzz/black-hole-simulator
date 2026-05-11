import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo } from "react"
import {
  ACCRETION_DISK_LAYERS,
  ACCRETION_DISK_ROTATION,
} from "./accretionDisk/config"
import { createAccretionDiskMesh } from "./accretionDisk/mesh"
import {
  applyBlackbodyTexture,
  disposeAccretionDiskMesh,
  updateAccretionDiskTime,
} from "./accretionDisk/material"
import { useBlackbodyTexture } from "./accretionDisk/useBlackbodyTexture"

export default function AccretionDisk() {
  const mainMesh = useMemo(
    () => createAccretionDiskMesh(ACCRETION_DISK_LAYERS.main, 5),
    [],
  )
  const hazeMesh = useMemo(
    () => createAccretionDiskMesh(ACCRETION_DISK_LAYERS.haze, 4),
    [],
  )
  const blackbodyTexture = useBlackbodyTexture()

  useEffect(() => {
    return () => {
      disposeAccretionDiskMesh(mainMesh)
      disposeAccretionDiskMesh(hazeMesh)
    }
  }, [hazeMesh, mainMesh])

  useEffect(() => {
    if (!blackbodyTexture) {
      return
    }

    applyBlackbodyTexture(mainMesh, blackbodyTexture)
    applyBlackbodyTexture(hazeMesh, blackbodyTexture)
  }, [blackbodyTexture, hazeMesh, mainMesh])

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()
    updateAccretionDiskTime(mainMesh, elapsedTime)
    updateAccretionDiskTime(hazeMesh, elapsedTime)
  })

  return (
    <group rotation={ACCRETION_DISK_ROTATION}>
      <primitive object={mainMesh} />
      <primitive object={hazeMesh} />
    </group>
  )
}
