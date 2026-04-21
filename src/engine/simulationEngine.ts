import { SIMULATION_CONFIG } from "../config/simulationConfig"
import type { SimulationState } from "../core/state/simulationState"
import { updateSimulation } from "../physics/updateSimulation"

export class SimulationEngine {
  private state: SimulationState
  private listeners = new Set<() => void>()
  private version = 0
  private snapshot: { state: SimulationState; version: number }

  constructor(initialState: SimulationState) {
    this.state = initialState
    this.snapshot = this.createSnapshot()
  }

  setTargetDistance(distance: number) {
    if (!Number.isFinite(distance)) {
      return
    }

    const nextDistance = this.clampTargetDistance(distance)

    if (Math.abs(nextDistance - this.state.targetDistance) < 1e-6) {
      return
    }

    this.state.targetDistance = nextDistance
    this.emit()
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  step(dt: number) {
    if (!Number.isFinite(dt) || dt <= 0) {
      return
    }

    const scaledDt = dt * SIMULATION_CONFIG.simulationSpeed
    const near = this.state.spacecraftNear
    const targetDistance = this.state.targetDistance
    const lerpFactor = Math.min(0.28, 0.12 + dt * 0.45)

    if (Number.isFinite(targetDistance)) {
      near.distance =
        near.distance + (targetDistance - near.distance) * lerpFactor
    }

    if (Math.abs(targetDistance - near.distance) < 1e-4) {
      near.distance = targetDistance
    }

    updateSimulation(this.state, scaledDt)
    this.emit()
  }

  getState(): SimulationState {
    return this.state
  }

  getSnapshot() {
    return this.snapshot
  }

  private clampTargetDistance(distance: number) {
    const rs = this.state.blackHole.schwarzschildRadius
    const minDistance = rs * 1.02
    const maxDistance = this.state.spacecraftFar.distance * 0.92

    return Math.min(maxDistance, Math.max(minDistance, distance))
  }

  private createSnapshot() {
    return {
      version: this.version,
      state: {
        ...this.state,
        blackHole: { ...this.state.blackHole },
        spacecraftNear: { ...this.state.spacecraftNear },
        spacecraftFar: { ...this.state.spacecraftFar },
        clocks: { ...this.state.clocks },
        effects: { ...this.state.effects },
      },
    }
  }

  private emit() {
    this.version += 1
    this.snapshot = this.createSnapshot()
    this.listeners.forEach((listener) => listener())
  }
}
