import { useState } from "react"
import type { SceneView } from "../../../render/scene/SimulationScene"
import { VIEW_COPY } from "../../content/simulationCopy"

interface OverlayDockProps {
  view: SceneView
  onChangeView: (view: SceneView) => void
  onToggleVisibility: () => void
}

export function OverlayDock({
  view,
  onChangeView,
  onToggleVisibility,
}: OverlayDockProps) {
  const [showDetails, setShowDetails] = useState(false)
  const activeView = VIEW_COPY[view]

  return (
    <section className="overlay-dock">
      <button
        aria-label="Ocultar selector de vistas"
        className="panel-hide-button"
        onClick={onToggleVisibility}
        type="button"
      >
        ×
      </button>

      <div className="view-dock__header">
        <p className="eyebrow">Vistas</p>
        <button
          aria-expanded={showDetails}
          className={`status-chip__help ${showDetails ? "active" : ""}`}
          onClick={() => setShowDetails((current) => !current)}
          type="button"
        >
          ?
        </button>
      </div>

      <div className="view-nav view-nav--floating">
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
      </div>

      {showDetails && (
        <div className="view-dock__details">
          <span>{activeView.label}</span>
          <strong>{activeView.title}</strong>
          <small>{activeView.description}</small>
        </div>
      )}
    </section>
  )
}
