type PhenomenonHeroProps = {
  eyebrow: string
  title: string
  description: string
}

export function PhenomenonHero({
  eyebrow,
  title,
  description,
}: PhenomenonHeroProps) {
  return (
    <section className="panel-section panel-section--hero">
      <p className="panel-kicker">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  )
}
