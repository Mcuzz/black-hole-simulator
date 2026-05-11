import { EquationCard } from "./shared/EquationCard"
import { FormulaText } from "./shared/FormulaText"
import { PhenomenonHero } from "./shared/PhenomenonHero"
import type { PhenomenonTabProps } from "./types"

export function AccretionTab({ metrics }: PhenomenonTabProps) {
  const rISCO = 3 * metrics.rs
  const massEstimate = rISCO / 6
  const volumeRS = (4 / 3) * Math.PI * Math.pow(metrics.rs, 3)
  const densityEstimate = massEstimate / volumeRS

  return (
    <>
      <PhenomenonHero
        eyebrow="Disco de acreción"
        title="Gas en espiral"
        description="La materia que cae hacia el agujero negro se organiza en un disco de plasma en rotación. La fricción interna lo calienta y produce el brillo intenso que usamos para leer movimiento, temperatura y borde estable."
      />

      <section className="panel-section">
        <p className="panel-kicker">Órbita estable mínima</p>

        <EquationCard
          eyebrow="ISCO"
          formula={
            <FormulaText>
              r<sub>ISCO</sub> = 3r<sub>s</sub> = 6GM / c²
            </FormulaText>
          }
          description="Para un agujero negro de Schwarzschild, este es el borde interior de las órbitas circulares estables. Dentro de él, el material ya no puede mantenerse girando sin precipitarse."
          variables={[
            {
              symbol: <FormulaText inline>rᵢₛcₒ</FormulaText>,
              description: "Radio de la órbita circular estable más interna.",
            },
            {
              symbol: <FormulaText inline>rₛ</FormulaText>,
              description: "Radio de Schwarzschild del agujero negro.",
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
              content: (
                <>
                  r<sub>ISCO</sub> = {rISCO.toFixed(2)} u.n.
                </>
              ),
              highlight: true,
            },
          ]}
        />

        <EquationCard
          eyebrow="Posición relativa de la nave"
          formula={
            <FormulaText>
              r / r<sub>ISCO</sub> = {(metrics.r / rISCO).toFixed(3)}
            </FormulaText>
          }
          description="Esta razón indica si la nave sigue fuera de la región de caída inevitable. Un valor por debajo de 1 significa que ya está dentro del límite de estabilidad orbital."
          values={[
            {
              content: <>r nave = {metrics.r.toFixed(2)} u.n.</>,
            },
            {
              content:
                metrics.r < rISCO ? "Dentro del ISCO" : "Fuera del ISCO",
              highlight: true,
            },
          ]}
        />
      </section>

      <section className="panel-section">
        <p className="panel-kicker">Masa y densidad de referencia</p>

        <EquationCard
          eyebrow="Estimación de masa"
          formula={
            <FormulaText>
              M = r<sub>ISCO</sub>c² / 6G
            </FormulaText>
          }
          description="En unidades geométricas, esta relación se simplifica a M = rISCO / 6. Sirve como una lectura pedagógica del borde interior del disco."
          variables={[
            {
              symbol: <FormulaText inline>M</FormulaText>,
              description: "Masa efectiva inferida a partir del disco visible.",
            },
          ]}
          values={[
            {
              content: <>M ≈ {massEstimate.toFixed(4)} u.n.</>,
              highlight: true,
            },
          ]}
        />

        <EquationCard
          eyebrow="Densidad media de referencia"
          formula={
            <FormulaText>
              ρ = M / ((4/3)πr<sub>s</sub>³)
            </FormulaText>
          }
          description="No representa una distribución física real dentro del horizonte, pero sí una medida intuitiva de cuánta masa está comprimida dentro del radio de Schwarzschild."
          variables={[
            {
              symbol: <FormulaText inline>ρ</FormulaText>,
              description: "Densidad media de referencia.",
            },
          ]}
          values={[
            {
              content: <>Vol = {volumeRS.toFixed(3)} u.n.³</>,
            },
            {
              content: <>ρ = {densityEstimate.toExponential(3)} u.n.</>,
              highlight: true,
            },
          ]}
        />
      </section>
    </>
  )
}
