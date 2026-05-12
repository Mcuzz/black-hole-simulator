import { memo, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { useSimulationEngine } from "./render/hooks/useSimulationEngine"
import { useSimulationState } from "./render/hooks/useSimulationState"
import { SimulationScene } from "./render/scene/SimulationScene"
import { SplashScreen } from "./ui/layout/SplashScreen"
import { SceneOverlay } from "./ui/overlays/SceneOverlay"
import { SidePanel } from "./ui/panels/SidePanel"
import { useViewState } from "./ui/state/useViewState"
import type { SceneView } from "./render/scene/SimulationScene"

const SCENE_CAMERA = {
  position: [11, 6, 12] as [number, number, number],
  fov: 52,
}

const SceneViewport = memo(function SceneViewport({
  view,
}: {
  view: SceneView
}) {
  return (
    <Canvas camera={SCENE_CAMERA}>
      <SimulationScene view={view} />
    </Canvas>
  )
})

export default function App() {
  const engine = useSimulationEngine()
  const state = useSimulationState()
  const [showSplash, setShowSplash] = useState(true)
  const {
    view,
    setView,
    showNearClock,
    showFarClock,
    showViewInfo,
    showStatusPanel,
    toggleNearClock,
    toggleFarClock,
    toggleViewInfo,
    toggleStatusPanel,
  } = useViewState()

  const rs = state.blackHole.schwarzschildRadius
  const minDistance = rs * 1.02
  const maxDistance = state.spacecraftFar.distance * 0.92

  return (
    <div
      className={`app-shell view-${view}${showSplash ? " app-shell--locked" : ""}`}
    >
      <div
        className={`scene-window scene-window--immersive scene-window--${view}`}
      >
        <SceneViewport view={view} />

        <SceneOverlay
          state={state}
          view={view}
          onChangeView={setView}
          showNearClock={showNearClock}
          showFarClock={showFarClock}
          showViewInfo={showViewInfo}
          showStatusPanel={showStatusPanel}
          onToggleNearClock={toggleNearClock}
          onToggleFarClock={toggleFarClock}
          onToggleViewInfo={toggleViewInfo}
          onToggleStatusPanel={toggleStatusPanel}
        />

        <div className="side-panel-dock">
          <div className="side-panel-shell">
            <SidePanel
              state={state}
              view={view}
              minDistance={minDistance}
              maxDistance={maxDistance}
              onTargetDistanceChange={(d) => engine.setTargetDistance(d)}
            />
          </div>
        </div>
      </div>

      {showSplash && <SplashScreen onStart={() => setShowSplash(false)} />}
    </div>
  )
}
