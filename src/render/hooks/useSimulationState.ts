import { useSyncExternalStore } from "react"
import { useSimulationEngine } from "./useSimulationEngine"

export function useSimulationState() {

  const engine = useSimulationEngine()
  const snapshot = useSyncExternalStore(
    engine.subscribe.bind(engine),
    engine.getSnapshot.bind(engine),
    engine.getSnapshot.bind(engine)
  )

  return snapshot.state
}
