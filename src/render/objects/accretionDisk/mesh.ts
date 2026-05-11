import { Mesh, RingGeometry } from "three"
import type { AccretionDiskLayerConfig } from "./config"
import { createAccretionDiskMaterial } from "./material"

export function createAccretionDiskMesh(
  layer: AccretionDiskLayerConfig,
  renderOrder = 0,
): Mesh {
  const mesh = new Mesh(
    new RingGeometry(layer.inner, layer.outer, layer.segments),
    createAccretionDiskMaterial(layer),
  )

  mesh.renderOrder = renderOrder
  return mesh
}
