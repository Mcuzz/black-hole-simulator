export type ControlSectionProps = {
  minDistance: number
  maxDistance: number
  currentDistance: number
  targetDistance: number
  schwarzschildRadius: number
  onTargetDistanceChange: (distance: number) => void
  nearDistanceRs: number
  targetDistanceRs: number
}
