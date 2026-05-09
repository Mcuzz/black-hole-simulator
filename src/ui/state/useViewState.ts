import { useState } from "react"
import type { SceneView } from "../../render/scene/SimulationScene"

export function useViewState() {
  const [view, setView] = useState<SceneView>("external")
  const [showNearClock, setShowNearClock] = useState(true)
  const [showFarClock, setShowFarClock] = useState(true)
  const [showViewInfo, setShowViewInfo] = useState(true)
  const [showStatusPanel, setShowStatusPanel] = useState(true)
  const [showControlPanel, setShowControlPanel] = useState(true)

  return {
    view,
    setView,
    showNearClock,
    showFarClock,
    showViewInfo,
    showStatusPanel,
    showControlPanel,
    toggleNearClock: () => setShowNearClock((v) => !v),
    toggleFarClock: () => setShowFarClock((v) => !v),
    toggleViewInfo: () => setShowViewInfo((v) => !v),
    toggleStatusPanel: () => setShowStatusPanel((v) => !v),
    toggleControlPanel: () => setShowControlPanel((v) => !v),
  }
}