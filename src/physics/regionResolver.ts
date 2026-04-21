export type Region = "safe" | "strong" | "photon-sphere" | "horizon"

/**
 * Basado en la escala descrita en los PDF del proyecto:
 * ~1 r_s horizonte, ~1.5 r_s esfera de fotones y ~5 r_s gravedad fuerte.
 */
export const REGION_THRESHOLDS = {
  horizon: 1.12,
  photonSphere: 1.5,
  strong: 5,
} as const

export function resolveRegion(rRs: number): Region {
  if (rRs <= REGION_THRESHOLDS.horizon) {
    return "horizon"
  }

  if (rRs <= REGION_THRESHOLDS.photonSphere) {
    return "photon-sphere"
  }

  if (rRs <= REGION_THRESHOLDS.strong) {
    return "strong"
  }

  return "safe"
}
