import { Mesh, RingGeometry, ShaderMaterial } from "three"
import type { AccretionDiskLayerConfig } from "./config"
import { createAccretionDiskMaterial } from "./material"

function computeSliceOpacity(
  layer: AccretionDiskLayerConfig,
  normalizedHeight: number,
) {
  const centerWeight = 1 - Math.abs(normalizedHeight)
  const shapedWeight = Math.pow(
    Math.max(centerWeight, 0.18),
    layer.verticalOpacityBias,
  )

  return layer.opacity * shapedWeight
}

export function createAccretionDiskLayerMeshes(
  layer: AccretionDiskLayerConfig,
  renderOrderBase = 0,
): Mesh[] {
  return Array.from({ length: layer.slices }, (_, index) => {
    const normalizedHeight =
      layer.slices === 1 ? 0 : (index / (layer.slices - 1)) * 2 - 1

    const material = createAccretionDiskMaterial(layer)
    material.uniforms.uOpacity.value = computeSliceOpacity(
      layer,
      normalizedHeight,
    )

    const mesh = new Mesh(
      new RingGeometry(layer.inner, layer.outer, layer.segments),
      material,
    )

    const radialScale = 1 - layer.radialTaper * Math.pow(normalizedHeight, 2)
    mesh.position.z = normalizedHeight * layer.thickness
    mesh.scale.set(radialScale, radialScale, 1)
    mesh.renderOrder = renderOrderBase + index

    return mesh
  })
}

export function disposeAccretionDiskMeshes(meshes: Mesh[]) {
  for (const mesh of meshes) {
    mesh.geometry.dispose()
    ;(mesh.material as ShaderMaterial).dispose()
  }
}
