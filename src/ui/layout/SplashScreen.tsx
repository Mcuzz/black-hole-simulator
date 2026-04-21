import { useEffect } from "react"

interface SplashScreenProps {
  onStart: () => void
}

export function SplashScreen({ onStart }: SplashScreenProps) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== "Space") {
        return
      }

      event.preventDefault()
      onStart()
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [onStart])

  return (
    <div
      aria-label="Pantalla de inicio"
      className="splash-screen"
      onClick={onStart}
      onKeyDown={(event) => {
        if (event.key === " " || event.code === "Space" || event.key === "Enter") {
          event.preventDefault()
          onStart()
        }
      }}
      role="button"
      tabIndex={0}
    >
      <div className="splash-screen__card">
        <p className="eyebrow">Natalia / portfolio simulation</p>
        <h2>Interactive Schwarzschild Black Hole Simulator</h2>
        <p>
          Visualizacion educativa de dilatacion temporal, redshift gravitacional
          y lente del espacio-tiempo en un sistema de Schwarzschild.
        </p>
        <span className="splash-screen__hint">Toca cualquier lugar para comenzar</span>
        <small className="splash-screen__subhint">Tambien puedes presionar la tecla Space.</small>
      </div>
    </div>
  )
}
