import type { SimulationState } from "../../core/state/simulationState"
import type { SceneView } from "../../render/scene/SimulationScene"
import { ClockPanel } from "../panels/ClockPanel"
import { ControlPanel } from "../panels/ControlPanel/ControlPanel"
import { OverlayDock } from "./components/OverlayDock"
import { StatusPanel } from "./components/StatusPanel"

interface SceneOverlayProps {
  state: SimulationState
  view: SceneView
  onChangeView: (view: SceneView) => void
  minDistance: number
  maxDistance: number
  onTargetDistanceChange: (distance: number) => void
  showNearClock: boolean
  showFarClock: boolean
  showViewInfo: boolean
  showStatusPanel: boolean
  showControlPanel: boolean
  onToggleNearClock: () => void
  onToggleFarClock: () => void
  onToggleViewInfo: () => void
  onToggleStatusPanel: () => void
  onToggleControlPanel: () => void
}

export function SceneOverlay({
  state,
  view,
  onChangeView,
  minDistance,
  maxDistance,
  onTargetDistanceChange,
  showNearClock,
  showFarClock,
  showViewInfo,
  showStatusPanel,
  showControlPanel,
  onToggleNearClock,
  onToggleFarClock,
  onToggleViewInfo,
  onToggleStatusPanel,
  onToggleControlPanel,
}: SceneOverlayProps) {
  const clockGap = Math.max(
    0,
    state.clocks.farObserverTime - state.clocks.nearObserverTime,
  )

  return (
    <div className="scene-overlay">

      {/* ── Vista selector (top-left) ── */}
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

      {/* ── Status panel (top-right) ── */}
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
          Estado
        </button>
      )}

      {/* ── Control panel (debajo del status, mismo lado) ── */}
      {showControlPanel ? (
        <ControlPanel
          state={state}
          minDistance={minDistance}
          maxDistance={maxDistance}
          onTargetDistanceChange={onTargetDistanceChange}
          onToggleVisibility={onToggleControlPanel}
        />
      ) : (
        <button
          className="panel-reveal panel-reveal--control"
          onClick={onToggleControlPanel}
          type="button"
        >
          Control
        </button>
      )}

      {/* ── Relojes: columna izquierda inferior, apilados verticalmente ── */}
      {showFarClock ? (
        <ClockPanel
          className="clock-panel clock-panel--left-upper"
          onToggleVisibility={onToggleFarClock}
          subtitle="Marco de referencia"
          timeValue={state.clocks.farObserverTime}
          title="Reloj lejano"
          tone="far"
        />
      ) : (
        <button
          className="panel-reveal panel-reveal--clock-far-left"
          onClick={onToggleFarClock}
          type="button"
        >
          Reloj lejano
        </button>
      )}

      {showNearClock ? (
        <ClockPanel
          className="clock-panel clock-panel--left-lower"
          onToggleVisibility={onToggleNearClock}
          subtitle="Nave interactiva"
          timeValue={state.clocks.nearObserverTime}
          title="Reloj cercano"
          tone="near"
        />
      ) : (
        <button
          className="panel-reveal panel-reveal--clock-near-left"
          onClick={onToggleNearClock}
          type="button"
        >
          Reloj cercano
        </button>
      )}

      {/* ── Cockpit frame (solo vista near) ── */}
      {view === "near" && (
        <div className="cockpit-frame" aria-hidden="true">
          <div className="cockpit-top" />
          <div className="cockpit-bottom">
            <span>{`Tiempo propio ${state.clocks.nearObserverTime.toFixed(1)} s`}</span>
            <span>{`Brecha ${clockGap.toFixed(1)} s`}</span>
          </div>
        </div>
      )}
    </div>
  )
}