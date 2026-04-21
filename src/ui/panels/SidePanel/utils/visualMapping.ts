/**
 * Redundancia detectada:
 * este helper dejo de usarse cuando el panel paso a depender de estilos por region
 * en lugar de filtros globales. Se conserva para revisar si conviene eliminarlo.
 */
import { REGION_THRESHOLDS } from "../../../../physics/regionResolver"

export function mapDistanceToVisualFactor(rRs: number): number {
  const min = REGION_THRESHOLDS.horizon
  const max = REGION_THRESHOLDS.strong + 2
  const t = (max - rRs) / (max - min)

  return Math.pow(Math.min(Math.max(t, 0), 1), 2)
}
