export type Vector3 = [number, number, number]

export interface BlackHoleState {
  mass: number
  schwarzschildRadius: number
}

export interface SpacecraftState {
  distance: number
  position: Vector3
  radialVelocity: number
}

export interface ClockState {
  nearObserverTime: number
  farObserverTime: number
  nearRate: number
}

export interface SimulationState {
  globalTime: number
  blackHole: BlackHoleState
  spacecraftNear: SpacecraftState
  spacecraftFar: SpacecraftState
  clocks: ClockState
  effects: PhysicsEffectsState
  targetDistance: number
}

export interface PhysicsEffectsState {
  lensingStrength: number
  timeDilation: number
  gravitationalRedshift: number
  photonSphereRegion: boolean
  spaghettificationFactor: number
  horizonProximity: number
  region: "safe" | "strong" | "photon-sphere" | "horizon"
}