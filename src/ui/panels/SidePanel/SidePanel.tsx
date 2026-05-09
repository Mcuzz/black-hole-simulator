import { useState } from "react"
import type { SimulationState } from "../../../core/state/simulationState"
import type { SceneView } from "../../../render/scene/SimulationScene"
import { usePhysicsMetrics } from "./hooks/usePhysicsMetrics"
import { VIEW_NOTES } from "../../content/simulationCopy"

export type SidePanelProps = {
  state: SimulationState
  view: SceneView
}

type TabId = "redshift" | "lensing" | "hawking" | "accretion" | "photonsphere"

const TABS: { id: TabId; label: string }[] = [
  { id: "redshift",     label: "Redshift" },
  { id: "lensing",      label: "Lente" },
  { id: "hawking",      label: "Hawking" },
  { id: "accretion",    label: "Disco" },
  { id: "photonsphere", label: "Fotones" },
]

export function SidePanel({ state, view }: SidePanelProps) {
  const m = usePhysicsMetrics(state)
  const [activeTab, setActiveTab] = useState<TabId>("redshift")
  const region = state.effects.region

  return (
    <aside className={`side-panel region-${region}`}>
      <nav className="phenomenon-tabs" aria-label="Fenómenos físicos">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`phenomenon-tab ${activeTab === t.id ? `active active--${region}` : ""}`}
            onClick={() => setActiveTab(t.id)}
            aria-current={activeTab === t.id ? "page" : undefined}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <p className="panel-view-note">{VIEW_NOTES[view]}</p>

      <div className="phenomenon-content">

        {activeTab === "redshift" && (
          <>
            <section className="panel-section panel-section--hero">
              <p className="panel-kicker">Corrimiento gravitacional al rojo</p>
              <h2>Redshift</h2>
              <p>La luz que escapa de un campo gravitatorio intenso pierde energía: su frecuencia baja y su color se desplaza hacia el rojo. En el límite del horizonte de eventos, la pérdida es infinita — la señal desaparece por completo.</p>
            </section>
            <section className="panel-section">
              <p className="panel-kicker">Física</p>
              <div className="equation-card">
                <strong>z + 1 = 1 / √(1 − r_s / r)</strong>
                <small>Factor por el que se estira la longitud de onda. Con r → r_s el denominador tiende a cero y el redshift diverge.</small>
                <div className="equation-values">
                  <span>r_s = {m.rs.toFixed(2)}</span>
                  <span>r = {m.r.toFixed(2)}</span>
                  <span className="equation-result">z + 1 = {Number.isFinite(m.redshift) ? m.redshift.toFixed(4) : "∞"}</span>
                </div>
              </div>
              <div className="equation-card">
                <strong>λ_obs = λ_emit × (z + 1)</strong>
                <small>Un fotón emitido a 500 nm (verde) llega a {Number.isFinite(m.redshift) ? (500 * m.redshift).toFixed(0) : "∞"} nm. Por encima de ~700 nm sale del espectro visible hacia el infrarrojo.</small>
              </div>
              <div className="equation-card">
                <strong>√(1 − r_s / r) = {m.sqrtFactor.toFixed(4)}</strong>
                <small>Este mismo factor aparece en la dilatación temporal — marca qué fracción del tiempo propio del observador cercano corresponde a una unidad del lejano.</small>
              </div>
            </section>
          </>
        )}

        {activeTab === "lensing" && (
          <>
            <section className="panel-section panel-section--hero">
              <p className="panel-kicker">Lente gravitacional</p>
              <h2>Curvatura del espacio-tiempo</h2>
              <p>La masa dobla el espacio-tiempo y la luz sigue esas curvas. Un agujero negro actúa como una lente cósmica que distorsiona el fondo estelar y puede formar anillos completos — los anillos de Einstein — con alineación perfecta.</p>
            </section>
            <section className="panel-section">
              <p className="panel-kicker">Física</p>
              <div className="equation-card">
                <strong>α = 4GM / (c² b) = 2r_s / b</strong>
                <small>Ángulo de deflexión de un fotón que pasa a distancia mínima b. El factor 4 (vs. 2 newtoniano) fue la primera confirmación experimental de la Relatividad General en 1919.</small>
                <div className="equation-values">
                  <span className="equation-result">α ≈ {((2 * m.rs) / Math.max(m.r, m.rs)).toFixed(4)} rad</span>
                </div>
              </div>
              <div className="equation-card">
                <strong>L = min(r_s / r × 15,  3)</strong>
                <small>Intensidad de distorsión del shader del cielo estrellado. Crece conforme la nave se acerca, curvando el fondo de forma progresiva.</small>
                <div className="equation-values">
                  <span className="equation-result">L = {m.lensing.toFixed(3)}</span>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === "hawking" && (
          <>
            <section className="panel-section panel-section--hero">
              <p className="panel-kicker">Radiación cuántica</p>
              <h2>Radiación de Hawking</h2>
              <p>En 1974 Hawking demostró que los agujeros negros emiten radiación térmica. Pares de partículas virtuales nacen en el horizonte: una cae adentro y la otra escapa. El agujero negro pierde masa lentamente — cuanto más pequeño, más caliente y más rápido se evapora.</p>
            </section>
            <section className="panel-section">
              <p className="panel-kicker">Física</p>
              <div className="equation-card">
                <strong>T = ℏc³ / (8πGMk_B)</strong>
                <small>Temperatura de la radiación emitida. Inversamente proporcional a la masa: un agujero negro estelar emite a nanokelvines — indetectable hoy. Con G=c=ℏ=k_B=1: T = 1/(4π·r_s).</small>
                <div className="equation-values">
                  <span className="equation-result">T = {m.hawkingTemperature.toExponential(3)} u.n.</span>
                </div>
              </div>
              <div className="equation-card">
                <strong>dM/dt = −ℏc⁴ / (15360π G²M²)</strong>
                <small>Tasa de pérdida de masa. Crece con M⁻² — al reducirse la masa la evaporación se acelera en un ciclo que termina en una explosión de radiación gamma.</small>
                <div className="equation-values">
                  <span className="equation-result">dM/dt = {m.evaporationRate.toExponential(3)} u.n./s</span>
                </div>
              </div>
              <div className="equation-card">
                <strong>Halo visual: {(m.hawkingGlowIntensity * 100).toFixed(1)} %</strong>
                <small>Las partículas en escena representan los pares de Hawking. Su brillo aumenta al acercarse al horizonte. A escala real el efecto es completamente invisible.</small>
              </div>
            </section>
          </>
        )}

        {activeTab === "accretion" && (
          <>
            <section className="panel-section panel-section--hero">
              <p className="panel-kicker">Disco de acreción</p>
              <h2>Gas en espiral</h2>
              <p>La materia que cae hacia el agujero negro forma un disco de plasma en rotación. La fricción interna lo calienta a millones de kelvin — haciéndolo brillar en rayos X. La parte más interna orbita a una fracción significativa de la velocidad de la luz.</p>
            </section>
            <section className="panel-section">
              <p className="panel-kicker">Física</p>
              <div className="equation-card">
                <strong>r_ISCO = 3r_s = 6GM / c²</strong>
                <small>Radio de la órbita circular estable más interna. Por dentro de este radio ninguna órbita es estable — la materia cae inevitablemente. El borde interior del disco coincide con r_ISCO.</small>
                <div className="equation-values">
                  <span>r_s = {m.rs.toFixed(2)}</span>
                  <span className="equation-result">r_ISCO = {(3 * m.rs).toFixed(2)} u.n.</span>
                </div>
              </div>
              <div className="equation-card">
                <strong>Nave / r_ISCO = {(m.r / (3 * m.rs)).toFixed(3)}</strong>
                <small>Relación entre la posición de la nave y el borde estable del disco. Menor que 1 indica que la nave está en la región de caída inevitable.</small>
              </div>
            </section>
          </>
        )}

        {activeTab === "photonsphere" && (
          <>
            <section className="panel-section panel-section--hero">
              <p className="panel-kicker">Órbita inestable de la luz</p>
              <h2>Esfera de fotones</h2>
              <p>A 1.5 r_s existe una órbita donde la luz puede girar indefinidamente. Es inestable: cualquier perturbación hace que el fotón caiga o escape. Es la responsable del anillo brillante visible en imágenes del Event Horizon Telescope.</p>
            </section>
            <section className="panel-section">
              <p className="panel-kicker">Física</p>
              <div className="equation-card">
                <strong>r_ph = (3/2) r_s = 3GM / c²</strong>
                <small>Radio exacto para un agujero negro de Schwarzschild. En agujeros de Kerr (con spin) este radio se divide en dos — uno para órbitas pro- y otro para retrogradas.</small>
                <div className="equation-values">
                  <span className="equation-result">r_ph = {(1.5 * m.rs).toFixed(2)} u.n.</span>
                </div>
              </div>
              <div className="equation-card">
                <strong>Δr = r − r_ph = {(m.r - 1.5 * m.rs).toFixed(2)} u.n.</strong>
                <small>{state.effects.photonSphereRegion ? "⚠ La nave está dentro de la esfera de fotones — las trayectorias visuales se vuelven caóticas." : "La nave está fuera de la esfera de fotones."}</small>
              </div>
              <div className="equation-card">
                <strong>b_c = 3√3 GM/c²</strong>
                <small>Parámetro de impacto crítico. Fotones con b menor que b_c caen; con b mayor escapan. Determina el tamaño de la "sombra" del agujero negro — el disco oscuro central de la imagen del EHT.</small>
                <div className="equation-values">
                  <span className="equation-result">b_c = {(3 * Math.sqrt(3) * m.rs * 0.5).toFixed(2)} u.n.</span>
                </div>
              </div>
            </section>
          </>
        )}

      </div>
    </aside>
  )
}