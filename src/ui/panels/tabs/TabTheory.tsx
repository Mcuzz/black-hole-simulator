import { useSimulationState } from "../../../render/hooks/useSimulationState"

/**
 * Redundancia detectada:
 * este tab fue reemplazado por el SidePanel modular.
 * Se mantiene solo como referencia para una futura limpieza.
 */
export function TabTheory() {
  const state = useSimulationState()

  return (
    <div>
      <h2>Experimento relativista</h2>

      <p>
        Dos astronautas sincronizan sus relojes. Uno permanece lejos del
        agujero negro, mientras el otro se aproxima al horizonte.
      </p>

      <h3>Datos en tiempo real</h3>

      <ul>
        <li>Global time: {state.globalTime.toFixed(2)}</li>
        <li>Near clock: {state.clocks.nearObserverTime.toFixed(2)}</li>
        <li>Far clock: {state.clocks.farObserverTime.toFixed(2)}</li>
        <li>Near dilation: {state.effects.timeDilation.toFixed(5)}</li>
        <li>Near redshift: {state.effects.gravitationalRedshift.toFixed(5)}</li>
      </ul>

      <h3>Ecuacion de dilatacion</h3>

      <p>t_local = t * sqrt(1 - r_s / r)</p>
    </div>
  )
}
