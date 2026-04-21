import { useState } from "react"
import type { SceneView } from "../../render/scene/SimulationScene"

export function useViewState() {
  const [view, setView] = useState<SceneView>("external")
  const [showNearClock, setShowNearClock] = useState(true)
  const [showFarClock, setShowFarClock] = useState(true)
  const [showSidePanel, setShowSidePanel] = useState(true)
  const [showViewInfo, setShowViewInfo] = useState(true)
  const [showStatusPanel, setShowStatusPanel] = useState(true)
  const [showStoryPanel, setShowStoryPanel] = useState(true)

  return {
    view,
    setView,
    showNearClock,
    showFarClock,
    showSidePanel,
    showViewInfo,
    showStatusPanel,
    showStoryPanel,
    toggleNearClock: () => setShowNearClock((value) => !value),
    toggleFarClock: () => setShowFarClock((value) => !value),
    toggleSidePanel: () => setShowSidePanel((value) => !value),
    toggleViewInfo: () => setShowViewInfo((value) => !value),
    toggleStatusPanel: () => setShowStatusPanel((value) => !value),
    toggleStoryPanel: () => setShowStoryPanel((value) => !value),
  }
}
