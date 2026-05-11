import {
  AdditiveBlending,
  DoubleSide,
  GLSL3,
  ShaderMaterial,
  Texture,
} from "three"
import type { Mesh } from "three"
import type { AccretionDiskLayerConfig } from "./config"
import { EVENT_HORIZON_VISUAL_RADIUS } from "./config"
import {
  accretionDiskFragmentShader,
  accretionDiskVertexShader,
} from "./shaders"

export function createAccretionDiskMaterial(
  layer: AccretionDiskLayerConfig,
): ShaderMaterial {
  return new ShaderMaterial({
    glslVersion: GLSL3,
    vertexShader: accretionDiskVertexShader,
    fragmentShader: accretionDiskFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uInnerRadius: { value: layer.inner },
      uOuterRadius: { value: layer.outer },
      uMaxTemp: { value: layer.maxTemp },
      uBeamExponent: { value: layer.beamExponent },
      uHorizonRadius: { value: EVENT_HORIZON_VISUAL_RADIUS },
      uNoiseScale: { value: layer.noiseScale },
      uNoiseCirculation: { value: layer.circulation },
      uRotationSpeed: { value: layer.speed },
      uOpacity: { value: layer.opacity },
      uUseBlackbody: { value: false },
      uBlackbody: { value: null },
    },
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    side: DoubleSide,
    toneMapped: false,
  })
}

export function applyBlackbodyTexture(mesh: Mesh, texture: Texture) {
  const material = mesh.material as ShaderMaterial
  material.uniforms.uBlackbody.value = texture
  material.uniforms.uUseBlackbody.value = true
}

export function updateAccretionDiskTime(mesh: Mesh, elapsedTime: number) {
  const material = mesh.material as ShaderMaterial
  material.uniforms.uTime.value = elapsedTime
}

export function disposeAccretionDiskMesh(mesh: Mesh) {
  mesh.geometry.dispose()
  ;(mesh.material as ShaderMaterial).dispose()
}
