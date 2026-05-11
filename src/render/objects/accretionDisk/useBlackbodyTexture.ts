import { useEffect, useState } from "react"
import {
  ClampToEdgeWrapping,
  LinearFilter,
  Texture,
  TextureLoader,
} from "three"

function configureLookupTexture(texture: Texture) {
  texture.minFilter = LinearFilter
  texture.magFilter = LinearFilter
  texture.wrapS = ClampToEdgeWrapping
  texture.wrapT = ClampToEdgeWrapping
  texture.needsUpdate = true
}

export function useBlackbodyTexture(): Texture | null {
  const [texture, setTexture] = useState<Texture | null>(null)

  useEffect(() => {
    let cancelled = false

    new TextureLoader().load(
      "./textures/blackbody.png",
      (nextTexture) => {
        configureLookupTexture(nextTexture)
        if (!cancelled) {
          setTexture(nextTexture)
        }
      },
      undefined,
      () => {
        // The shader can fall back to an internal palette if the LUT is absent.
      },
    )

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    return () => {
      texture?.dispose()
    }
  }, [texture])

  return texture
}
