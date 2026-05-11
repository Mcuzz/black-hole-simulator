import { EquationCard } from "./shared/EquationCard"
import { FormulaText } from "./shared/FormulaText"
import { PhenomenonHero } from "./shared/PhenomenonHero"
import type { PhenomenonTabProps } from "./types"

export function PhotonSphereTab({ metrics, state }: PhenomenonTabProps) {
  const photonSphereRadius = 1.5 * metrics.rs
  const criticalImpactParameter = 1.5 * Math.sqrt(3) * metrics.rs

  return (
    <>
      <PhenomenonHero
        eyebrow="Órbita inestable de la luz"
        title="Esfera de fotones"
        description="A 1.5 radios de Schwarzschild existe una órbita circular para la luz. Es un equilibrio inestable: cualquier perturbación hace que el fotón caiga o escape."
      />

      <section className="panel-section">
        <p className="panel-kicker">Física</p>

        <EquationCard
          eyebrow="Radio fotónico"
          formula={
            <FormulaText>
              r<sub>ph</sub> = (3/2)r<sub>s</sub> = 3GM / c²
            </FormulaText>
          }
          description="Este radio determina el anillo brillante asociado a trayectorias de luz altamente curvadas. Es una referencia directa para interpretar la silueta del agujero negro."
          variables={[
            {
              symbol: <FormulaText inline>rₚₕ</FormulaText>,
              description: "Radio de la esfera de fotones.",
            },
          ]}
          values={[
            {
              content: (
                <>
                  r<sub>ph</sub> = {photonSphereRadius.toFixed(2)} u.n.
                </>
              ),
              highlight: true,
            },
          ]}
        />

        <EquationCard
          eyebrow="Separación radial"
          formula={
            <FormulaText>
              Δr = r − r<sub>ph</sub> = {(metrics.r - photonSphereRadius).toFixed(2)}
            </FormulaText>
          }
          description={
            state.effects.photonSphereRegion
              ? "La nave está dentro de la región fotónica y la escena puede producir trayectorias visuales múltiples y muy sensibles a pequeñas variaciones."
              : "La nave sigue fuera de la zona más inestable de órbitas luminosas."
          }
          values={[
            {
              content: <>r = {metrics.r.toFixed(2)} u.n.</>,
            },
            {
              content: <>Δr = {(metrics.r - photonSphereRadius).toFixed(2)} u.n.</>,
              highlight: true,
            },
          ]}
        />

        <EquationCard
          eyebrow="Impacto crítico"
          formula={
            <FormulaText>
              b<sub>c</sub> = (3√3 / 2)r<sub>s</sub>
            </FormulaText>
          }
          description="Este parámetro separa trayectorias capturadas de trayectorias que todavía pueden escapar. También fija el tamaño angular aparente de la sombra."
          variables={[
            {
              symbol: <FormulaText inline>b𝑐</FormulaText>,
              description: "Parámetro de impacto crítico.",
            },
          ]}
          values={[
            {
              content: <>b<sub>c</sub> = {criticalImpactParameter.toFixed(2)} u.n.</>,
              highlight: true,
            },
          ]}
        />
      </section>
    </>
  )
}
