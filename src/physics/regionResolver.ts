import { SIMULATION_CONFIG } from "../config/simulationConfig"
import { getDistanceThresholds } from "../core/units/renderScale"

export type Region = "safe" | "strong" | "photon-sphere" | "horizon"

export const REGION_THRESHOLDS = {
  strong: SIMULATION_CONFIG.regionThresholds.strongGravityDistance,
  photonSphere: SIMULATION_CONFIG.regionThresholds.photonSphereDistanceRs,
  horizon: SIMULATION_CONFIG.regionThresholds.horizonDistanceRs,
} as const

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
