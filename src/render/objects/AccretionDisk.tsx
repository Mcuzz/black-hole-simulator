import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo } from "react"
import {
  ACCRETION_DISK_LAYERS,
  ACCRETION_DISK_ROTATION,
} from "./accretionDisk/config"
import {
  createAccretionDiskLayerMeshes,
  disposeAccretionDiskMeshes,
} from "./accretionDisk/mesh"
import {
  applyBlackbodyTexture,
  updateAccretionDiskTime,
} from "./accretionDisk/material"
import { useBlackbodyTexture } from "./accretionDisk/useBlackbodyTexture"

export default function AccretionDisk() {
  const mainMeshes = useMemo(
    () => createAccretionDiskLayerMeshes(ACCRETION_DISK_LAYERS.main, 10),
    [],
  )
  const hazeMeshes = useMemo(
    () => createAccretionDiskLayerMeshes(ACCRETION_DISK_LAYERS.haze, 2),
    [],
  )
  const wrapMeshes = useMemo(
    () => createAccretionDiskLayerMeshes(ACCRETION_DISK_LAYERS.wrap, 24),
    [],
  )
  const blackbodyTexture = useBlackbodyTexture()
  const allMeshes = useMemo(
    () => [...hazeMeshes, ...mainMeshes, ...wrapMeshes],
    [hazeMeshes, mainMeshes, wrapMeshes],
  )

  useEffect(() => {
    return () => {
      disposeAccretionDiskMeshes(allMeshes)
    }
  }, [allMeshes])

  useEffect(() => {
    if (!blackbodyTexture) {
      return
    }

    for (const mesh of allMeshes) {
      applyBlackbodyTexture(mesh, blackbodyTexture)
    }
  }, [allMeshes, blackbodyTexture])

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime()

    for (const mesh of allMeshes) {
      updateAccretionDiskTime(mesh, elapsedTime)
    }
  })

  return (
    <group rotation={ACCRETION_DISK_ROTATION}>
      {allMeshes.map((mesh) => (
        <primitive key={mesh.uuid} object={mesh} />
      ))}
    </group>
  )
}
