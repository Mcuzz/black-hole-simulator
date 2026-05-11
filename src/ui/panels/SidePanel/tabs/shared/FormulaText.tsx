import type { ReactNode } from "react"

type FormulaTextProps = {
  children: ReactNode
  inline?: boolean
}

export function FormulaText({ children, inline = false }: FormulaTextProps) {
  return (
    <span
      className={inline ? "math-formula math-formula--inline" : "math-formula"}
    >
      {children}
    </span>
  )
}
