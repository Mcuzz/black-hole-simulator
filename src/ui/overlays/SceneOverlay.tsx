import type { SimulationState } from "../../core/state/simulationState"
import type { SceneView } from "../../render/scene/SimulationScene"
import { ClockPanel } from "../panels/ClockPanel"
import { OverlayDock } from "./components/OverlayDock"
import { StatusPanel } from "./components/StatusPanel"
import { SpaghettiModal } from "./components/SpaghettiModal"
import { useSpaghettiModal } from "../state/useSpaghettiModal"

interface SceneOverlayProps {
  state: SimulationState
  view: SceneView
  onChangeView: (view: SceneView) => void
  showNearClock: boolean
  showFarClock: boolean
  showViewInfo: boolean
  showStatusPanel: boolean
  onToggleNearClock: () => void
  onToggleFarClock: () => void
  onToggleViewInfo: () => void
  onToggleStatusPanel: () => void
}

export function SceneOverlay({
  state,
  view,
  onChangeView,
  showNearClock,
  showFarClock,
  showViewInfo,
  showStatusPanel,
  onToggleNearClock,
  onToggleFarClock,
  onToggleViewInfo,
  onToggleStatusPanel,
}: SceneOverlayProps) {
  const clockGap = Math.max(
    0,
    state.clocks.farObserverTime - state.clocks.nearObserverTime,
  )

  const spagModal = useSpaghettiModal()

  const isAtHorizon = state.effects.region === "horizon"

  return (
    <div className="scene-overlay">
      {showViewInfo ? (
        <OverlayDock
          onChangeView={onChangeView}
          onToggleVisibility={onToggleViewInfo}
          view={view}
        />
      ) : (
        <button
          className="panel-reveal panel-reveal--views"
          onClick={onToggleViewInfo}
          type="button"
        >
          Vistas
        </button>
      )}

      {showStatusPanel ? (
        <StatusPanel
          onToggleVisibility={onToggleStatusPanel}
          state={state}
        />
      ) : (
        <button
          className="panel-reveal panel-reveal--status-with-panel"
          onClick={onToggleStatusPanel}
          type="button"
        >
          Metricas
        </button>
      )}

      {showNearClock ? (
        <ClockPanel
          className="clock-panel clock-panel--bottom-left"
          onToggleVisibility={onToggleNearClock}
          subtitle="Nave interactiva"
          timeValue={state.clocks.nearObserverTime}
          title="Reloj del observador cercano"
          tone="near"
        />
      ) : (
        <button
          className="panel-reveal panel-reveal--clock-left"
          onClick={onToggleNearClock}
          type="button"
        >
          Reloj cercano
        </button>
      )}

      {showFarClock ? (
        <ClockPanel
          className="clock-panel clock-panel--bottom-right clock-panel--next-to-panel"
          onToggleVisibility={onToggleFarClock}
          subtitle="Marco de referencia"
          timeValue={state.clocks.farObserverTime}
          title="Reloj del observador lejano"
          tone="far"
        />
      ) : (
        <button
          className="panel-reveal panel-reveal--clock-right panel-reveal--clock-next-to-panel"
          onClick={onToggleFarClock}
          type="button"
        >
          Reloj lejano
        </button>
      )}

      {view === "near" && (
        <div className="cockpit-frame" aria-hidden="true">
          <div className="cockpit-top" />
          <div className="cockpit-bottom">
            <span>{`TIEMPO PROPIO ${state.clocks.nearObserverTime.toFixed(1)} s`}</span>
            <span>{`BRECHA ${clockGap.toFixed(1)} s`}</span>
          </div>

          {isAtHorizon && (
            <button
              className="spag-trigger"
              onClick={spagModal.open}
              type="button"
              aria-label="Ver perspectiva de spaghettification"
            >
              ⬤ VER DENTRO
            </button>
          )}
        </div>
      )}

      {spagModal.isOpen && (
        <SpaghettiModal
          state={state}
          onClose={spagModal.close}
        />
      )}
    </div>
  )
}