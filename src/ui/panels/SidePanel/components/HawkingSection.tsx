import type { PhysicsMetrics } from "../hooks/usePhysicsMetrics"

type Props = {
  metrics: PhysicsMetrics
}

export function HawkingSection({ metrics }: Props) {
  const { hawkingTemperature, evaporationRate, hawkingGlowIntensity } = metrics

  // Descripción cualitativa de la intensidad del efecto
  const glowLabel =
    hawkingGlowIntensity < 0.1
      ? "Imperceptible"
      : hawkingGlowIntensity < 0.4
        ? "Débil"
        : hawkingGlowIntensity < 0.75
          ? "Moderada"
          : "Intensa"

  return (
    <section className="panel-section">
      {/* Introducción al fenómeno */}
      <div className="panel-section__header">
        <div>
          <p className="panel-kicker">Radiación cuántica</p>
          <h3>Radiación de Hawking</h3>
        </div>
        <span className={`panel-badge panel-badge--${metrics.region}`}>
          {glowLabel}
        </span>
      </div>

      <p>
        En 1974, Stephen Hawking demostró que los agujeros negros no son
        completamente negros. La mecánica cuántica permite que pares de
        partículas virtuales nazcan justo en el horizonte de eventos: una cae
        al interior y la otra escapa como radiación real. El agujero negro
        pierde energía — y con ella, masa — de forma gradual e irreversible.
      </p>

      {/* Temperatura de Hawking */}
      <div className="equation-card">
        <small>Temperatura de Hawking</small>
        <strong>T = ℏc³ / (8πGMk_B)</strong>
        <p>
          Con unidades normalizadas (G=c=ℏ=k_B=1):{" "}
          <strong>T = 1 / (4π · r_s)</strong>
        </p>
        <p>
          Valor actual:{" "}
          <strong>{hawkingTemperature.toExponential(3)} u.n.</strong>
        </p>
        <p>
          Cuanto más masivo (y más grande) es el agujero negro, más fría es su
          radiación. Un agujero negro estelar emite a temperaturas
          nanokelvines — indetectable con la tecnología actual.
        </p>
      </div>

      {/* Tasa de evaporación */}
      <div className="equation-card">
        <small>Tasa de evaporación de masa</small>
        <strong>dM/dt = −ℏc⁴ / (15360π G²M²)</strong>
        <p>
          Con unidades normalizadas:{" "}
          <strong>dM/dt = −1 / (15360π M²)</strong>
        </p>
        <p>
          Tasa relativa actual:{" "}
          <strong>{evaporationRate.toExponential(3)} u.n./s</strong>
        </p>
        <p>
          La pérdida de masa se acelera a medida que el agujero negro
          se hace más pequeño — un ciclo de retroalimentación que
          termina en una explosión de radiación.
        </p>
      </div>

      {/* Intensidad visual */}
      <div className="equation-card">
        <small>Efecto visual en escena</small>
        <strong>
          Intensidad del halo: {(hawkingGlowIntensity * 100).toFixed(1)} %
        </strong>
        <p>
          Las partículas que ves escapar del horizonte representan los pares
          virtuales de Hawking. Su brillo aumenta al acercarse la nave al
          horizonte de eventos para reforzar la intuición del fenómeno,
          aunque en la realidad el efecto sería completamente invisible a
          escala humana.
        </p>
      </div>

      <div className="telemetry-footer">
        <small>
          La radiación de Hawking nunca ha sido observada directamente. Su
          confirmación experimental sigue siendo uno de los grandes desafíos
          de la física teórica.
        </small>
      </div>
    </section>
  )
}