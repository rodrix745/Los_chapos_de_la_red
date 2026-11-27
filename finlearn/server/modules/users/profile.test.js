import { beforeAll, afterAll, it, expect } from 'vitest'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import { createApp } from '../../app.js'
import { pool, ensureSchema } from '../../settings/db.js'
import { JWT_SECRET } from '../../settings/env.js'

const app = createApp()

beforeAll(async () => {
  await ensureSchema()
  await pool.query('DELETE FROM users')
})

afterAll(async () => {
  await pool.end()
})

// AC2: session persists — with the login/register token the app knows who you are
it('session: with the login token, GET /api/me returns the nickname', async () => {
  const register = await request(app)
    .post('/api/register')
    .send({ email: 'me@email.com', nickname: 'mey', password: 'me-password' })
  expect(register.status).toBe(201) // sanity: the account exists before using the token

  const res = await request(app)
    .get('/api/me')
    .set('Authorization', `Bearer ${register.body.token}`)

  expect(res.status).toBe(200)
  expect(res.body.nickname).toBe('mey')
  expect(res.body.role).toBe('player')
})

// AC3: an invalid or stale session must be refused cleanly, not crash
it('session: with a missing or invalid token → responds 401 with a message', async () => {
  const noToken = await request(app).get('/api/me')
  expect(noToken.status).toBe(401)
  expect(noToken.body.message).toBeTruthy()
  expect(noToken.headers['content-type']).toContain('application/json')

  const garbage = await request(app).get('/api/me').set('Authorization', 'Bearer not-a-jwt')
  expect(garbage.status).toBe(401)
  expect(garbage.body.message).toBeTruthy()
})

it('session: with a token for a user that no longer exists → responds 401 with a message', async () => {
  const register = await request(app)
    .post('/api/register')
    .send({ email: 'ghost-user@email.com', nickname: 'ghosty', password: 'ghost-pass1' })
  expect(register.status).toBe(201) // sanity: the session token is real

  await pool.query('DELETE FROM users') // the user row disappears after the token was issued

  const res = await request(app)
    .get('/api/me')
    .set('Authorization', `Bearer ${register.body.token}`)

  expect(res.status).toBe(401)
  expect(res.body.message).toBeTruthy()
})

it('session: with an expired token → responds 401 with a message', async () => {
  const register = await request(app)
    .post('/api/register')
    .send({ email: 'expired@email.com', nickname: 'expired', password: 'expired123' })
  expect(register.status).toBe(201)

  // a token signed as if it were issued way in the past (already expired)
  const expiredToken = jwt.sign(
    { sub: register.body.user.id },
    JWT_SECRET,
    { expiresIn: '-10s' },
  )

  const res = await request(app)
    .get('/api/me')
    .set('Authorization', `Bearer ${expiredToken}`)

  expect(res.status).toBe(401)
  expect(res.body.message).toBeTruthy()
})
