import { createApp } from "./app.js"
import { ensureSchema } from "./settings/db.js"
import { env } from "./settings/env.js"

await ensureSchema()

const app = createApp()

app.listen(env.PORT, () => {
  console.log(`FinLearn backend listening on http://localhost:${env.PORT}`)
})
