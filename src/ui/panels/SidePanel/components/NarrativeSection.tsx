import { VIEW_NOTES } from "../../../content/simulationCopy"
import type { SceneView } from "../../../../render/scene/SimulationScene"
import type { PhysicsMetrics } from "../hooks/usePhysicsMetrics"
import { computeNarrative } from "../logic/narrativeEngine"

type Props = {
  metrics: PhysicsMetrics
  view: SceneView
}

export function NarrativeSection({ metrics, view }: Props) {
  const narrative = computeNarrative(metrics)

  return (
    <section
      className={`panel-section panel-section--hero region-${narrative.tone}`}
    >
      <div className="panel-section__header">
        <div>
          <p className="panel-kicker">Lectura del experimento</p>
          <h2>{narrative.title}</h2>
        </div>
        <span className={`panel-badge panel-badge--${narrative.tone}`}>
          {metrics.nearDistanceRs.toFixed(2)} r_s
        </span>
      </div>

      <p>{narrative.body}</p>
      <small>{VIEW_NOTES[view]}</small>
    </section>
  )
}
