// Loads the single root .env once, and validates every variable the app needs.
// Every module must import this before using any environment configuration.
import { config } from 'dotenv'
import { fileURLToPath } from 'node:url'
import { z } from 'zod'

// e.g. settings/env.js -> '../../.env' (the finlearn root)
config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) })

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(8000),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive(),
  DB_NAME: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  // durations in jwt format, e.g. 30m, 12h, 7d
  ACCESS_TOKEN_LIFETIME: z.string().regex(/^[1-9]\d*[smhd]$/).default('15m'),
  REFRESH_TOKEN_LIFETIME: z.string().regex(/^[1-9]\d*[smhd]$/).default('7d'),
})

const parsed = envSchema.safeParse(process.env)
if (!parsed.success) {
  const problems = parsed.error.issues
    .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
    .join('\n')
  throw new Error(
    'Invalid or missing .env (copy .env.example to .env at the finlearn root):\n' + problems
  )
}

export const env = parsed.data
export const JWT_SECRET = env.JWT_SECRET
export const ACCESS_TOKEN_LIFETIME = env.ACCESS_TOKEN_LIFETIME
// Reserved for the refresh-token story: not consumed anywhere yet.
export const REFRESH_TOKEN_LIFETIME = env.REFRESH_TOKEN_LIFETIME
