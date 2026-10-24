import { beforeAll, afterAll, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../../app.js'
import { pool, ensureSchema } from '../../db.js'

const app = createApp()

beforeAll(async () => {
  await ensureSchema()
  await pool.query('DELETE FROM users')
})

afterAll(async () => {
  await pool.end()
})

// AC3 (happy path): register with a new email, nickname and password → enters already authenticated
it('register: with a new email, nickname and password → responds 201, token and nickname', async () => {
  const res = await request(app)
    .post('/api/register')
    .send({ email: 'anna@example.com', nickname: 'anna', password: 'secret123' })

  expect(res.status).toBe(201)
  expect(res.body.user.nickname).toBe('anna')
  expect(res.body.token).toBeTruthy()
})

// AC3: registering with an email already used → sees a clear error message and does not stay authenticated
it('register: with an email already used → responds 409 with a message and no token', async () => {
  const first = await request(app)
    .post('/api/register')
    .send({ email: 'duplicate@example.com', nickname: 'first', password: 'password123' })
  expect(first.status).toBe(201) // sanity: the first registration succeeds

  const res = await request(app)
    .post('/api/register')
    .send({ email: 'duplicate@example.com', nickname: 'second', password: 'other-password' })

  expect(res.status).toBe(409)
  expect(res.body.message).toBeTruthy()
  expect(res.body.token).toBeUndefined()
})

// Plan: input validated before saving
it('register: with an invalid email → responds 400 with a field error and no token', async () => {
  const res = await request(app)
    .post('/api/register')
    .send({ email: 'not-an-email', nickname: 'badmail', password: 'long-enough' })

  expect(res.status).toBe(400)
  expect(res.body.errors.email).toBeTruthy()
  expect(res.body.token).toBeUndefined()
})

it('register: with a short password → responds 400 with a field error and no token', async () => {
  const res = await request(app)
    .post('/api/register')
    .send({ email: 'short@email.com', nickname: 'shorty', password: 'short' })

  expect(res.status).toBe(400)
  expect(res.body.errors.password).toBeTruthy()
  expect(res.body.token).toBeUndefined()
})

it('register: with a missing field → responds 400 with a field error covering each missing one', async () => {
  const res = await request(app)
    .post('/api/register')
    .send({})

  expect(res.status).toBe(400)
  expect(res.body.errors.email).toBeTruthy()
  expect(res.body.errors.nickname).toBeTruthy()
  expect(res.body.errors.password).toBeTruthy()
  expect(res.body.token).toBeUndefined()
})

// Plan: password stored securely (hashed)
it('register: the password is stored hashed, not in plain text', async () => {
  const res = await request(app)
    .post('/api/register')
    .send({ email: 'hash@email.com', nickname: 'hashy', password: 'plain-secret' })
  expect(res.status).toBe(201)

  const { rows } = await pool.query(
    'SELECT password FROM users WHERE email = $1',
    ['hash@email.com'],
  )
  expect(rows[0].password).not.toBe('plain-secret')
})
