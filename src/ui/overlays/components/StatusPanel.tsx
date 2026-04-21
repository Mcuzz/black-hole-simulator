import { useState } from "react"
import type { SimulationState } from "../../../core/state/simulationState"
import {
  REGION_LABELS,
  STATUS_HELP_COPY,
  type StatusMetricKey,
} from "../../content/simulationCopy"

interface StatusPanelProps {
  state: SimulationState
  hasSidePanel: boolean
}

export function StatusPanel({ state, hasSidePanel }: StatusPanelProps) {
  const [activeHelp, setActiveHelp] = useState<StatusMetricKey | null>(null)
  const rs = state.blackHole.schwarzschildRadius || 1
  const nearDistanceRs = state.spacecraftNear.distance / rs
  const metrics: Array<{
    key: StatusMetricKey
    value: string
  }> = [
    {
      key: "region",
      value: REGION_LABELS[state.effects.region],
    },
    {
      key: "distance",
      value: `${nearDistanceRs.toFixed(2)} r_s`,
    },
    {
      key: "timeDilation",
      value: state.effects.timeDilation.toFixed(3),
    },
    {
      key: "redshift",
      value: Number.isFinite(state.effects.gravitationalRedshift)
        ? state.effects.gravitationalRedshift.toFixed(3)
        : "∞",
    },
  ]

  return (
    <section className={`status-panel${hasSidePanel ? " status-panel--with-panel" : ""}`}>
      <p className="eyebrow">Datos en tiempo real</p>
      <div className="status-strip">
        {metrics.map((metric) => {
          const helpCopy = STATUS_HELP_COPY[metric.key]
          const isOpen = activeHelp === metric.key

          return (
            <article className="status-chip" key={metric.key}>
              <div className="status-chip__header">
                <span>{helpCopy.label}</span>
                <button
                  aria-expanded={isOpen}
                  className={`status-chip__help ${isOpen ? "active" : ""}`}
                  onClick={() =>
                    setActiveHelp((current) =>
                      current === metric.key ? null : metric.key,
                    )
                  }
                  type="button"
                >
                  ?
                </button>
              </div>

              <strong>{metric.value}</strong>

              {isOpen && <p className="status-chip__tooltip">{helpCopy.help}</p>}
            </article>
          )
        })}
      </div>
    </section>
  )
}
