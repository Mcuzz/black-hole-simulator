import type { ComponentType } from "react"
import { AccretionTab } from "./AccretionTab"
import { HawkingTab } from "./HawkingTab"
import { LensingTab } from "./LensingTab"
import { PhotonSphereTab } from "./PhotonSphereTab"
import { RedshiftTab } from "./RedshiftTab"
import type { PhenomenonTabProps, TabId } from "./types"

export const TABS: { id: TabId; label: string }[] = [
  { id: "redshift", label: "Redshift" },
  { id: "lensing", label: "Lente" },
  { id: "hawking", label: "Hawking" },
  { id: "accretion", label: "Disco" },
  { id: "photonsphere", label: "Fotones" },
]

export const TAB_COMPONENTS: Record<
  TabId,
  ComponentType<PhenomenonTabProps>
> = {
  redshift: RedshiftTab,
  lensing: LensingTab,
  hawking: HawkingTab,
  accretion: AccretionTab,
  photonsphere: PhotonSphereTab,
}
