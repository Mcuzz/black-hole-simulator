import { useState } from "react"
import type { SceneView } from "../../render/scene/SimulationScene"

export function useViewState() {
  const [view, setView] = useState<SceneView>("external")
  const [showNearClock, setShowNearClock] = useState(true)
  const [showFarClock, setShowFarClock] = useState(true)
  const [showViewInfo, setShowViewInfo] = useState(true)
  const [showStatusPanel, setShowStatusPanel] = useState(true)

  return {
    view,
    setView,
    showNearClock,
    showFarClock,
    showViewInfo,
    showStatusPanel,
    toggleNearClock: () => setShowNearClock((value) => !value),
    toggleFarClock: () => setShowFarClock((value) => !value),
    toggleViewInfo: () => setShowViewInfo((value) => !value),
    toggleStatusPanel: () => setShowStatusPanel((value) => !value),
  }
}
