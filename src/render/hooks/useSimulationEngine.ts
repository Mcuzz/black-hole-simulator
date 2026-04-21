import { useContext } from "react"
import { SimulationContext } from "../context/SimulationContext"
import type { SimulationEngine } from "../../engine/simulationEngine"

/**
 * Hook que permite acceder al SimulationEngine
 * desde cualquier componente de React dentro
 * del SimulationProvider.
 *
 * Garantiza que el engine exista.
 */
export function useSimulationEngine(): SimulationEngine {

  const context = useContext(SimulationContext)

  if (context === null) {
    throw new Error(
      "useSimulationEngine debe usarse dentro de un SimulationProvider"
    )
  }

  return context
}