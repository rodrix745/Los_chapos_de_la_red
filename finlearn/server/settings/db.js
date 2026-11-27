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

// NOTE: keep this table definition in sync with modules/users/schema.js
// (the Drizzle model). Until the schema is pushed with drizzle-kit, this
// CREATE TABLE is the only thing guaranteeing the table exists at boot.
export async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id serial PRIMARY KEY,
      email text NOT NULL UNIQUE,
      nickname text NOT NULL,
      password text NOT NULL,
      role text NOT NULL DEFAULT 'player'
    )
  `)
  // Databases created before the role column existed get it on boot.
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'player'`)
}
