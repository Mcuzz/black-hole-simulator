import { useState, useEffect, useRef } from "react"
import type { SimulationState } from "../../../core/state/simulationState"
import "./FarObserverView.css"

interface FarObserverViewProps {
  state: SimulationState
  isOpen: boolean
  onClose: () => void
}

const OBSERVER_THOUGHTS = [
  "It seems like he is standing right there, just not moving... frozen.",
  "The light from his ship is reaching me slower... and slower...",
  "I wish I could go back to her...",
  "Time is playing tricks on us. For him, everything feels normal.",
  "But from here... his clock stopped.",
  "The last image I received of him... it's burned into my memory.",
  "How long will I keep watching? How long can I bear this?",
  "He's so close, yet infinitely far away.",
  "The redshift keeps increasing... soon I won't be able to see him at all.",
  "I wonder if he knows... that from out here, he's eternal.",
]

interface ThoughtBubble {
  id: number
  text: string
  isVisible: boolean
  startTime: number
}

export function FarObserverView({
  state,
  isOpen,
  onClose,
}: FarObserverViewProps) {
  const [thoughts, setThoughts] = useState<ThoughtBubble[]>([])
  const thoughtCounterRef = useRef(0)
const thoughtIntervalRef = useRef<ReturnType<typeof setInterval>>(null)
  useEffect(() => {
    if (!isOpen) return

    // Generar primer pensamiento inmediatamente
    const firstThought: ThoughtBubble = {
      id: thoughtCounterRef.current++,
      text: OBSERVER_THOUGHTS[
        Math.floor(Math.random() * OBSERVER_THOUGHTS.length)
      ],
      isVisible: true,
      startTime: Date.now(),
    }
    setThoughts([firstThought])

    // Intervalo para nuevos pensamientos
    thoughtIntervalRef.current = setInterval(() => {
      setThoughts((prevThoughts) => {
        const now = Date.now()
        const updated = prevThoughts
          .map((thought) => {
            const elapsedTime = now - thought.startTime
            // Visible por 4 segundos, luego fade out en 1 segundo
            if (elapsedTime > 5000) {
              return null
            }
            return {
              ...thought,
              isVisible: elapsedTime < 4000,
            }
          })
          .filter((t): t is ThoughtBubble => t !== null)

        // Si hay menos de 2 pensamientos visibles, agregar uno nuevo
        if (updated.length < 2) {
          const newThought: ThoughtBubble = {
            id: thoughtCounterRef.current++,
            text: OBSERVER_THOUGHTS[
              Math.floor(Math.random() * OBSERVER_THOUGHTS.length)
            ],
            isVisible: true,
            startTime: now,
          }
          return [...updated, newThought]
        }

        return updated
      })
    }, 1500)

    return () => {
      if (thoughtIntervalRef.current) {
        clearInterval(thoughtIntervalRef.current)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const rs = state.blackHole.schwarzschildRadius || 1
  const nearDistanceRs = state.spacecraftNear.distance / rs
  const farDistanceRs = state.spacecraftFar.distance / rs
  const clockGap = state.clocks.farObserverTime - state.clocks.nearObserverTime
  const redshift = state.effects.gravitationalRedshift

  return (
    <div className="far-observer-modal-overlay" onClick={onClose}>
      <div
        className="far-observer-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          className="far-observer-close-btn"
          onClick={onClose}
          type="button"
          aria-label="Cerrar vista del observador lejano"
        >
          ×
        </button>

        {/* Contenedor principal */}
        <div className="far-observer-container">
          {/* Panel izquierdo: Información del observador lejano */}
          <div className="far-observer-info">
            <div className="info-header">
              <h2>Estación de Seguimiento</h2>
              <p className="subtitle">Observador Lejano (100 r_s)</p>
            </div>

            <div className="info-metrics">
              <div className="metric">
                <span className="label">Tu Distancia:</span>
                <span className="value">{farDistanceRs.toFixed(1)} r_s</span>
              </div>

              <div className="metric">
                <span className="label">Distancia de él:</span>
                <span className="value">{nearDistanceRs.toFixed(2)} r_s</span>
              </div>

              <div className="metric">
                <span className="label">Brecha Temporal:</span>
                <span className="value">{clockGap.toFixed(1)} s</span>
              </div>

              <div className="metric">
                <span className="label">Redshift:</span>
                <span className="value redshift-warning">
                  {Number.isFinite(redshift) ? redshift.toFixed(2) : "∞"}
                </span>
              </div>
            </div>

            <div className="observer-status">
              <p className="status-title">Estado de la Conexión:</p>
              <p className="status-text">
                La señal se está debilitando... cada segundo que pasa, su luz
                tarda más en llegar a mí.
              </p>
            </div>
          </div>

          {/* Panel derecho: Vista con pensamientos */}
          <div className="far-observer-viewport">
            {/* Este será el contenedor para la escena renderizada */}
            <div className="scene-container">
              {/* Canvas o image de la escena renderizada iría aquí */}
              <div className="scene-placeholder">
                <div className="scene-content">
                  {/* La escena 3D se renderizaría aquí */}
                  <svg
                    className="scene-illustration"
                    viewBox="0 0 400 300"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Fondo espacial */}
                    <defs>
                      <radialGradient
                        id="spaceGrad"
                        cx="50%"
                        cy="50%"
                        r="50%"
                      >
                        <stop offset="0%" stopColor="#1a1a2e" />
                        <stop offset="100%" stopColor="#0f0f1e" />
                      </radialGradient>
                    </defs>

                    <rect
                      width="400"
                      height="300"
                      fill="url(#spaceGrad)"
                    />

                    {/* Agujero negro pequeño en el fondo */}
                    <circle
                      cx="200"
                      cy="120"
                      r="25"
                      fill="#000000"
                      opacity="0.9"
                    />
                    <circle
                      cx="200"
                      cy="120"
                      r="27"
                      fill="none"
                      stroke="#ffb35a"
                      strokeWidth="1"
                      opacity="0.6"
                    />

                    {/* Nave lejana (pequeña en la distancia) */}
                    <g opacity="0.7">
                      <rect
                        x="180"
                        y="100"
                        width="40"
                        height="30"
                        fill="#88ccff"
                        opacity="0.8"
                      />
                      <rect
                        x="185"
                        y="95"
                        width="30"
                        height="8"
                        fill="#ffb35a"
                        opacity="0.6"
                      />
                    </g>

                    {/* Texto informativo */}
                    <text
                      x="200"
                      y="280"
                      textAnchor="middle"
                      fill="#97aac7"
                      fontSize="12"
                      opacity="0.7"
                    >
                      Vista desde 100 r_s de distancia
                    </text>
                  </svg>
                </div>
              </div>

              {/* Pensamiento flotante */}
              <div className="thoughts-container">
                {thoughts.map((thought) => (
                  <div
                    key={thought.id}
                    className={`thought-bubble ${thought.isVisible ? "visible" : "fading"}`}
                  >
                    <div className="thought-text">{thought.text}</div>
                    <div className="thought-tail" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Botón de acción */}
        <div className="far-observer-actions">
          <button className="btn-view-inside" type="button">
            Ver Dentro
          </button>
          <button className="btn-close-modal" onClick={onClose} type="button">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}