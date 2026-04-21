import type { SimulationState } from "../../core/state/simulationState"
import type { SceneView } from "../../render/scene/SimulationScene"
import { REGION_LABELS, VIEW_COPY } from "../content/simulationCopy"

interface AppHeaderProps {
  state: SimulationState
  view: SceneView
  onChangeView: (view: SceneView) => void
}

export function AppHeader({ state, view, onChangeView }: AppHeaderProps) {
  const rs = state.blackHole.schwarzschildRadius || 1
  const nearDistanceRs = state.spacecraftNear.distance / rs
  const activeView = VIEW_COPY[view]
  const stats = [
    {
      label: "Region",
      value: REGION_LABELS[state.effects.region],
    },
    {
      label: "Distancia",
      value: `${nearDistanceRs.toFixed(2)} r_s`,
    },
    {
      label: "Dilatacion",
      value: state.effects.timeDilation.toFixed(3),
    },
    {
      label: "Redshift",
      value: Number.isFinite(state.effects.gravitationalRedshift)
        ? state.effects.gravitationalRedshift.toFixed(3)
        : "∞",
    },
  ]

  return (
    <header className="app-navbar">
      <div className="app-navbar__intro">
        <p className="eyebrow">{activeView.eyebrow}</p>
        <h1>Simulador relativista de agujero negro Schwarzschild</h1>
        <p className="app-navbar__summary">{activeView.description}</p>

        <div className="status-strip">
          {stats.map((stat) => (
            <article className="status-chip" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          ))}
        </div>
      </div>

      <nav className="view-nav" aria-label="Cambiar vista de simulacion">
        {(Object.keys(VIEW_COPY) as SceneView[]).map((viewKey) => (
          <button
            key={viewKey}
            className={view === viewKey ? "active" : ""}
            onClick={() => onChangeView(viewKey)}
            type="button"
          >
            {VIEW_COPY[viewKey].label}
          </button>
        ))}
      </nav>
    </header>
  )
}
