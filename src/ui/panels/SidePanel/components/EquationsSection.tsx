import { REGION_LABELS } from "../../../content/simulationCopy"
import type { PhysicsMetrics } from "../hooks/usePhysicsMetrics"

type Region = "safe" | "strong" | "photon-sphere" | "horizon"
type ActiveEquation = "timeDilation" | "redshift"

type Props = {
  metrics: PhysicsMetrics
  region: Region
}

function resolveActiveEquation(region: Region): ActiveEquation {
  switch (region) {
    case "photon-sphere":
      return "redshift"
    case "safe":
    case "strong":
    case "horizon":
    default:
      return "timeDilation"
  }
}

export function EquationsSection({ metrics, region }: Props) {
  const active = resolveActiveEquation(region)
  const distanceTerm = `${metrics.rs.toFixed(2)} / ${metrics.r.toFixed(2)}`

  return (
    <section className="panel-section">
      <div className="panel-section__header">
        <div>
          <p className="panel-kicker">Marco teorico</p>
          <h3>Ecuacion activa</h3>
        </div>
        <span className="panel-badge">{REGION_LABELS[region]}</span>
      </div>

      {active === "timeDilation" && (
        <>
          <div className="equation-card">
            <small>Dilatacion temporal gravitacional</small>
            <strong>{`t_local = t_far * sqrt(1 - ${distanceTerm})`}</strong>
            <p>Factor local actual: {metrics.timeDilation.toFixed(4)}</p>
          </div>

          <div className="equation-card">
            <small>Lectura cientifica</small>
            <strong>{`sqrt(1 - ${distanceTerm}) = ${metrics.sqrtFactor.toFixed(4)}`}</strong>
            <p>
              Cuanto mas cerca esta la nave del horizonte, menor es el tiempo
              propio acumulado respecto al observador lejano.
            </p>
          </div>

          {region === "horizon" && (
            <small>
              Cerca del horizonte, el observador externo percibe una congelacion
              progresiva del reloj cercano.
            </small>
          )}
        </>
      )}

      {active === "redshift" && (
        <>
          <div className="equation-card">
            <small>Corrimiento gravitacional al rojo</small>
            <strong>{`lambda_obs = lambda_emit / ${metrics.sqrtFactor.toFixed(4)}`}</strong>
            <p>Factor de redshift actual: {metrics.redshift.toFixed(4)}</p>
          </div>

          <div className="equation-card">
            <small>Lectura cientifica</small>
            <strong>{`z = ${metrics.redshift.toFixed(4)}`}</strong>
            <p>
              La frecuencia de la luz disminuye porque escapar del pozo
              gravitatorio requiere energia.
            </p>
          </div>
        </>
      )}
    </section>
  )
}
