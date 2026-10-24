// Database connection. Values come from the validated env in settings/env.js.
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { env } from './env.js'

export const pool = new Pool({
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
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
