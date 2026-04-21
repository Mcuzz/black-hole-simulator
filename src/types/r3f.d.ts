import { LensingMaterial } from "../render/effects/GravitationalLensing"
import { ReactThreeFiber } from "@react-three/fiber"

declare module "@react-three/fiber" {
  interface ThreeElements {
    lensingMaterial: ReactThreeFiber.Object3DNode<
      LensingMaterial,
      typeof LensingMaterial
    >
  }
}
