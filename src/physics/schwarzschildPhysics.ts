import { SIMULATION_CONFIG } from "../config/simulationConfig"

export function computeSchwarzschildRadius(mass: number): number {
  const { G, C } = SIMULATION_CONFIG

  return (2 * G * mass) / (C * C)
}

export function computeTimeDilation(
  schwarzschildRadius: number,
  distance: number,
): number {
  if (!Number.isFinite(distance) || distance <= schwarzschildRadius) {
    return 0
  }

  const term = 1 - schwarzschildRadius / distance

  return Math.sqrt(Math.max(term, 0))
}

export function computeRedshift(
  schwarzschildRadius: number,
  distance: number,
): number {
  if (!Number.isFinite(distance) || distance <= schwarzschildRadius) {
    return Infinity
  }

  const term = 1 - schwarzschildRadius / distance
  const safeTerm = Math.max(term, 1e-12)

  return 1 / Math.sqrt(safeTerm)
}

export function computeSpaghettificationFactor(
  schwarzschildRadius: number,
  distance: number,
): number {
  const safeDistance = Math.max(distance, schwarzschildRadius * 1.02)
  const tidalCompression = schwarzschildRadius / safeDistance

  return Math.min(tidalCompression * 4.5, 6)
}
