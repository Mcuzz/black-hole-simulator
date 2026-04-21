export function mapSliderToDistance(t: number, rs: number) {
  const min = 1.05 * rs
  const max = 100 * rs

  const k = 4

  const scaled =
    (Math.exp(k * t) - 1) /
    (Math.exp(k) - 1)

  return min + (max - min) * scaled
}