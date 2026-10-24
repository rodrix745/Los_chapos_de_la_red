// Single .env file at the finlearn root, shared by server and client.
// Loaded relative to this module so it works no matter the working directory.
import { loadEnvFile } from 'node:process'
import { fileURLToPath } from 'node:url'
import { existsSync } from 'node:fs'
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'

const envFile = fileURLToPath(new URL('../.env', import.meta.url))
if (existsSync(envFile)) {
  loadEnvFile(envFile)
}

export const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
})

export const db = drizzle(pool)

export async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id serial PRIMARY KEY,
      email text NOT NULL UNIQUE,
      nickname text NOT NULL,
      password text NOT NULL
    )
  `)
}
