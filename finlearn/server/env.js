// Loads the single root .env once, and validates what the app cannot run without.
// Every module must import this before reading process.env entries.

// e.g. server/db.js -> '../.env'
import { loadEnvFile } from 'node:process'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const envFile = fileURLToPath(new URL('../.env', import.meta.url))
if (existsSync(envFile)) {
  loadEnvFile(envFile)
}

export const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
  throw new Error(
    'JWT_SECRET is missing. Copy .env.example to .env at the finlearn root and generate one: openssl rand -hex 32'
  )
}
