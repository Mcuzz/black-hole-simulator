import type { SimulationState } from "../../../../core/state/simulationState"
import type { PhysicsMetrics } from "../hooks/usePhysicsMetrics"

export type TabId =
  | "redshift"
  | "lensing"
  | "hawking"
  | "accretion"
  | "photonsphere"

export type PhenomenonTabProps = {
  metrics: PhysicsMetrics
  state: SimulationState
}
