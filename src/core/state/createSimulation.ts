/**
 * createSimulation.ts
 *
 * Construye el estado inicial completo de la simulación.
 * Este archivo NO contiene lógica de actualización.
 * Solo define cómo nace el universo del simulador.
 */

import { SIMULATION_CONFIG } from "../../config/simulationConfig"
import type { PhysicsEffectsState, SimulationState } from "./simulationState"
import { mapDistanceToRenderRadius } from "../units/renderScale"
import { computeSchwarzschildRadius } from "../../physics/schwarzschildPhysics"

export function createInitialSimulationState(): SimulationState {

  const mass = SIMULATION_CONFIG.blackHoleMass

  const schwarzschildRadius = computeSchwarzschildRadius(mass)

  const nearDistance =
    SIMULATION_CONFIG.initialNearObserverDistance * schwarzschildRadius

  const farDistance =
    SIMULATION_CONFIG.farObserverDistance * schwarzschildRadius

  const nearRenderRadius = mapDistanceToRenderRadius(
    nearDistance,
    schwarzschildRadius,
    farDistance,
  )

  const farRenderRadius = mapDistanceToRenderRadius(
    farDistance,
    schwarzschildRadius,
    farDistance,
  )

  const initialEffects: PhysicsEffectsState = {
    lensingStrength: 0,
    timeDilation: 1,
    gravitationalRedshift: 1,
    photonSphereRegion: false,
    spaghettificationFactor: 0,
    horizonProximity: 0,
    region: "safe",
    hawkingTemperature: 0,
    evaporationRate: 0,
    hawkingGlowIntensity: 0,
  }

  const state: SimulationState = {
    globalTime: 0,

    blackHole: {
      mass,
      schwarzschildRadius,
    },

    spacecraftNear: {
      distance: nearDistance,
      position: [nearRenderRadius, 0, 0],
      radialVelocity: 0,
    },

    spacecraftFar: {
      distance: farDistance,
      position: [farRenderRadius, 0, 0],
      radialVelocity: 0,
    },

    clocks: {
      nearObserverTime: 0,
      farObserverTime: 0,
      nearRate: 1,
    },

    effects: initialEffects,

    targetDistance: nearDistance,
  }

  return state
}