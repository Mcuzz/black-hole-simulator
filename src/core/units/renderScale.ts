import { SIMULATION_CONFIG } from "../../config/simulationConfig"

export const BLACK_HOLE_VISUAL_RADIUS = 1.92

type DistanceStop = {
  distance: number
  radius: number
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t
}

function inverseLerp(start: number, end: number, value: number) {
  if (Math.abs(end - start) < 1e-6) {
    return 0
  }

  return clamp((value - start) / (end - start), 0, 1)
}

export function getDistanceThresholds(rs: number) {
  const {
    strongGravityDistance,
    photonSphereDistanceRs,
    horizonDistanceRs,
  } = SIMULATION_CONFIG.regionThresholds

  return {
    strong: strongGravityDistance,
    photonSphere: photonSphereDistanceRs * rs,
    horizon: horizonDistanceRs * rs,
  }
}

function buildVisualStops(rs: number, farDistance: number): DistanceStop[] {
  const thresholds = getDistanceThresholds(rs)
  const safeFarDistance = Math.max(
    farDistance,
    thresholds.strong + rs * 4,
  )

  return [
    { distance: rs, radius: BLACK_HOLE_VISUAL_RADIUS },
    {
      distance: thresholds.horizon,
      radius: SIMULATION_CONFIG.visualDistanceStops.horizonRadius,
    },
    {
      distance: thresholds.photonSphere,
      radius: SIMULATION_CONFIG.visualDistanceStops.photonSphereRadius,
    },
    {
      distance: thresholds.strong,
      radius: SIMULATION_CONFIG.visualDistanceStops.strongGravityRadius,
    },
    {
      distance: safeFarDistance,
      radius: SIMULATION_CONFIG.visualDistanceStops.farFieldRadius,
    },
  ]
}

/**
 * Mapea una distancia física a un radio visible en escena usando una curva
 * por tramos. Así mantenemos el horizonte legible y el campo lejano compacto.
 */
export function mapDistanceToRenderRadius(
  distance: number,
  rs: number,
  farDistance: number,
) {
  if (!Number.isFinite(distance) || distance <= 0) {
    return BLACK_HOLE_VISUAL_RADIUS
  }

  const stops = buildVisualStops(rs, farDistance)
  const clampedDistance = clamp(distance, stops[0].distance, stops.at(-1)?.distance ?? distance)

  for (let index = 0; index < stops.length - 1; index += 1) {
    const current = stops[index]
    const next = stops[index + 1]

    if (clampedDistance <= next.distance) {
      const t = inverseLerp(current.distance, next.distance, clampedDistance)
      return lerp(current.radius, next.radius, t)
    }
  }

  return stops.at(-1)?.radius ?? BLACK_HOLE_VISUAL_RADIUS
}
