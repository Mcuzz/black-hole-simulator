import type { SimulationState } from "../../../core/state/simulationState"
import { SpaghettiCanvas } from "./SpaghettiCanvas"

const OBSERVER_IMAGE = "/textures/observer_face.png"

interface SpaghettiModalProps {
  state: SimulationState
  onClose: () => void
}

export function SpaghettiModal({ state, onClose }: SpaghettiModalProps) {
  const spag = state.effects.spaghettificationFactor
  const dilation = state.effects.timeDilation
  const redshift = Number.isFinite(state.effects.gravitationalRedshift)
    ? state.effects.gravitationalRedshift
    : 999
  const rs = state.blackHole.schwarzschildRadius || 1
  const nearRs = (state.spacecraftNear.distance / rs).toFixed(2)

  const metrics = [
    { label: "Distancia", value: `${nearRs} r_s` },
    { label: "Spaghett.", value: spag.toFixed(2) },
    { label: "Dilatación", value: dilation.toFixed(3) },
    { label: "Redshift", value: redshift > 99 ? "∞" : redshift.toFixed(2) },
  ]

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="spag-modal-backdrop" onClick={handleBackdropClick}>
      <div className="spag-modal">
        <div className="spag-modal__header">
          <div>
            <div className="spag-modal__title">⬤ PERSPECTIVA DEL OBSERVADOR — HORIZONTE ACTIVO</div>
            <div className="spag-modal__sub">MARCO PROPIO · SPAGHETTIFICATION ANALYSIS</div>
          </div>
          <button
            className="spag-modal__close"
            onClick={onClose}
            type="button"
            aria-label="Cerrar modal"
          >
            ×
          </button>
        </div>

        <div className="spag-modal__body">
          <SpaghettiCanvas
            imageSrc={OBSERVER_IMAGE}
            spaghettificationFactor={spag}
          />

          <p className="spag-modal__hint">
            mueve el cursor para controlar el punto de singularidad · las fuerzas de marea actúan en tiempo real
          </p>

          <div className="spag-modal__metrics">
            {metrics.map((m) => (
              <div key={m.label} className="spag-metric">
                <span className="spag-metric__label">{m.label}</span>
                <span className="spag-metric__value">{m.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}