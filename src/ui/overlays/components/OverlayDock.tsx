import { VIEW_COPY } from "../../content/simulationCopy"
import type { SceneView } from "../../../render/scene/SimulationScene"

interface OverlayDockProps {
  view: SceneView
  onChangeView: (view: SceneView) => void
  showNearClock: boolean
  showFarClock: boolean
  showSidePanel: boolean
  showViewInfo: boolean
  showStatusPanel: boolean
  showStoryPanel: boolean
  onToggleNearClock: () => void
  onToggleFarClock: () => void
  onToggleSidePanel: () => void
  onToggleViewInfo: () => void
  onToggleStatusPanel: () => void
  onToggleStoryPanel: () => void
}

const RESOURCE_BUTTONS = [
  { key: "showSidePanel", label: "Panel", toggleKey: "onToggleSidePanel" },
  { key: "showViewInfo", label: "Vista", toggleKey: "onToggleViewInfo" },
  { key: "showStatusPanel", label: "Metricas", toggleKey: "onToggleStatusPanel" },
  { key: "showStoryPanel", label: "Historia", toggleKey: "onToggleStoryPanel" },
  { key: "showNearClock", label: "Reloj cercano", toggleKey: "onToggleNearClock" },
  { key: "showFarClock", label: "Reloj lejano", toggleKey: "onToggleFarClock" },
] as const

export function OverlayDock(props: OverlayDockProps) {
  return (
    <div className="overlay-dock">
      <section className="dock-card">
        <p className="eyebrow">Vistas</p>
        <div className="view-nav view-nav--floating">
          {(Object.keys(VIEW_COPY) as SceneView[]).map((viewKey) => (
            <button
              key={viewKey}
              className={props.view === viewKey ? "active" : ""}
              onClick={() => props.onChangeView(viewKey)}
              type="button"
            >
              {VIEW_COPY[viewKey].label}
            </button>
          ))}
        </div>
      </section>

      <section className="dock-card">
        <p className="eyebrow">Recursos</p>
        <div className="resource-grid">
          {RESOURCE_BUTTONS.map((resource) => {
            const active = props[resource.key]
            const onToggle = props[resource.toggleKey]

            return (
              <button
                key={resource.label}
                className={`resource-toggle ${active ? "active" : ""}`}
                onClick={onToggle}
                type="button"
              >
                {active ? `Ocultar ${resource.label}` : `Mostrar ${resource.label}`}
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
