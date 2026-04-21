import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { useSimulationEngine } from "./render/hooks/useSimulationEngine"
import { useSimulationState } from "./render/hooks/useSimulationState"
import { SimulationScene } from "./render/scene/SimulationScene"
import { SplashScreen } from "./ui/layout/SplashScreen"
import { SceneOverlay } from "./ui/overlays/SceneOverlay"
import { SidePanel } from "./ui/panels/SidePanel"
import { useViewState } from "./ui/state/useViewState"

export default function App() {
  const engine = useSimulationEngine()
  const state = useSimulationState()
  const [showSplash, setShowSplash] = useState(true)
  const {
    view,
    setView,
    showNearClock,
    showFarClock,
    showSidePanel,
    showViewInfo,
    showStatusPanel,
    showStoryPanel,
    toggleNearClock,
    toggleFarClock,
    toggleSidePanel,
    toggleViewInfo,
    toggleStatusPanel,
    toggleStoryPanel,
  } = useViewState()

  const rs = state.blackHole.schwarzschildRadius
  const minDistance = rs * 1.02
  const maxDistance = state.spacecraftFar.distance * 0.92

  return (
    <div className={`app-shell view-${view}${showSplash ? " app-shell--locked" : ""}`}>
      <div className={`scene-window scene-window--immersive scene-window--${view}`}>
        <Canvas camera={{ position: [11, 6, 12], fov: 52 }}>
          <SimulationScene view={view} />
        </Canvas>

        <SceneOverlay
          state={state}
          view={view}
          onChangeView={setView}
          showNearClock={showNearClock}
          showFarClock={showFarClock}
          showSidePanel={showSidePanel}
          showViewInfo={showViewInfo}
          showStatusPanel={showStatusPanel}
          showStoryPanel={showStoryPanel}
          onToggleNearClock={toggleNearClock}
          onToggleFarClock={toggleFarClock}
          onToggleSidePanel={toggleSidePanel}
          onToggleViewInfo={toggleViewInfo}
          onToggleStatusPanel={toggleStatusPanel}
          onToggleStoryPanel={toggleStoryPanel}
        />

        {showSidePanel && (
          <div className="side-panel-dock">
            <SidePanel
              maxDistance={maxDistance}
              minDistance={minDistance}
              onTargetDistanceChange={(distance) => engine.setTargetDistance(distance)}
              state={state}
              view={view}
            />
          </div>
        )}
      </div>

      {showSplash && <SplashScreen onStart={() => setShowSplash(false)} />}
    </div>
  )
}
