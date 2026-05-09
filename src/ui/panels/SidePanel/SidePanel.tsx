import { useState, type ChangeEvent } from "react"
import type { SimulationState } from "../../../core/state/simulationState"
import type { SceneView } from "../../../render/scene/SimulationScene"
import { usePhysicsMetrics } from "./hooks/usePhysicsMetrics"
import { VIEW_NOTES } from "../../content/simulationCopy"

export type SidePanelProps = {
  state: SimulationState
  view: SceneView
  minDistance: number
  maxDistance: number
  onTargetDistanceChange: (distance: number) => void
}

type TabId = "redshift" | "lensing" | "hawking" | "accretion" | "photonsphere"

const TABS: { id: TabId; label: string }[] = [
  { id: "redshift",     label: "Redshift"  },
  { id: "lensing",      label: "Lente"     },
  { id: "hawking",      label: "Hawking"   },
  { id: "accretion",    label: "Disco"     },
  { id: "photonsphere", label: "Fotones"   },
]

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v))

export function SidePanel({
  state,
  view,
  minDistance,
  maxDistance,
  onTargetDistanceChange,
}: SidePanelProps) {
  const m = usePhysicsMetrics(state)
  const [activeTab, setActiveTab] = useState<TabId>("redshift")
  const region = state.effects.region
  const rs = m.rs
  const step = Math.max(rs * 0.05, 0.001)

  // Física del disco
  const rISCO = 3 * rs
  const massEstimate = rISCO / 6
  const volumeRS = (4 / 3) * Math.PI * Math.pow(rs, 3)
  const densityEstimate = massEstimate / volumeRS

  function handleSlider(e: ChangeEvent<HTMLInputElement>) {
    const v = Number(e.target.value)
    if (Number.isFinite(v)) onTargetDistanceChange(v)
  }

  function moveDelta(delta: number) {
    const next = clamp(state.targetDistance + delta, minDistance, maxDistance)
    if (Number.isFinite(next)) onTargetDistanceChange(next)
  }

  return (
    <aside className={`side-panel region-${region}`}>

      {/* ══ CONTROL DE TRAYECTORIA ══ */}
      <section className="panel-section panel-section--control">
        <div className="control-header">
          <p className="panel-kicker">Trayectoria de la nave cercana</p>
          <span className="control-distance-badge">
            {m.nearDistanceRs.toFixed(2)} r_s
          </span>
        </div>

        <input
          type="range"
          className="distance-slider"
          min={minDistance}
          max={maxDistance}
          step={step}
          value={state.targetDistance}
          onChange={handleSlider}
          aria-label="Distancia objetivo de la nave cercana"
        />

        <p className="control-unit-note">
          Distancia en radios de Schwarzschild (r_s = 2GM/c²).
          Mínimo 1.02 r_s — límite seguro sobre el horizonte de eventos.
        </p>

        <div className="distance-actions">
          <button type="button" onClick={() => moveDelta(-rs * 0.5)}>
            −0.5 r_s
          </button>
          <button type="button" onClick={() => moveDelta(rs * 0.5)}>
            +0.5 r_s
          </button>
        </div>
      </section>

      {/* ══ TABS ══ */}
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

      {/* ══ CONTENIDO ══ */}
      <div className="phenomenon-content">

        {/* ── REDSHIFT ── */}
        {activeTab === "redshift" && (
          <>
            <section className="panel-section panel-section--hero">
              <p className="panel-kicker">Corrimiento gravitacional al rojo</p>
              <h2>Redshift</h2>
              <p>
                La luz que escapa de un campo gravitatorio intenso pierde
                energía: su frecuencia baja y su color se desplaza hacia el
                rojo. En el límite del horizonte de eventos la pérdida es
                infinita — la señal desaparece por completo.
              </p>
            </section>

            <section className="panel-section">
              <p className="panel-kicker">Física</p>

              <div className="equation-card">
                <strong>z + 1 = 1 / √(1 − r_s / r)</strong>
                <p className="eq-description">
                  Factor de corrimiento al rojo gravitacional. Describe cuánto
                  se estira la longitud de onda de un fotón al escapar del pozo
                  gravitatorio. Cuando r se acerca a r_s el denominador tiende
                  a cero y el redshift diverge — la luz necesitaría energía
                  infinita para escapar.
                </p>
                <div className="eq-vars">
                  <div className="eq-var">
                    <span className="eq-var__symbol">z</span>
                    <span className="eq-var__def">Redshift gravitacional — qué tanto se estira la onda (adimensional)</span>
                  </div>
                  <div className="eq-var">
                    <span className="eq-var__symbol">r_s</span>
                    <span className="eq-var__def">Radio de Schwarzschild — tamaño del horizonte de eventos</span>
                  </div>
                  <div className="eq-var">
                    <span className="eq-var__symbol">r</span>
                    <span className="eq-var__def">Distancia radial de la nave al centro del agujero negro</span>
                  </div>
                </div>
                <div className="equation-values">
                  <span>r_s = {rs.toFixed(2)} u.n.</span>
                  <span>r = {m.r.toFixed(2)} u.n.</span>
                  <span className="equation-result">
                    z + 1 = {Number.isFinite(m.redshift) ? m.redshift.toFixed(4) : "∞"}
                  </span>
                </div>
              </div>

              <div className="equation-card">
                <strong>λ_obs = λ_emit × (z + 1)</strong>
                <p className="eq-description">
                  Longitud de onda que recibe el observador lejano. Un fotón
                  emitido como luz verde a 500 nm llega desplazado — por encima
                  de ~700 nm sale del espectro visible al infrarrojo.
                </p>
                <div className="eq-vars">
                  <div className="eq-var">
                    <span className="eq-var__symbol">λ_obs</span>
                    <span className="eq-var__def">Longitud de onda recibida por el observador lejano (nm)</span>
                  </div>
                  <div className="eq-var">
                    <span className="eq-var__symbol">λ_emit</span>
                    <span className="eq-var__def">Longitud de onda emitida por la fuente cercana (nm)</span>
                  </div>
                </div>
                <div className="equation-values">
                  <span>λ_emit = 500 nm</span>
                  <span className="equation-result">
                    λ_obs = {Number.isFinite(m.redshift) ? (500 * m.redshift).toFixed(0) : "∞"} nm
                  </span>
                </div>
              </div>

              <div className="equation-card">
                <strong>√(1 − r_s / r) = {m.sqrtFactor.toFixed(4)}</strong>
                <p className="eq-description">
                  Factor geométrico de Schwarzschild. Aparece tanto en el
                  redshift como en la dilatación temporal — es el corazón
                  matemático de ambos efectos y marca qué fracción del tiempo
                  propio del observador cercano equivale a una unidad del lejano.
                </p>
              </div>
            </section>
          </>
        )}

        {/* ── LENSING ── */}
        {activeTab === "lensing" && (
          <>
            <section className="panel-section panel-section--hero">
              <p className="panel-kicker">Lente gravitacional</p>
              <h2>Curvatura del espacio-tiempo</h2>
              <p>
                La masa dobla el espacio-tiempo y la luz sigue esas curvas. Un
                agujero negro actúa como una lente cósmica: distorsiona el fondo
                estelar, amplifica fuentes lejanas y — con alineación perfecta —
                forma anillos completos llamados anillos de Einstein.
              </p>
            </section>

            <section className="panel-section">
              <p className="panel-kicker">Física</p>

              <div className="equation-card">
                <strong>α = 4GM / (c² · b) = 2r_s / b</strong>
                <p className="eq-description">
                  Ángulo por el que la gravedad curva la trayectoria de un
                  fotón. El factor 4 (frente al 2 de Newton) fue la primera
                  confirmación de la Relatividad General, medida en el eclipse
                  solar de 1919 por Eddington.
                </p>
                <div className="eq-vars">
                  <div className="eq-var">
                    <span className="eq-var__symbol">α</span>
                    <span className="eq-var__def">Ángulo de deflexión del fotón (radianes)</span>
                  </div>
                  <div className="eq-var">
                    <span className="eq-var__symbol">G</span>
                    <span className="eq-var__def">Constante de gravitación universal (= 1 en u.n.)</span>
                  </div>
                  <div className="eq-var">
                    <span className="eq-var__symbol">M</span>
                    <span className="eq-var__def">Masa del agujero negro</span>
                  </div>
                  <div className="eq-var">
                    <span className="eq-var__symbol">c</span>
                    <span className="eq-var__def">Velocidad de la luz (= 1 en u.n.)</span>
                  </div>
                  <div className="eq-var">
                    <span className="eq-var__symbol">b</span>
                    <span className="eq-var__def">Parámetro de impacto — distancia mínima de paso del fotón</span>
                  </div>
                </div>
                <div className="equation-values">
                  <span>b ≈ r = {m.r.toFixed(2)} u.n.</span>
                  <span className="equation-result">
                    α ≈ {((2 * rs) / Math.max(m.r, rs)).toFixed(4)} rad
                  </span>
                </div>
              </div>

              <div className="equation-card">
                <strong>L = min(r_s / r × 15,  3)</strong>
                <p className="eq-description">
                  Intensidad de distorsión visual del shader del cielo
                  estrellado. Escala la curvatura geométrica para que el
                  efecto sea perceptible en tiempo real — no es una ecuación
                  física directa sino una aproximación visual controlada.
                </p>
                <div className="eq-vars">
                  <div className="eq-var">
                    <span className="eq-var__symbol">L</span>
                    <span className="eq-var__def">Intensidad de lensing en shader (adimensional, rango 0–3)</span>
                  </div>
                </div>
                <div className="equation-values">
                  <span className="equation-result">L = {m.lensing.toFixed(3)}</span>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── HAWKING ── */}
        {activeTab === "hawking" && (
          <>
            <section className="panel-section panel-section--hero">
              <p className="panel-kicker">Radiación cuántica</p>
              <h2>Radiación de Hawking</h2>
              <p>
                En 1974 Hawking demostró que los agujeros negros emiten
                radiación térmica. Pares de partículas virtuales nacen en el
                horizonte: una cae adentro y la otra escapa. El agujero negro
                pierde masa lentamente — cuanto más pequeño, más caliente y
                más rápido se evapora.
              </p>
            </section>

            <section className="panel-section">
              <p className="panel-kicker">Física</p>

              <div className="equation-card">
                <strong>T = ℏc³ / (8πGMk_B)</strong>
                <p className="eq-description">
                  Temperatura de la radiación emitida. Inversamente
                  proporcional a la masa: un agujero negro estelar radia a
                  nanokelvines — indetectable hoy. Con G = c = ℏ = k_B = 1:
                  T = 1 / (4π · r_s).
                </p>
                <div className="eq-vars">
                  <div className="eq-var">
                    <span className="eq-var__symbol">T</span>
                    <span className="eq-var__def">Temperatura de Hawking (en u.n.; en realidad en kelvin)</span>
                  </div>
                  <div className="eq-var">
                    <span className="eq-var__symbol">ℏ</span>
                    <span className="eq-var__def">Constante de Planck reducida (= 1 en u.n.)</span>
                  </div>
                  <div className="eq-var">
                    <span className="eq-var__symbol">k_B</span>
                    <span className="eq-var__def">Constante de Boltzmann — relaciona temperatura con energía (= 1 en u.n.)</span>
                  </div>
                  <div className="eq-var">
                    <span className="eq-var__symbol">M</span>
                    <span className="eq-var__def">Masa del agujero negro</span>
                  </div>
                </div>
                <div className="equation-values">
                  <span>r_s = {rs.toFixed(2)} u.n.</span>
                  <span className="equation-result">
                    T = {m.hawkingTemperature.toExponential(3)} u.n.
                  </span>
                </div>
              </div>

              <div className="equation-card">
                <strong>dM/dt = −ℏc⁴ / (15360π G²M²)</strong>
                <p className="eq-description">
                  Tasa de pérdida de masa por radiación. Crece con M⁻² —
                  al reducirse la masa, la evaporación se acelera en un
                  ciclo que termina en una explosión de rayos gamma.
                  Con G = c = ℏ = 1: dM/dt = −1 / (15360π M²).
                </p>
                <div className="eq-vars">
                  <div className="eq-var">
                    <span className="eq-var__symbol">dM/dt</span>
                    <span className="eq-var__def">Tasa de pérdida de masa por unidad de tiempo (u.n./s)</span>
                  </div>
                  <div className="eq-var">
                    <span className="eq-var__symbol">M</span>
                    <span className="eq-var__def">Masa actual del agujero negro</span>
                  </div>
                </div>
                <div className="equation-values">
                  <span className="equation-result">
                    dM/dt = {m.evaporationRate.toExponential(3)} u.n./s
                  </span>
                </div>
              </div>

              <div className="equation-card">
                <strong>Halo visual: {(m.hawkingGlowIntensity * 100).toFixed(1)} %</strong>
                <p className="eq-description">
                  Intensidad de las partículas en escena que representan
                  los pares de Hawking. Su brillo crece al acercarse al
                  horizonte. A escala real la radiación es de longitud de
                  onda radio — completamente invisible al ojo humano.
                </p>
              </div>
            </section>
          </>
        )}

        {/* ── DISCO ── */}
        {activeTab === "accretion" && (
          <>
            <section className="panel-section panel-section--hero">
              <p className="panel-kicker">Disco de acreción</p>
              <h2>Gas en espiral</h2>
              <p>
                La materia que cae hacia el agujero negro forma un disco de
                plasma en rotación. La fricción interna lo calienta a millones
                de kelvin — haciéndolo brillar en rayos X. La parte más interna
                orbita a una fracción significativa de la velocidad de la luz.
              </p>
            </section>

            <section className="panel-section">
              <p className="panel-kicker">Órbita estable mínima</p>

              <div className="equation-card">
                <strong>r_ISCO = 3r_s = 6GM / c²</strong>
                <p className="eq-description">
                  Radio de la Órbita Circular Estable Más Interna (ISCO).
                  Por dentro de este radio ninguna órbita es estable — la
                  materia cae inevitablemente. El borde interior visible del
                  disco coincide con r_ISCO.
                </p>
                <div className="eq-vars">
                  <div className="eq-var">
                    <span className="eq-var__symbol">r_ISCO</span>
                    <span className="eq-var__def">Radio mínimo de órbita estable — borde interior del disco</span>
                  </div>
                  <div className="eq-var">
                    <span className="eq-var__symbol">r_s</span>
                    <span className="eq-var__def">Radio de Schwarzschild del agujero negro</span>
                  </div>
                </div>
                <div className="equation-values">
                  <span>r_s = {rs.toFixed(2)} u.n.</span>
                  <span className="equation-result">r_ISCO = {rISCO.toFixed(2)} u.n.</span>
                </div>
              </div>

              <div className="equation-card">
                <strong>Nave / r_ISCO = {(m.r / rISCO).toFixed(3)}</strong>
                <p className="eq-description">
                  Posición de la nave respecto al borde estable del disco.
                  Un valor menor que 1 indica que la nave está en la región
                  de caída inevitable — ninguna órbita circular es posible.
                </p>
                <div className="equation-values">
                  <span>r nave = {m.r.toFixed(2)} u.n.</span>
                  <span className="equation-result">
                    {m.r < rISCO ? "⚠ Dentro del ISCO" : "Fuera del ISCO"}
                  </span>
                </div>
              </div>
            </section>

            <section className="panel-section">
              <p className="panel-kicker">Estimación de masa y densidad</p>

              <div className="equation-card">
                <strong>M = r_ISCO · c² / (6G)</strong>
                <p className="eq-description">
                  Masa del agujero negro estimada a partir del radio interior
                  del disco. En astrofísica real este método se usa con
                  telescopios de rayos X para "pesar" agujeros negros en
                  sistemas binarios. Con G = c = 1: M = r_ISCO / 6.
                </p>
                <div className="eq-vars">
                  <div className="eq-var">
                    <span className="eq-var__symbol">M</span>
                    <span className="eq-var__def">Masa estimada a partir del radio interior del disco observable</span>
                  </div>
                  <div className="eq-var">
                    <span className="eq-var__symbol">r_ISCO</span>
                    <span className="eq-var__def">Radio interior del disco — observable en rayos X</span>
                  </div>
                </div>
                <div className="equation-values">
                  <span>r_ISCO = {rISCO.toFixed(2)} u.n.</span>
                  <span className="equation-result">M ≈ {massEstimate.toFixed(4)} u.n.</span>
                </div>
              </div>

              <div className="equation-card">
                <strong>ρ = M / (4/3 · π · r_s³)</strong>
                <p className="eq-description">
                  Densidad media si toda la masa estuviera distribuida
                  uniformemente dentro del radio de Schwarzschild. No tiene
                  significado físico real — la materia colapsa a la
                  singularidad — pero permite dimensionar la concentración.
                  Para agujeros negros supermasivos esta densidad puede ser
                  menor que la del agua.
                </p>
                <div className="eq-vars">
                  <div className="eq-var">
                    <span className="eq-var__symbol">ρ</span>
                    <span className="eq-var__def">Densidad media de referencia dentro del horizonte (u.n.)</span>
                  </div>
                  <div className="eq-var">
                    <span className="eq-var__symbol">r_s³</span>
                    <span className="eq-var__def">Volumen esférico del radio de Schwarzschild como referencia</span>
                  </div>
                </div>
                <div className="equation-values">
                  <span>Vol = {volumeRS.toFixed(3)} u.n.³</span>
                  <span className="equation-result">
                    ρ = {densityEstimate.toExponential(3)} u.n.
                  </span>
                </div>
              </div>
            </section>
          </>
        )}

        {/* ── FOTONES ── */}
        {activeTab === "photonsphere" && (
          <>
            <section className="panel-section panel-section--hero">
              <p className="panel-kicker">Órbita inestable de la luz</p>
              <h2>Esfera de fotones</h2>
              <p>
                A 1.5 r_s existe una órbita donde la luz puede girar
                indefinidamente. Es inestable: cualquier perturbación hace
                que el fotón caiga o escape. Es la responsable del anillo
                brillante en imágenes del Event Horizon Telescope.
              </p>
            </section>

            <section className="panel-section">
              <p className="panel-kicker">Física</p>

              <div className="equation-card">
                <strong>r_ph = (3/2) · r_s = 3GM / c²</strong>
                <p className="eq-description">
                  Radio exacto de la esfera de fotones para un agujero negro
                  de Schwarzschild. En agujeros de Kerr (con spin) este radio
                  se divide en dos — uno para órbitas en el sentido del spin
                  y otro para el sentido contrario.
                </p>
                <div className="eq-vars">
                  <div className="eq-var">
                    <span className="eq-var__symbol">r_ph</span>
                    <span className="eq-var__def">Radio de la esfera de fotones — órbita circular inestable de la luz</span>
                  </div>
                  <div className="eq-var">
                    <span className="eq-var__symbol">r_s</span>
                    <span className="eq-var__def">Radio de Schwarzschild del agujero negro</span>
                  </div>
                </div>
                <div className="equation-values">
                  <span>r_s = {rs.toFixed(2)} u.n.</span>
                  <span className="equation-result">
                    r_ph = {(1.5 * rs).toFixed(2)} u.n.
                  </span>
                </div>
              </div>

              <div className="equation-card">
                <strong>Δr = r − r_ph = {(m.r - 1.5 * rs).toFixed(2)} u.n.</strong>
                <p className="eq-description">
                  {state.effects.photonSphereRegion
                    ? "⚠ La nave está dentro de la esfera de fotones — las trayectorias visuales se vuelven caóticas y pueden aparecer imágenes múltiples del disco."
                    : "La nave está fuera de la región de órbita fotónica."}
                </p>
                <div className="eq-vars">
                  <div className="eq-var">
                    <span className="eq-var__symbol">Δr</span>
                    <span className="eq-var__def">Margen entre la nave y la esfera de fotones (u.n.)</span>
                  </div>
                  <div className="eq-var">
                    <span className="eq-var__symbol">r</span>
                    <span className="eq-var__def">Posición radial actual de la nave cercana</span>
                  </div>
                </div>
              </div>

              <div className="equation-card">
                <strong>b_c = (3√3 / 2) · r_s</strong>
                <p className="eq-description">
                  Parámetro de impacto crítico. Fotones con b menor caen al
                  agujero negro; con b mayor escapan. Determina el tamaño
                  angular de la sombra del agujero negro — el disco oscuro
                  central que el EHT fotografió en M87* y Sgr A*.
                </p>
                <div className="eq-vars">
                  <div className="eq-var">
                    <span className="eq-var__symbol">b_c</span>
                    <span className="eq-var__def">Parámetro de impacto crítico — frontera entre captura y escape</span>
                  </div>
                </div>
                <div className="equation-values">
                  <span className="equation-result">
                    b_c = {(1.5 * Math.sqrt(3) * rs).toFixed(2)} u.n.
                  </span>
                </div>
              </div>
            </section>
          </>
        )}

      </div>
    </aside>
  )
}