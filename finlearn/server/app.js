import express from 'express'
import { register } from './modules/users/register.js'

export function createApp() {
  const app = express()
  app.use(express.json())

  app.post('/api/register', register)

  return app
}
