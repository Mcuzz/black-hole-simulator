import { REGION_THRESHOLDS } from "../../../../physics/regionResolver"
import type { PhysicsMetrics } from "../hooks/usePhysicsMetrics"

type NarrativeResult = {
  title: string
  body: string
  tone: "safe" | "strong" | "photon-sphere" | "horizon"
}

export function computeNarrative(metrics: PhysicsMetrics): NarrativeResult {
  const r = metrics.nearDistanceRs
  const dilation = metrics.timeDilation
  const redshift = metrics.redshift

  if (r <= REGION_THRESHOLDS.horizon) {
    return {
      tone: "horizon",
      title: "Horizonte de eventos",
      body:
        "Desde el exterior, la nave parece congelarse en el tiempo. " +
        "La luz que emite esta tan estirada que se vuelve practicamente invisible.",
    }
  }

  if (r <= REGION_THRESHOLDS.photonSphere) {
    return {
      tone: "photon-sphere",
      title: "Esfera de fotones",
      body:
        "La luz puede orbitar el agujero negro. " +
        "Las trayectorias visuales se vuelven caoticas y aparecen anillos brillantes.",
    }
  }

  if (r <= REGION_THRESHOLDS.strong) {
    return {
      tone: "strong",
      title: "Gravedad intensa",
      body:
        `El tiempo local se desacelera notablemente (x${dilation.toFixed(2)}). ` +
        `La luz pierde energia (z ~= ${redshift.toFixed(2)}).`,
    }
  }

  return {
    tone: "safe",
    title: "Region segura",
    body:
      `Las diferencias relativistas son pequenas. ` +
      `Dilatacion ~= ${dilation.toFixed(3)}, redshift ~= ${redshift.toFixed(3)}.`,
  }
}
