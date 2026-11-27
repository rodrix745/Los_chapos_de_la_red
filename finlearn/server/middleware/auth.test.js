import { beforeAll, afterAll, it, expect } from 'vitest'
import express from 'express'
import request from 'supertest'
import { createApp } from '../app.js'
import { pool, ensureSchema } from '../settings/db.js'
import { requireAuth, requireRole } from './auth.js'

// requireAuth is exercised end-to-end through GET /api/me (see
// modules/users/profile.test.js). This suite covers the role guard through a
// minimal admin-only route, since no admin endpoint exists yet.
const adminApp = express()
adminApp.get('/admin-only', requireAuth, requireRole('admin'), (req, res) => {
  res.status(200).json(req.user)
})

const app = createApp()

beforeAll(async () => {
  await ensureSchema()
  await pool.query('DELETE FROM users')
})

afterAll(async () => {
  await pool.end()
})

it('role: a player hitting an admin-only route → responds 403 with a message', async () => {
  const register = await request(app)
    .post('/api/register')
    .send({ email: 'player@email.com', nickname: 'playerly', password: 'player-pass' })
  expect(register.status).toBe(201) // sanity: registration defaults to the player role
  expect(register.body.user.role).toBe('player')

  const res = await request(adminApp)
    .get('/admin-only')
    .set('Authorization', `Bearer ${register.body.token}`)

  expect(res.status).toBe(403)
  expect(res.body.message).toBeTruthy()
  expect(res.headers['content-type']).toContain('application/json')
})

it('role: without a token the guard refuses before checking the role → 401', async () => {
  const res = await request(adminApp).get('/admin-only')

  expect(res.status).toBe(401)
  expect(res.body.message).toBeTruthy()
})

// AC: roles are read fresh from the database on every request, not baked into
// the token, so promoting or demoting applies without re-login.
it('role: promoting and demoting a user applies immediately with the same token', async () => {
  const register = await request(app)
    .post('/api/register')
    .send({ email: 'promoted@email.com', nickname: 'promotely', password: 'promoted-pass' })
  expect(register.status).toBe(201)
  const token = register.body.token

  await pool.query(`UPDATE users SET role = 'admin' WHERE email = 'promoted@email.com'`)

  const asAdmin = await request(adminApp)
    .get('/admin-only')
    .set('Authorization', `Bearer ${token}`)
  expect(asAdmin.status).toBe(200)
  expect(asAdmin.body.role).toBe('admin')

  await pool.query(`UPDATE users SET role = 'player' WHERE email = 'promoted@email.com'`)

  const demoted = await request(adminApp)
    .get('/admin-only')
    .set('Authorization', `Bearer ${token}`)
  expect(demoted.status).toBe(403)
  expect(demoted.body.message).toBeTruthy()
})
