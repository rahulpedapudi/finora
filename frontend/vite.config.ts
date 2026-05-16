import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [],
      manifest: {
        name: "Finora",
        short_name: "Finora",
        description:
          "A modern financial management application for tracking and analyzing your personal finances.",
        display: "standalone",
        start_url: "/",
        theme_color: "#1e40af",
        background_color: "#f8fafc",
        icons: [
          {
            src: "/public/192x192.png",
            sizes: "192x912",
            type: "images/png",
          },
          {
            src: "/public/512x512.png",
            sizes: "512x512",
            type: "images/png",
          },
          {
            src: "/public/512x512.png",
            sizes: "512x512",
            type: "images/png",
            purpose: "any maskable",
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
