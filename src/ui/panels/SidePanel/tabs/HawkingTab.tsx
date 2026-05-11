import { EquationCard } from "./shared/EquationCard"
import { FormulaText } from "./shared/FormulaText"
import { PhenomenonHero } from "./shared/PhenomenonHero"
import type { PhenomenonTabProps } from "./types"

export function HawkingTab({ metrics }: PhenomenonTabProps) {
  return (
    <>
      <PhenomenonHero
        eyebrow="Radiación cuántica"
        title="Radiación de Hawking"
        description="En un tratamiento cuántico del horizonte, el agujero negro emite radiación térmica. Cuanto más pequeño es, más caliente se vuelve y más rápido pierde masa."
      />

      <section className="panel-section">
        <p className="panel-kicker">Física</p>

        <EquationCard
          eyebrow="Temperatura de Hawking"
          formula={
            <FormulaText>
              T<sub>H</sub> = ℏc³ / (8πGMk<sub>B</sub>)
            </FormulaText>
          }
          description="En unidades geométricas con G = c = ℏ = kB = 1, la expresión se reduce a T = 1 / (4πrₛ). Para agujeros negros astrofísicos reales la temperatura es diminuta."
          variables={[
            {
              symbol: <FormulaText inline>Tₕ</FormulaText>,
              description: "Temperatura efectiva de la radiación térmica.",
            },
            {
              symbol: <FormulaText inline>kᵦ</FormulaText>,
              description: "Constante de Boltzmann.",
            },
          ]}
          values={[
            {
              content: (
                <>
                  r<sub>s</sub> = {metrics.rs.toFixed(2)} u.n.
                </>
              ),
            },
            {
              content: <>T = {metrics.hawkingTemperature.toExponential(3)} u.n.</>,
              highlight: true,
            },
          ]}
        />

        <EquationCard
          eyebrow="Pérdida de masa"
          formula={
            <FormulaText>
              dM/dt = −ℏc⁴ / (15360πG²M²)
            </FormulaText>
          }
          description="La evaporación acelera cuando la masa disminuye. En el simulador mostramos una tasa visual escalada para que el cambio sea interpretable en la interfaz."
          variables={[
            {
              symbol: <FormulaText inline>dM/dt</FormulaText>,
              description: "Tasa de pérdida de masa del agujero negro.",
            },
            {
              symbol: <FormulaText inline>M</FormulaText>,
              description: "Masa instantánea del agujero negro.",
            },
          ]}
          values={[
            {
              content: <>M = {metrics.blackHoleMass.toFixed(3)} u.n.</>,
            },
            {
              content: (
                <>
                  dM/dt = {metrics.evaporationRate.toExponential(3)} u.n./s
                </>
              ),
              highlight: true,
            },
          ]}
        />

        <EquationCard
          eyebrow="Intensidad visual"
          formula={
            <FormulaText>
              I<sub>halo</sub> = {(metrics.hawkingGlowIntensity * 100).toFixed(1)}%
            </FormulaText>
          }
          description="Este valor gobierna el brillo del halo de partículas que representa la radiación de Hawking en escena. No es visible a escala humana real, pero sí útil como guía pedagógica."
        />
      </section>
    </>
  )
}
