import { SIMULATION_CONFIG } from "../config/simulationConfig"

export function computeSchwarzschildRadius(mass: number): number {
  const { G, C } = SIMULATION_CONFIG
  return (2 * G * mass) / (C * C)
}

export function computeTimeDilation(
  schwarzschildRadius: number,
  distance: number,
): number {
  if (!Number.isFinite(distance) || distance <= schwarzschildRadius) return 0
  const term = 1 - schwarzschildRadius / distance
  return Math.sqrt(Math.max(term, 0))
}

export function computeRedshift(
  schwarzschildRadius: number,
  distance: number,
): number {
  if (!Number.isFinite(distance) || distance <= schwarzschildRadius)
    return Infinity
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

/**
 * Temperatura de Hawking (unidades normalizadas G=c=1, k_B=1, ℏ=1)
 *
 * T_H = ℏc³ / (8πGMk_B)
 *
 * Con G=c=ℏ=k_B=1:  T_H = 1 / (4π * r_s)
 *
 * El valor es pedagógico/visual — en unidades reales sería
 * extremadamente pequeño para agujeros negros estelares.
 */
export function computeHawkingTemperature(
  schwarzschildRadius: number,
): number {
  if (schwarzschildRadius <= 0) return 0
  return 1 / (4 * Math.PI * schwarzschildRadius)
}

/**
 * Tasa de evaporación (pérdida de masa por unidad de tiempo).
 *
 * dM/dt = -ℏc⁴ / (15360π G² M²)
 *
 * Con G=c=ℏ=1:  dM/dt = -1 / (15360π M²)
 *
 * Se devuelve el valor absoluto para mostrarlo como "tasa de pérdida".
 * Escalado ×1e3 para que sea legible en la UI con M=1.
 */
export function computeEvaporationRate(mass: number): number {
  if (mass <= 0) return 0
  const raw = 1 / (15360 * Math.PI * mass * mass)
  // Factor de escala visual para que el número sea pedagógicamente útil
  return raw * 1e3
}

/**
 * Intensidad visual del halo de Hawking.
 * Aumenta cuando la nave se acerca al horizonte.
 * Devuelve un valor entre 0 y 1.
 */
export function computeHawkingGlowIntensity(
  schwarzschildRadius: number,
  distance: number,
): number {
  if (distance <= schwarzschildRadius) return 1
  const ratio = schwarzschildRadius / distance
  // Crece de forma no lineal al aproximarse al horizonte
  return Math.min(Math.pow(ratio, 2) * 4, 1)
}