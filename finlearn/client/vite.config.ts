import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"
import router from "@tanstack/router-plugin/vite"
import { defineConfig, loadEnv } from "vite"

// Single .env at the finlearn root, shared with the server.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, "../", "")
  const serverPort = env.PORT ?? "8000"
  // Docker dev: el proxy corre dentro del contenedor, apuntar al servicio `server`.
  // SERVER_HOST solo se define en docker-compose.override.yml.
  const serverHost = env.SERVER_HOST ?? "localhost"

  return {
    plugins: [router(), react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
    envDir: "../",
    server: {
      proxy: {
        "/api": `http://${serverHost}:${serverPort}`,
      },
    },
  }
})
