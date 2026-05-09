import type { SimulationState } from "../../../../core/state/simulationState"

export type PhysicsMetrics = ReturnType<typeof usePhysicsMetrics>

export function usePhysicsMetrics(state: SimulationState) {
  const rs = state.blackHole.schwarzschildRadius || 1
  const r = state.spacecraftNear.distance || rs
  const targetDistance = state.targetDistance || r
  const nearDistanceRs = rs > 0 ? r / rs : 0
  const farDistanceRs = rs > 0 ? state.spacecraftFar.distance / rs : 0
  const targetDistanceRs = rs > 0 ? targetDistance / rs : 0
  const potentialFactor = r > rs ? 1 - rs / r : 0
  const sqrtFactor = Math.sqrt(Math.max(potentialFactor, 0))

  return {
    rs,
    r,
    targetDistance,
    nearDistanceRs,
    farDistanceRs,
    targetDistanceRs,
    potentialFactor,
    sqrtFactor,
    region: state.effects.region,
    horizonProximity: state.effects.horizonProximity,
    timeDilation: state.effects.timeDilation,
    redshift: state.effects.gravitationalRedshift,
    lensing: state.effects.lensingStrength,
    spaghettification: state.effects.spaghettificationFactor,
    clockNear: state.clocks.nearObserverTime,
    clockFar: state.clocks.farObserverTime,
    nearRate: state.clocks.nearRate,
    clockGap: state.clocks.farObserverTime - state.clocks.nearObserverTime,
    // Radiación de Hawking
    hawkingTemperature: state.effects.hawkingTemperature,
    evaporationRate: state.effects.evaporationRate,
    hawkingGlowIntensity: state.effects.hawkingGlowIntensity,
    blackHoleMass: state.blackHole.mass,
  }
}