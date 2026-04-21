import type { SimulationState } from "../../../core/state/simulationState"
import type { SceneView } from "../../../render/scene/SimulationScene"
import { ControlSection } from "./components/ControlSection"
import { EquationsSection } from "./components/EquationsSection"
import { NarrativeSection } from "./components/NarrativeSection"
import { TelemetrySection } from "./components/TelemetrySection"
import { usePhysicsMetrics } from "./hooks/usePhysicsMetrics"

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

  return (
    <aside className={`side-panel region-${state.effects.region}`}>
      <NarrativeSection metrics={metrics} view={view} />

      <ControlSection
        minDistance={minDistance}
        maxDistance={maxDistance}
        currentDistance={state.spacecraftNear.distance}
        targetDistance={state.targetDistance}
        schwarzschildRadius={metrics.rs}
        nearDistanceRs={metrics.nearDistanceRs}
        targetDistanceRs={metrics.targetDistanceRs}
        onTargetDistanceChange={onTargetDistanceChange}
      />

      <TelemetrySection metrics={metrics} />

      <EquationsSection metrics={metrics} region={state.effects.region} />
    </aside>
  )
}
