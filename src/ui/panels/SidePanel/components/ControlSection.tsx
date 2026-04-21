import type { ChangeEvent } from "react"
import type { ControlSectionProps } from "./types/panelTypes"

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

export function ControlSection({
  minDistance,
  maxDistance,
  currentDistance,
  targetDistance,
  schwarzschildRadius,
  onTargetDistanceChange,
  nearDistanceRs,
  targetDistanceRs,
}: ControlSectionProps) {
  const safeDistance = Number.isFinite(currentDistance)
    ? currentDistance
    : minDistance
  const safeTargetDistance = Number.isFinite(targetDistance)
    ? targetDistance
    : safeDistance
  const safeNearDistanceRs = Number.isFinite(nearDistanceRs)
    ? nearDistanceRs
    : 0
  const safeTargetDistanceRs = Number.isFinite(targetDistanceRs)
    ? targetDistanceRs
    : safeNearDistanceRs
  const step = Math.max(schwarzschildRadius * 0.05, 0.001)
  const travelProgress =
    maxDistance > minDistance
      ? ((safeTargetDistance - minDistance) / (maxDistance - minDistance)) * 100
      : 0

  function handleSliderChange(event: ChangeEvent<HTMLInputElement>) {
    const value = Number(event.target.value)

    if (!Number.isFinite(value)) {
      return
    }

    onTargetDistanceChange(value)
  }

  function moveDelta(delta: number) {
    const nextValue = clamp(safeTargetDistance + delta, minDistance, maxDistance)

    if (!Number.isFinite(nextValue)) {
      return
    }

    onTargetDistanceChange(nextValue)
  }

  return (
    <section className="panel-section">
      <div className="panel-section__header">
        <div>
          <p className="panel-kicker">Control de trayectoria</p>
          <h3>Movimiento radial</h3>
        </div>
        <span className="panel-badge">{safeNearDistanceRs.toFixed(2)} r_s</span>
      </div>

      <p>
        Ajusta la distancia objetivo del observador cercano. El motor interpola
        la nave de forma estable para mantener la simulacion suave.
      </p>

      <div className="distance-readout">
        <article>
          <small>Distancia actual</small>
          <strong>{safeNearDistanceRs.toFixed(2)} r_s</strong>
        </article>

        <article>
          <small>Objetivo activo</small>
          <strong>{safeTargetDistanceRs.toFixed(2)} r_s</strong>
        </article>
      </div>

      <div className="distance-track" aria-hidden="true">
        <div
          className="distance-track__fill"
          style={{ width: `${clamp(travelProgress, 0, 100)}%` }}
        />
      </div>

      <input
        type="range"
        className="distance-slider"
        min={minDistance}
        max={maxDistance}
        step={step}
        value={safeTargetDistance}
        onChange={handleSliderChange}
      />

      <div className="distance-actions">
        <button
          type="button"
          onClick={() => moveDelta(-schwarzschildRadius * 0.5)}
        >
          -0.5 r_s
        </button>

        <button
          type="button"
          onClick={() => moveDelta(schwarzschildRadius * 0.5)}
        >
          +0.5 r_s
        </button>
      </div>

      <small>
        Limites operativos: {minDistance.toFixed(2)} a {maxDistance.toFixed(2)} unidades
        normalizadas.
      </small>
    </section>
  )
}
