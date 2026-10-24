// Conexión a PostgreSQL. La URL viene de DATABASE_URL; si no está definida,
// usamos la convención local del proyecto.
import { Pool } from 'pg'

export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? 'postgres://postgres:postgres_password@localhost:5432/finlearn',
})

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
