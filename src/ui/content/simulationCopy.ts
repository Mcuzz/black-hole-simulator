import type { SceneView } from "../../render/scene/SimulationScene"

export type SimulationRegion =
  | "safe"
  | "strong"
  | "photon-sphere"
  | "horizon"

export type StatusMetricKey =
  | "region"
  | "distance"
  | "timeDilation"
  | "redshift"

export const VIEW_COPY: Record<
  SceneView,
  {
    label: string
    eyebrow: string
    title: string
    description: string
  }
> = {
  external: {
    label: "Vista principal",
    eyebrow: "Schwarzschild / sistema completo",
    title: "Observador externo",
    description:
      "Vista orbital para estudiar la trayectoria, la lente gravitacional y la divergencia entre ambos relojes.",
  },
  near: {
    label: "Observador cercano",
    eyebrow: "Marco propio / nave interactiva",
    title: "Cabina relativista",
    description:
      "Perspectiva de la nave que se aproxima al horizonte para seguir su tiempo propio y la deformacion visual del entorno.",
  },
  far: {
    label: "Observador lejano",
    eyebrow: "Marco de referencia / espacio seguro",
    title: "Puesto de seguimiento",
    description:
      "Vista estabilizada desde la nave distante para comparar el tiempo coordinado con la experiencia del observador cercano.",
  },
}

export const VIEW_NOTES: Record<SceneView, string> = {
  external: "Observador externo: mide el tiempo coordinado y compara ambos marcos.",
  near: "Observador cercano: vive su tiempo propio mientras la curvatura domina la escena.",
  far: "Observador lejano: conserva el marco de referencia estable del experimento.",
}

export const REGION_COPY: Record<
  SimulationRegion,
  {
    title: string
    body: string
  }
> = {
  safe: {
    title: "Region segura",
    body: "La nave permanece en un regimen donde el tiempo y la luz casi no difieren del espacio plano.",
  },
  strong: {
    title: "Gravedad fuerte",
    body: "La curvatura del espacio-tiempo ya altera la marcha de los relojes y enrojece la luz emitida.",
  },
  "photon-sphere": {
    title: "Esfera de fotones",
    body: "La trayectoria de la luz se vuelve inestable y las deformaciones visuales alcanzan su zona mas dramatica.",
  },
  horizon: {
    title: "Horizonte de eventos",
    body: "Desde fuera, la nave parece congelarse y su senal se apaga al acercarse al punto de no retorno.",
  },
}

export const REGION_LABELS: Record<SimulationRegion, string> = {
  safe: "Segura",
  strong: "Gravedad fuerte",
  "photon-sphere": "Esfera de fotones",
  horizon: "Horizonte",
}

export const STATUS_HELP_COPY: Record<
  StatusMetricKey,
  {
    label: string
    help: string
  }
> = {
  region: {
    label: "Region",
    help:
      "Indica en que zona del pozo gravitatorio se encuentra la nave: segura, gravedad fuerte, esfera de fotones u horizonte.",
  },
  distance: {
    label: "Distancia",
    help:
      "Mide que tan lejos esta la nave respecto al agujero negro usando radios de Schwarzschild como unidad normalizada.",
  },
  timeDilation: {
    label: "Dilatacion",
    help:
      "Expresa cuanto se ralentiza el tiempo propio del observador cercano comparado con el observador lejano.",
  },
  redshift: {
    label: "Redshift",
    help:
      "Representa cuanto se estira la luz emitida por la nave al escapar del campo gravitatorio, desplazandose hacia el rojo.",
  },
}
