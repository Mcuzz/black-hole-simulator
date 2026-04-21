import type { CSSProperties } from "react"

interface ClockPanelProps {
  className?: string
  subtitle: string
  timeValue: number
  title: string
  tone: "near" | "far"
}

function formatMissionTime(value: number) {

  const totalSeconds = Math.max(0, Math.floor(value * 10))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `T+${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`
}

export function ClockPanel({
  className = "",
  subtitle,
  timeValue,
  title,
  tone,
}: ClockPanelProps) {

  const hourAngle = (timeValue * 18) % 360
  const minuteAngle = (timeValue * 180) % 360

  return (
    <aside className={`${className} ${tone}`}>
      <p className="clock-kicker">{subtitle}</p>
      <h2>{title}</h2>

      <div className="clock-face">
        <div className="clock-ring" />
        <div
          className="clock-hand clock-hand--hour"
          style={{ "--clock-angle": `${hourAngle}deg` } as CSSProperties}
        />
        <div
          className="clock-hand clock-hand--minute"
          style={{ "--clock-angle": `${minuteAngle}deg` } as CSSProperties}
        />
        <div className="clock-core" />
      </div>

      <strong>{formatMissionTime(timeValue)}</strong>
      <small>Tiempo propio del observador</small>
    </aside>
  )
}
