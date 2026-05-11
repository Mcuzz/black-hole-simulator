import type { ReactNode } from "react"

export type EquationVariable = {
  symbol: ReactNode
  description: string
}

export type EquationValue = {
  content: ReactNode
  highlight?: boolean
}

type EquationCardProps = {
  eyebrow: string
  formula: ReactNode
  description: string
  variables?: EquationVariable[]
  values?: EquationValue[]
  note?: ReactNode
}

export function EquationCard({
  eyebrow,
  formula,
  description,
  variables = [],
  values = [],
  note,
}: EquationCardProps) {
  return (
    <article className="equation-card">
      <small>{eyebrow}</small>
      <div className="equation-card__formula">{formula}</div>
      <p className="eq-description">{description}</p>

      {variables.length > 0 && (
        <div className="eq-vars">
          {variables.map((variable, index) => (
            <div className="eq-var" key={`${eyebrow}-${index}`}>
              <div className="eq-var__symbol">{variable.symbol}</div>
              <div className="eq-var__def">{variable.description}</div>
            </div>
          ))}
        </div>
      )}

      {values.length > 0 && (
        <div className="equation-values">
          {values.map((value, index) => (
            <span
              className={value.highlight ? "equation-result" : undefined}
              key={`${eyebrow}-value-${index}`}
            >
              {value.content}
            </span>
          ))}
        </div>
      )}

      {note ? <small>{note}</small> : null}
    </article>
  )
}
