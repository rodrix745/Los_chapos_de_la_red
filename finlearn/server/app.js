import express from 'express'
import { register } from './modules/users/register.js'
import { login } from './modules/users/login.js'
import { profile } from './modules/users/profile.js'

export function createApp() {
  const app = express()
  app.use(express.json())

  app.post('/api/register', register)
  app.post('/api/login', login)
  app.get('/api/me', profile)

  return app
}
