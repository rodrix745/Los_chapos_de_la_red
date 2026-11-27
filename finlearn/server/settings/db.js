// Database connection. Values come from the validated env in settings/env.js.
import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { fileURLToPath } from 'node:url'
import { env } from './env.js'

export const pool = new Pool({
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
})

export const db = drizzle(pool)

// No-op when nothing is pending; applied migrations are tracked per database.
const MIGRATIONS_FOLDER = fileURLToPath(new URL('../drizzle', import.meta.url))

export async function migrateToLatest() {
  await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER })
}
