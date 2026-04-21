import { createContext } from "react"
import type { SimulationEngine } from "../../engine/simulationEngine"

/**
 * Contexto que expone el motor de simulación
 * a los componentes de React.
 */

export const SimulationContext =
  createContext<SimulationEngine | null>(null)