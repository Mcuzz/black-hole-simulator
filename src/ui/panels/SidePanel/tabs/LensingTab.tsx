import { EquationCard } from "./shared/EquationCard"
import { FormulaText } from "./shared/FormulaText"
import { PhenomenonHero } from "./shared/PhenomenonHero"
import type { PhenomenonTabProps } from "./types"

export function LensingTab({ metrics }: PhenomenonTabProps) {
  const impactParameter = Math.max(metrics.r, metrics.rs)
  const deflection = (2 * metrics.rs) / impactParameter

  return (
    <>
      <PhenomenonHero
        eyebrow="Lente gravitacional"
        title="Curvatura del espacio-tiempo"
        description="La masa dobla el espacio-tiempo y la luz sigue esas geodésicas. Un agujero negro actúa como una lente extrema: deforma el fondo estelar, multiplica imágenes y puede formar anillos completos."
      />

      <section className="panel-section">
        <p className="panel-kicker">Física</p>

        <EquationCard
          eyebrow="Ángulo de deflexión"
          formula={
            <FormulaText>
              α = 4GM / (c²b) = 2r<sub>s</sub> / b
            </FormulaText>
          }
          description="En el régimen débil, esta aproximación mide cuánto se desvía un fotón al pasar cerca del agujero negro. El término 4 de relatividad general fue una de sus primeras validaciones observacionales."
          variables={[
            {
              symbol: <FormulaText inline>α</FormulaText>,
              description: "Ángulo de deflexión del fotón.",
            },
            {
              symbol: <FormulaText inline>b</FormulaText>,
              description: "Parámetro de impacto, es decir, la distancia de paso más cercana.",
            },
          ]}
          values={[
            {
              content: <>b ≈ r = {impactParameter.toFixed(2)} u.n.</>,
            },
            {
              content: <>α ≈ {deflection.toFixed(4)} rad</>,
              highlight: true,
            },
          ]}
        />

        <EquationCard
          eyebrow="Escala visual del shader"
          formula={
            <FormulaText>
              L = min(15r<sub>s</sub> / r, 3)
            </FormulaText>
          }
          description="La escena usa una versión visualmente escalada de la curvatura para que el lensing sea legible en tiempo real. No sustituye la solución completa de geodésicas, pero respeta la tendencia física principal."
          variables={[
            {
              symbol: <FormulaText inline>L</FormulaText>,
              description: "Intensidad visual del efecto de lente en el shader.",
            },
          ]}
          values={[
            {
              content: <>L = {metrics.lensing.toFixed(3)}</>,
              highlight: true,
            },
          ]}
        />
      </section>
    </>
  )
}
