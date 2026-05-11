import { ReactThreeFiber } from "@react-three/fiber"
import { LensingMaterial } from "../render/effects/GravitationalLensing"

declare module "@react-three/fiber" {
  interface ThreeElements {
    lensingMaterial: ReactThreeFiber.Object3DNode<
      LensingMaterial,
      typeof LensingMaterial
    >
  }
}
