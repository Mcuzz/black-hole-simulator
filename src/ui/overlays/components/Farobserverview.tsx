import { useState, useEffect, useRef, useCallback } from "react"
import type { SimulationState } from "../../../core/state/simulationState"
import "./FarObserverView.css"

interface FarObserverViewProps {
  state: SimulationState
  isOpen: boolean
  onClose: () => void
}

const OBSERVER_THOUGHTS = [
  "It seems like he is standing right there… just not moving. Frozen.",
  "The light from his ship is reaching me slower… and slower…",
  "I wish I could go back to her.",
  "Time is playing tricks on us. For him, everything feels normal.",
  "But from here… his clock stopped.",
  "The last image I received of him — it's burned into my memory.",
  "How long will I keep watching? How long can I bear this?",
  "He's so close, yet infinitely far away.",
  "The redshift keeps increasing… soon I won't be able to see him at all.",
  "I wonder if he knows… that from out here, he's eternal.",
  "She asked me when you'd be back. I didn't know what to say.",
  "Your daughter drew a picture of your ship today.",
  "Does time even mean anything anymore, this close to the edge?",
  "Every second there is a lifetime from here.",
  "I keep the photo on my dash. It's the only thing that feels real.",
]

interface ThoughtBubble {
  id: number
  text: string
  phase: "in" | "visible" | "out"
  side: "left" | "right"
}

export function FarObserverView({ state, isOpen, onClose }: FarObserverViewProps) {
  const [thoughts, setThoughts] = useState<ThoughtBubble[]>([])
  const counterRef = useRef(0)
  const usedIndicesRef = useRef<Set<number>>(new Set())

  const getRandomThought = useCallback((): string => {
    if (usedIndicesRef.current.size >= OBSERVER_THOUGHTS.length) {
      usedIndicesRef.current.clear()
    }
    let idx: number
    do {
      idx = Math.floor(Math.random() * OBSERVER_THOUGHTS.length)
    } while (usedIndicesRef.current.has(idx))
    usedIndicesRef.current.add(idx)
    return OBSERVER_THOUGHTS[idx]
  }, [])

  useEffect(() => {
    if (isOpen) return
    const t = setTimeout(() => {
      setThoughts([])
      usedIndicesRef.current.clear()
    }, 0)
    return () => clearTimeout(t)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const pending: ReturnType<typeof setTimeout>[] = []
    const firstId = counterRef.current++
    const firstText = getRandomThought()

    const tInit = setTimeout(() => {
      setThoughts([{ id: firstId, text: firstText, phase: "in", side: "right" }])
    }, 0)

    const tShow = setTimeout(() => {
      setThoughts((p) =>
        p.map((t) => (t.id === firstId ? { ...t, phase: "visible" as const } : t))
      )
    }, 120)

    pending.push(tInit, tShow)

    const interval = setInterval(() => {
      setThoughts((p) => {
        if (p.length < 2) return p
        const oldId = p[0].id
        return p.map((t) => (t.id === oldId ? { ...t, phase: "out" as const } : t))
      })

      const tAdd = setTimeout(() => {
        const newId = counterRef.current++
        const newText = getRandomThought()
        setThoughts((p) => {
          const filtered = p.filter((t) => t.phase !== "out")
          const lastSide = filtered[filtered.length - 1]?.side ?? "right"
          return [
            ...filtered,
            {
              id: newId,
              text: newText,
              phase: "in" as const,
              side: (lastSide === "right" ? "left" : "right") as "left" | "right",
            },
          ]
        })
        const tVisible = setTimeout(() => {
          setThoughts((p) =>
            p.map((t) => (t.phase === "in" ? { ...t, phase: "visible" as const } : t))
          )
        }, 80)
        pending.push(tVisible)
      }, 800)

      pending.push(tAdd)
    }, 4500)

    return () => {
      clearInterval(interval)
      for (const t of pending) clearTimeout(t)
    }
  }, [isOpen, getRandomThought])

  if (!isOpen) return null

  const rs = state.blackHole.schwarzschildRadius || 1
  const nearDistanceRs = state.spacecraftNear.distance / rs
  const farDistanceRs = state.spacecraftFar.distance / rs
  const clockGap = state.clocks.farObserverTime - state.clocks.nearObserverTime
  const redshift = state.effects.gravitationalRedshift
  const dilation = state.effects.timeDilation

  function handleClose(e: React.MouseEvent) {
    e.stopPropagation()
    onClose()
  }

  return (
    <div className="far-modal-backdrop">
      <div className="far-modal">

        <button
          className="far-modal__close"
          onClick={handleClose}
          type="button"
          aria-label="Cerrar"
        >
          ×
        </button>

        <div className="far-modal__header">
          <span className="far-modal__eyebrow">ESTACIÓN DE SEGUIMIENTO · OBSERVADOR LEJANO</span>
          <div className="far-modal__metrics-strip">
            <div className="far-metric">
              <span>TU POS.</span>
              <strong>{farDistanceRs.toFixed(1)} r_s</strong>
            </div>
            <div className="far-metric">
              <span>ÉL ESTÁ</span>
              <strong>{nearDistanceRs.toFixed(2)} r_s</strong>
            </div>
            <div className="far-metric">
              <span>BRECHA Δt</span>
              <strong>{clockGap.toFixed(1)} s</strong>
            </div>
            <div className="far-metric far-metric--warn">
              <span>REDSHIFT</span>
              <strong>{Number.isFinite(redshift) ? redshift.toFixed(2) : "∞"}</strong>
            </div>
            <div className="far-metric">
              <span>DILATACIÓN</span>
              <strong>{dilation.toFixed(3)}</strong>
            </div>
          </div>
        </div>

        <div className="far-modal__cockpit-wrap">
          <img
            src="/textures/onvie.png"
            alt=""
            className="far-modal__cockpit-img"
            draggable={false}
          />
          <div className="far-modal__thoughts">
            {thoughts.map((thought) => (
              <div
                key={thought.id}
                className={`far-thought far-thought--${thought.side} far-thought--${thought.phase}`}
              >
                <p>{thought.text}</p>
                <div className="far-thought__tail" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}