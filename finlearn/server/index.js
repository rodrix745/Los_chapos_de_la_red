import { createApp } from "./app.js"
import { ensureSchema } from "./settings/db.js"
import { env } from "./settings/env.js"

await ensureSchema()

const app = createApp()

app.listen(env.PORT, () => {
  console.log(`FinLearn backend escuchando en http://localhost:${env.PORT}`)
})
