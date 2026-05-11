import { EquationCard } from "./shared/EquationCard"
import { FormulaText } from "./shared/FormulaText"
import { PhenomenonHero } from "./shared/PhenomenonHero"
import type { PhenomenonTabProps } from "./types"

export function RedshiftTab({ metrics }: PhenomenonTabProps) {
  const redshiftFactor = metrics.redshift
  const redshiftValue = Number.isFinite(redshiftFactor)
    ? Math.max(redshiftFactor - 1, 0)
    : Infinity
  const observedLambda = Number.isFinite(redshiftFactor)
    ? 500 * redshiftFactor
    : Infinity

  return (
    <>
      <PhenomenonHero
        eyebrow="Corrimiento gravitacional al rojo"
        title="Redshift"
        description="La luz que escapa de un campo gravitatorio intenso pierde energía: su frecuencia baja y su longitud de onda crece. En el límite del horizonte la señal se apaga para el observador lejano."
      />

      <section className="panel-section">
        <p className="panel-kicker">Física</p>

        <EquationCard
          eyebrow="Factor gravitacional"
          formula={
            <FormulaText>
              z + 1 = 1 / √(1 − r<sub>s</sub> / r)
            </FormulaText>
          }
          description="Esta es la forma estándar del corrimiento gravitacional en Schwarzschild. A medida que r se acerca a rₛ, el denominador tiende a cero y la longitud de onda observada diverge."
          variables={[
            {
              symbol: <FormulaText inline>z</FormulaText>,
              description:
                "Corrimiento gravitacional al rojo medido por el observador lejano.",
            },
            {
              symbol: <FormulaText inline>rₛ</FormulaText>,
              description: "Radio de Schwarzschild del agujero negro.",
            },
            {
              symbol: <FormulaText inline>r</FormulaText>,
              description: "Distancia radial actual de la nave cercana.",
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
              content: <>r = {metrics.r.toFixed(2)} u.n.</>,
            },
            {
              content: (
                <>
                  z = {Number.isFinite(redshiftValue) ? redshiftValue.toFixed(4) : "∞"}
                </>
              ),
              highlight: true,
            },
          ]}
        />

        <EquationCard
          eyebrow="Longitud de onda observada"
          formula={
            <FormulaText>
              λ<sub>obs</sub> = λ<sub>emit</sub>(1 + z)
            </FormulaText>
          }
          description="Si la fuente emite en verde alrededor de 500 nm, el observador lejano la recibe desplazada hacia el rojo o incluso fuera del espectro visible."
          variables={[
            {
              symbol: <FormulaText inline>λₒᵦₛ</FormulaText>,
              description: "Longitud de onda observada por la nave lejana.",
            },
            {
              symbol: <FormulaText inline>λₑₘᵢₜ</FormulaText>,
              description: "Longitud de onda emitida localmente por la fuente.",
            },
          ]}
          values={[
            {
              content: (
                <>
                  λ<sub>emit</sub> = 500 nm
                </>
              ),
            },
            {
              content: (
                <>
                  λ<sub>obs</sub> ={" "}
                  {Number.isFinite(observedLambda)
                    ? observedLambda.toFixed(0)
                    : "∞"}{" "}
                  nm
                </>
              ),
              highlight: true,
            },
          ]}
        />

        <EquationCard
          eyebrow="Factor geométrico"
          formula={
            <FormulaText>
              √(1 − r<sub>s</sub> / r) = {metrics.sqrtFactor.toFixed(4)}
            </FormulaText>
          }
          description="Este término geométrico aparece tanto en redshift como en dilatación temporal. Resume qué tan deformada está la relación entre tiempo propio y tiempo coordinado."
        />
      </section>
    </>
  )
}
