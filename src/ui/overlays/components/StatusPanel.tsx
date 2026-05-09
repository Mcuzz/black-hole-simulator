import type { SimulationState } from "../../../core/state/simulationState"
import { REGION_LABELS } from "../../content/simulationCopy"

interface StatusPanelProps {
  state: SimulationState
  onToggleVisibility: () => void
}

export function StatusPanel({ state, onToggleVisibility }: StatusPanelProps) {
  const rs = state.blackHole.schwarzschildRadius || 1
  const nearDistanceRs = state.spacecraftNear.distance / rs

  return (
    <section className="status-panel status-panel--with-panel">
      <button
        aria-label="Ocultar panel de estado"
        className="panel-hide-button"
        onClick={onToggleVisibility}
        type="button"
      >
        ×
      </button>

      <p className="eyebrow">Estado</p>

      <div className="status-strip status-strip--compact">
        <article className="status-chip">
          <span>Región</span>
          <strong>{REGION_LABELS[state.effects.region]}</strong>
        </article>
        <article className="status-chip">
          <span>Distancia</span>
          <strong>{nearDistanceRs.toFixed(2)} r_s</strong>
        </article>
      </div>
    </section>
  )
}