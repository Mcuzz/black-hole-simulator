import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalizedId = id.replaceAll("\\", "/")

          if (normalizedId.includes("/node_modules/@react-three/drei/")) {
            return "r3f-drei"
          }

          if (normalizedId.includes("/node_modules/@react-three/fiber/")) {
            return "r3f-fiber"
          }

          if (
            normalizedId.includes("/node_modules/three/") ||
            normalizedId.includes("/node_modules/three-stdlib/")
          ) {
            return "three-core"
          }

          if (
            normalizedId.includes("/node_modules/react/") ||
            normalizedId.includes("/node_modules/react-dom/")
          ) {
            return "react-vendor"
          }
        },
      },
    },
  },
})
