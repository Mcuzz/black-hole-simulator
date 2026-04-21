/**
 * gravitationalLensing.ts
 *
 * Calcula la intensidad del efecto de gravitational lensing
 * según la distancia al agujero negro.
 */

export function computeLensingStrength(
  distance: number,
  schwarzschildRadius: number
): number {

  const r = distance
  const rs = schwarzschildRadius

  /**
   * Factor base de curvatura.
   * Aumenta rápidamente cerca del horizonte.
   */
  const curvature = rs / r

  /**
   * Escalamos el efecto para que sea visible
   * en la simulación.
   */
  const strength = curvature * 15

  /**
   * Evita valores extremos que rompan el shader
   */
  return Math.min(strength, 3)

}