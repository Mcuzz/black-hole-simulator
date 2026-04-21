import type { SimulationState } from "../../core/state/simulationState"
import type { SceneView } from "../../render/scene/SimulationScene"
import { REGION_COPY, VIEW_COPY } from "../content/simulationCopy"
import { ClockPanel } from "../panels/ClockPanel"
import { OverlayDock } from "./components/OverlayDock"
import { StatusPanel } from "./components/StatusPanel"

interface SceneOverlayProps {
  state: SimulationState
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

export function SceneOverlay({
  state,
  view,
  onChangeView,
  showNearClock,
  showFarClock,
  showSidePanel,
  showViewInfo,
  showStatusPanel,
  showStoryPanel,
  onToggleNearClock,
  onToggleFarClock,
  onToggleSidePanel,
  onToggleViewInfo,
  onToggleStatusPanel,
  onToggleStoryPanel,
}: SceneOverlayProps) {
  const regionStory = REGION_COPY[state.effects.region]
  const viewCopy = VIEW_COPY[view]
  const clockGap = Math.max(
    0,
    state.clocks.farObserverTime - state.clocks.nearObserverTime,
  )

  return (
    <div className="scene-overlay">
      <OverlayDock
        view={view}
        onChangeView={onChangeView}
        showFarClock={showFarClock}
        showNearClock={showNearClock}
        showSidePanel={showSidePanel}
        showStatusPanel={showStatusPanel}
        showStoryPanel={showStoryPanel}
        showViewInfo={showViewInfo}
        onToggleFarClock={onToggleFarClock}
        onToggleNearClock={onToggleNearClock}
        onToggleSidePanel={onToggleSidePanel}
        onToggleStatusPanel={onToggleStatusPanel}
        onToggleStoryPanel={onToggleStoryPanel}
        onToggleViewInfo={onToggleViewInfo}
      />

      {showViewInfo && (
        <div className="view-pill">
          <span>{viewCopy.label}</span>
          <strong>{viewCopy.title}</strong>
          <small>{viewCopy.description}</small>
        </div>
      )}

      {showStatusPanel && <StatusPanel hasSidePanel={showSidePanel} state={state} />}

      {showNearClock && (view === "near" || view === "external") && (
        <ClockPanel
          className="clock-panel clock-panel--left"
          subtitle="Nave interactiva"
          timeValue={state.clocks.nearObserverTime}
          title="Reloj del observador cercano"
          tone="near"
        />
      )}

      {showFarClock && (view === "far" || view === "external") && (
        <ClockPanel
          className="clock-panel clock-panel--right"
          subtitle="Marco de referencia"
          timeValue={state.clocks.farObserverTime}
          title="Reloj del observador lejano"
          tone="far"
        />
      )}

      {showStoryPanel && (
        <div className="story-banner">
          <strong>{regionStory.title}</strong>
          <small>{regionStory.body}</small>
        </div>
      )}

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
