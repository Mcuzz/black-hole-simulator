import { getDistanceThresholds } from "../core/units/renderScale"

export type Region = "safe" | "strong" | "photon-sphere" | "horizon"

export function resolveRegion(distance: number, rs: number): Region {
  const thresholds = getDistanceThresholds(rs)

  if (distance <= thresholds.horizon) {
    return "horizon"
  }

  if (distance <= thresholds.photonSphere) {
    return "photon-sphere"
  }

  if (distance <= thresholds.strong) {
    return "strong"
  }

  return "safe"
}
