//En relatividad general existe una órbita especial de fotones alrededor 
// de un agujero negro:
//r = 1.5 × Schwarzschild Radius
//Ahí la luz puede orbitar temporalmente el agujero negro.
//Eso produce el famoso anillo brillante que vemos en imágenes 
// como la del Event Horizon Telescope.
import { useMemo } from "react"
import { AdditiveBlending } from "three"

interface PhotonSphereProps {
  schwarzschildRadius: number
}

export function PhotonSphere({ schwarzschildRadius }: PhotonSphereProps) {

  const radius = useMemo(() => {
    return 1.5 * schwarzschildRadius
  }, [schwarzschildRadius])

  return (
    <mesh scale={radius}>
      <sphereGeometry args={[1, 64, 64]} />

      <meshBasicMaterial
        color="#88ccff"
        transparent
        opacity={0.15}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  )
}