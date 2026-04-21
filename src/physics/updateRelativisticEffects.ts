import type { SimulationState } from "../core/state/simulationState"
import { computeLensingStrength } from "./gravitationalLensing"
import {
  computeRedshift,
  computeTimeDilation,
  computeSpaghettificationFactor,
} from "./schwarzschildPhysics"
import { REGION_THRESHOLDS, resolveRegion } from "./regionResolver"

export function updateRelativisticEffects(state: SimulationState) {
  const distance = state.spacecraftNear.distance
  const rs = state.blackHole.schwarzschildRadius
  const distanceRatio = distance / rs

  state.effects.lensingStrength = computeLensingStrength(distance, rs)
  state.effects.timeDilation = computeTimeDilation(rs, distance)
  state.effects.gravitationalRedshift = computeRedshift(rs, distance)
  state.effects.spaghettificationFactor =
    computeSpaghettificationFactor(rs, distance)

  const clamp = (value: number, min: number, max: number) =>
    Math.min(max, Math.max(min, value))
  const visualStart = REGION_THRESHOLDS.strong
  const visualEnd = REGION_THRESHOLDS.horizon
  const t = (distanceRatio - visualEnd) / (visualStart - visualEnd)

  state.effects.horizonProximity = clamp(1 - t, 0, 1)
  state.effects.photonSphereRegion =
    distanceRatio <= REGION_THRESHOLDS.photonSphere
  state.effects.region = resolveRegion(distanceRatio)
  state.clocks.nearRate = state.effects.timeDilation
}
