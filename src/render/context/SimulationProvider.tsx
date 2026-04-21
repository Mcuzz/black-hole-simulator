import React, { useState } from "react"
import { SimulationContext } from "./SimulationContext"
import { SimulationEngine } from "../../engine/simulationEngine"
import { createInitialSimulationState } from "../../core/state/createSimulation"

export function SimulationProvider({
  children
}: {
  children: React.ReactNode
}) {

  const [engine] = useState(() => {

    const initialState = createInitialSimulationState()

    return new SimulationEngine(initialState)

  })

  return (
    <SimulationContext.Provider value={engine}>
      {children}
    </SimulationContext.Provider>
  )

}