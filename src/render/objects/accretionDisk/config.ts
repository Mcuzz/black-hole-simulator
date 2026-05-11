export interface AccretionDiskLayerConfig {
  inner: number
  outer: number
  segments: number
  maxTemp: number
  beamExponent: number
  noiseScale: number
  circulation: number
  speed: number
  opacity: number
}

export const ACCRETION_DISK_LAYERS: Record<
  "main" | "haze",
  AccretionDiskLayerConfig
> = {
  main: {
    inner: 2.48,
    outer: 6.72,
    segments: 200,
    maxTemp: 9500,
    beamExponent: 1.2,
    noiseScale: 1.52,
    circulation: 1.5,
    speed: 0.065,
    opacity: 2.56,
  },
  haze: {
    inner: 2.35,
    outer: 5.45,
    segments: 160,
    maxTemp: 5500,
    beamExponent: 1.5,
    noiseScale: 0.98,
    circulation: 0.75,
    speed: 0.04,
    opacity: 9,
  },
  
}

export const EVENT_HORIZON_VISUAL_RADIUS = 1.92

// A slight tilt keeps the ring readable in every camera mode.
export const ACCRETION_DISK_ROTATION: [number, number, number] = [
  Math.PI / 2.45,
  0.38,
  -0.08,
]
