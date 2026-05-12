import { BLACK_HOLE_VISUAL_RADIUS } from "../../../core/units/renderScale"

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
  thickness: number
  slices: number
  radialTaper: number
  verticalOpacityBias: number
}

export const ACCRETION_DISK_LAYERS: Record<
  "main" | "haze" | "wrap",
  AccretionDiskLayerConfig
> = {
  main: {
    inner: 2.5,
    outer: 6.3,
    segments: 220,
    maxTemp: 9800,
    beamExponent: 1.45,
    noiseScale: 2.15,
    circulation: 2.35,
    speed: 0.06,
    opacity: 2.72,
    thickness: 0.34,
    slices: 1,
    radialTaper: 0.05,
    verticalOpacityBias: 0.72,
  },
  haze: {
    inner: 2.35,
    outer: 7.2,
    segments: 180,
    maxTemp: 6200,
    beamExponent: 1.1,
    noiseScale: 0.78,
    circulation: 0.75,
    speed: 0.036,
    opacity: 5.32,
    thickness: 0.78,
    slices: 1,
    radialTaper: 0.09,
    verticalOpacityBias: 0.52,
  },
  wrap: {
    inner: 4.12,
    outer: 3.45,
    segments: 180,
    maxTemp: 10400,
    beamExponent: 1.85,
    noiseScale: 0.94,
    circulation: 1.8,
    speed: 0.072,
    opacity: 9.24,
    thickness: 4.08,
    slices: 1,
    radialTaper: 0.16,
    verticalOpacityBias: 0.84,
  },
}

export const EVENT_HORIZON_VISUAL_RADIUS = BLACK_HOLE_VISUAL_RADIUS

// A slight tilt keeps the ring readable in every camera mode.
export const ACCRETION_DISK_ROTATION: [number, number, number] = [
  Math.PI / 2.45,
  0.38,
  -0.08,
]
