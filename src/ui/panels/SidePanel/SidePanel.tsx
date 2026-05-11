import { useState } from "react"
import type { SimulationState } from "../../../core/state/simulationState"
import type { SceneView } from "../../../render/scene/SimulationScene"
import { VIEW_NOTES } from "../../content/simulationCopy"
import { usePhysicsMetrics } from "./hooks/usePhysicsMetrics"
import { TABS, TAB_COMPONENTS } from "./tabs/tabRegistry"
import { TrajectoryControl } from "./tabs/shared/TrajectoryControl"
import type { TabId } from "./tabs/types"

export type SidePanelProps = {
  state: SimulationState
  view: SceneView
  minDistance: number
  maxDistance: number
  onTargetDistanceChange: (distance: number) => void
}

export function SidePanel({
  state,
  view,
  minDistance,
  maxDistance,
  onTargetDistanceChange,
}: SidePanelProps) {
  const metrics = usePhysicsMetrics(state)
  const [activeTab, setActiveTab] = useState<TabId>("redshift")
  const ActiveTab = TAB_COMPONENTS[activeTab]

  return (
    <aside className={`side-panel region-${state.effects.region}`}>
      <TrajectoryControl
        currentDistanceRs={metrics.nearDistanceRs}
        minDistance={minDistance}
        maxDistance={maxDistance}
        rs={metrics.rs}
        targetDistance={state.targetDistance}
        onTargetDistanceChange={onTargetDistanceChange}
      />

      <nav className="phenomenon-tabs" aria-label="Fenómenos físicos">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`phenomenon-tab ${
              activeTab === tab.id ? `active active--${state.effects.region}` : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
            aria-current={activeTab === tab.id ? "page" : undefined}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <p className="panel-view-note">{VIEW_NOTES[view]}</p>

      <div className="phenomenon-content">
        <ActiveTab metrics={metrics} state={state} />
      </div>
    </aside>
  )
}
