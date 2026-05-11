import type { SimulationState } from "../core/state/simulationState"
import { mapDistanceToRenderRadius } from "../core/units/renderScale"
import { computeTimeDilation } from "./schwarzschildPhysics"
import { updateRelativisticEffects } from "./updateRelativisticEffects"

export function updateSimulation(state: SimulationState, dt: number) {
  if (!Number.isFinite(dt) || dt <= 0) {
    return
  }

  const rs = state.blackHole.schwarzschildRadius
  const near = state.spacecraftNear
  const far = state.spacecraftFar
  const eventHorizon = rs
  const safeMargin = 0.0001
  const minDistance = eventHorizon + safeMargin
  const visualTimeScale = 0.6

  state.globalTime += dt

  if (!Number.isFinite(near.distance)) {
    near.distance = minDistance
  }

  if (near.distance <= eventHorizon) {
    near.distance = minDistance
  }

  const nearDilation = computeTimeDilation(rs, near.distance)

  state.clocks.nearObserverTime += dt * (nearDilation * visualTimeScale)
  state.clocks.farObserverTime += dt * visualTimeScale

  near.position[0] = mapDistanceToRenderRadius(near.distance, rs, far.distance)
  near.position[1] = 0
  near.position[2] = 0

  far.position[0] = mapDistanceToRenderRadius(far.distance, rs, far.distance)
  far.position[1] = 0
  far.position[2] = 0

  updateRelativisticEffects(state)
}
