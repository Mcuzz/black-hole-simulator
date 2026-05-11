import type { SimulationState } from "../core/state/simulationState"
import { getDistanceThresholds } from "../core/units/renderScale"
import { computeLensingStrength } from "./gravitationalLensing"
import {
  computeRedshift,
  computeTimeDilation,
  computeSpaghettificationFactor,
  computeHawkingTemperature,
  computeEvaporationRate,
  computeHawkingGlowIntensity,
} from "./schwarzschildPhysics"
import { resolveRegion } from "./regionResolver"

export function updateRelativisticEffects(state: SimulationState) {
  const distance = state.spacecraftNear.distance
  const rs = state.blackHole.schwarzschildRadius
  const mass = state.blackHole.mass
  const thresholds = getDistanceThresholds(rs)

  state.effects.lensingStrength = computeLensingStrength(distance, rs)
  state.effects.timeDilation = computeTimeDilation(rs, distance)
  state.effects.gravitationalRedshift = computeRedshift(rs, distance)
  state.effects.spaghettificationFactor = computeSpaghettificationFactor(
    rs,
    distance,
  )

  // Radiación de Hawking
  state.effects.hawkingTemperature = computeHawkingTemperature(rs)
  state.effects.evaporationRate = computeEvaporationRate(mass)
  state.effects.hawkingGlowIntensity = computeHawkingGlowIntensity(
    rs,
    distance,
  )

  const clamp = (v: number, min: number, max: number) =>
    Math.min(max, Math.max(min, v))

  const t =
    (distance - thresholds.horizon) /
    Math.max(thresholds.strong - thresholds.horizon, 1e-6)

  state.effects.horizonProximity = clamp(1 - t, 0, 1)
  state.effects.photonSphereRegion = distance <= thresholds.photonSphere
  state.effects.region = resolveRegion(distance, rs)
  state.clocks.nearRate = state.effects.timeDilation
}
