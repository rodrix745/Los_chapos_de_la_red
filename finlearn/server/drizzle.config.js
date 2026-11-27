import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './modules/**/schema.js',
  out: './drizzle',
  dialect: 'postgresql',
})
