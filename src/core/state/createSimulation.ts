/**
 * createSimulation.ts
 *
 * Construye el estado inicial completo de la simulación.
 * Este archivo NO contiene lógica de actualización.
 * Solo define cómo nace el universo del simulador.
 */

import { SIMULATION_CONFIG } from "../../config/simulationConfig"
import type { SimulationState } from "./simulationState"
import type { PhysicsEffectsState } from "./simulationState"
import { computeSchwarzschildRadius } from "../../physics/relativity"
import {
  computeHawkingTemperature,
  computeEvaporationRate,
} from "../../physics/schwarzschildPhysics"
import { mapDistanceToRenderRadius } from "../units/renderScale"

export function createInitialSimulationState(): SimulationState {
  const mass = SIMULATION_CONFIG.blackHoleMass
  const schwarzschildRadius = computeSchwarzschildRadius(mass)
  const nearDistance =
    SIMULATION_CONFIG.initialNearObserverDistance * schwarzschildRadius
  const farDistance =
    SIMULATION_CONFIG.farObserverDistance * schwarzschildRadius

  const initialEffects: PhysicsEffectsState = {
    lensingStrength: 0,
    timeDilation: 1,
    gravitationalRedshift: 1,
    photonSphereRegion: false,
    spaghettificationFactor: 0,
    horizonProximity: 0,
    region: "safe",
    hawkingTemperature: computeHawkingTemperature(schwarzschildRadius),
    evaporationRate: computeEvaporationRate(mass),
    hawkingGlowIntensity: 0,
  }

  return {
    globalTime: 0,
    blackHole: { mass, schwarzschildRadius },
    spacecraftNear: {
      distance: nearDistance,
      position: [
        mapDistanceToRenderRadius(nearDistance, schwarzschildRadius, farDistance),
        0,
        0,
      ],
      radialVelocity: 0,
    },
    spacecraftFar: {
      distance: farDistance,
      position: [
        mapDistanceToRenderRadius(farDistance, schwarzschildRadius, farDistance),
        0,
        0,
      ],
      radialVelocity: 0,
    },
    clocks: { nearObserverTime: 0, farObserverTime: 0, nearRate: 1 },
    effects: initialEffects,
    targetDistance: nearDistance,
  }
}
