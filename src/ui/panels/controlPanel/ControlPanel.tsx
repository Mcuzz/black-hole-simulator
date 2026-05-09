import type { ChangeEvent } from "react"
import type { SimulationState } from "../../../core/state/simulationState"

interface ControlPanelProps {
  state: SimulationState
  minDistance: number
  maxDistance: number
  onTargetDistanceChange: (distance: number) => void
  onToggleVisibility: () => void
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v))

export function ControlPanel({
  state,
  minDistance,
  maxDistance,
  onTargetDistanceChange,
  onToggleVisibility,
}: ControlPanelProps) {
  const rs = state.blackHole.schwarzschildRadius || 1
  const currentDistanceRs = state.spacecraftNear.distance / rs
  const targetDistance = state.targetDistance
  const step = Math.max(rs * 0.05, 0.001)

  function handleSlider(e: ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value)
    if (Number.isFinite(v)) onTargetDistanceChange(v)
  }

  function moveDelta(delta: number) {
    const next = clamp(targetDistance + delta, minDistance, maxDistance)
    if (Number.isFinite(next)) onTargetDistanceChange(next)
  }

  return (
    <section className="control-panel">
      <button
        aria-label="Ocultar control de trayectoria"
        className="panel-hide-button panel-hide-button--clock"
        onClick={onToggleVisibility}
        type="button"
      >
        ×
      </button>

      <p className="eyebrow">Trayectoria</p>

      <p className="control-panel__distance">
        {currentDistanceRs.toFixed(2)} r_s
      </p>

      <input
        type="range"
        className="distance-slider"
        min={minDistance}
        max={maxDistance}
        step={step}
        value={targetDistance}
        onChange={handleSlider}
        aria-label="Distancia objetivo"
      />

      <div className="distance-actions">
        <button type="button" onClick={() => moveDelta(-rs * 0.5)}>
          −0.5 r_s
        </button>
        <button type="button" onClick={() => moveDelta(rs * 0.5)}>
          +0.5 r_s
        </button>
      </div>
    </section>
  )
}