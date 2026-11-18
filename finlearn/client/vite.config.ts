import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"
import router from "@tanstack/router-plugin/vite"
import { defineConfig, loadEnv } from "vite"

// Single .env at the finlearn root, shared with the server.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../", "")
  const serverPort = env.PORT ?? "8000"

  return {
    plugins: [router(), react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
    envDir: "../",
    server: {
      proxy: {
        "/api": `http://localhost:${serverPort}`,
      },
    },
  }
})
