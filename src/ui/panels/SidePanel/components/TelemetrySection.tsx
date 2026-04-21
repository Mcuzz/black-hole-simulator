import { REGION_LABELS } from "../../../content/simulationCopy"
import type { PhysicsMetrics } from "../hooks/usePhysicsMetrics"

function formatTime(seconds: number) {
  const total = Math.max(0, Math.floor(seconds * 10))
  const min = Math.floor(total / 60)
  const sec = total % 60

  return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
}

type Props = {
  metrics: PhysicsMetrics
}

const REGION_DESCRIPTIONS = {
  safe: {
    dilation: "El tiempo fluye casi igual que lejos del agujero negro.",
    redshift: "La luz apenas pierde energia; el efecto es casi imperceptible.",
    lensing: "La curvatura del espacio-tiempo es debil y el fondo se mantiene estable.",
    global: "Zona segura: el sistema aun se comporta casi como espacio plano.",
  },
  strong: {
    dilation: "El tiempo comienza a desacelerarse de forma claramente medible.",
    redshift: "La luz empieza a enrojecerse al escapar de la gravedad.",
    lensing: "La distorsion del fondo estelar ya es evidente.",
    global: "Gravedad fuerte: la relatividad ya domina la lectura del experimento.",
  },
  "photon-sphere": {
    dilation: "El tiempo esta fuertemente dilatado respecto al exterior.",
    redshift: "La luz pierde gran parte de su energia al escapar.",
    lensing: "La luz puede orbitar temporalmente el agujero negro.",
    global: "Esfera de fotones: la geometria visual entra en su zona mas extrema.",
  },
  horizon: {
    dilation: "Para un observador lejano, el tiempo aqui casi se detiene.",
    redshift: "La luz se estira al extremo y su senal se apaga.",
    lensing: "La curvatura es tan fuerte que nada escapa visualmente intacto.",
    global: "Horizonte de eventos: limite del experimento observable desde fuera.",
  },
} as const

export function TelemetrySection({ metrics }: Props) {
  const gap = metrics.clockGap
  const region = metrics.region ?? "safe"
  const desc = REGION_DESCRIPTIONS[region]
  const items = [
    {
      label: "Dilatacion temporal",
      value: metrics.timeDilation.toFixed(3),
      description: desc.dilation,
    },
    {
      label: "Corrimiento al rojo",
      value: metrics.redshift.toFixed(3),
      description: desc.redshift,
    },
    {
      label: "Lente gravitacional",
      value: metrics.lensing.toFixed(2),
      description: desc.lensing,
    },
    {
      label: "Brecha temporal",
      value: formatTime(gap),
      description: "Diferencia acumulada entre el reloj lejano y el cercano.",
    },
  ]

  return (
    <section className="panel-section">
      <div className="panel-section__header">
        <div>
          <p className="panel-kicker">Variables en vivo</p>
          <h3>Telemetria relativista</h3>
        </div>
        <span className={`panel-badge panel-badge--${region}`}>
          {REGION_LABELS[region]}
        </span>
      </div>

      <p className="region-description">{desc.global}</p>

      <div className="metric-grid">
        {items.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <small>{item.description}</small>
          </article>
        ))}
      </div>

      <div className="telemetry-footer">
        <p>
          Reloj cercano <strong>{formatTime(metrics.clockNear)}</strong>
        </p>
        <p>
          Reloj lejano <strong>{formatTime(metrics.clockFar)}</strong>
        </p>
        <small>
          El observador cercano avanza a una tasa relativa de {metrics.nearRate.toFixed(3)}
          respecto al marco distante.
        </small>
      </div>
    </section>
  )
}
