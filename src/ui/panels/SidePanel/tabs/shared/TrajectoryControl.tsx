import { type ChangeEvent } from "react"

type TrajectoryControlProps = {
  currentDistanceRs: number
  minDistance: number
  maxDistance: number
  rs: number
  targetDistance: number
  onTargetDistanceChange: (distance: number) => void
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function TrajectoryControl({
  currentDistanceRs,
  minDistance,
  maxDistance,
  rs,
  targetDistance,
  onTargetDistanceChange,
}: TrajectoryControlProps) {
  const step = Math.max(rs * 0.05, 0.001)

  function handleSlider(event: ChangeEvent<HTMLInputElement>) {
    const nextValue = Number(event.target.value)
    if (Number.isFinite(nextValue)) {
      onTargetDistanceChange(nextValue)
    }
  }

  function moveDelta(delta: number) {
    const nextDistance = clamp(targetDistance + delta, minDistance, maxDistance)
    if (Number.isFinite(nextDistance)) {
      onTargetDistanceChange(nextDistance)
    }
  }

  return (
    <section className="panel-section panel-section--control">
      <div className="control-header">
        <p className="panel-kicker">Trayectoria de la nave cercana</p>
        <span className="control-distance-badge">
          {currentDistanceRs.toFixed(2)} r<sub>s</sub>
        </span>
      </div>

      <input
        type="range"
        className="distance-slider"
        min={minDistance}
        max={maxDistance}
        step={step}
        value={targetDistance}
        onChange={handleSlider}
        aria-label="Distancia objetivo de la nave cercana"
      />

      <p className="control-unit-note">
        Distancia en radios de Schwarzschild (r<sub>s</sub> = 2GM/c²).
        Mínimo 1.02 r<sub>s</sub>, justo por encima del horizonte.
      </p>

      <div className="distance-actions">
        <button type="button" onClick={() => moveDelta(-rs * 0.5)}>
          −0.5 r<sub>s</sub>
        </button>
        <button type="button" onClick={() => moveDelta(rs * 0.5)}>
          +0.5 r<sub>s</sub>
        </button>
      </div>
    </section>
  )
}
