import { it, expect } from 'vitest'
import express from 'express'
import request from 'supertest'
import { createApp } from '../app.js'
import { ApiError, errorHandler } from './errors.js'

const app = createApp()

// The 500 path cannot be triggered through real endpoints; a minimal app
// throws on purpose. Everything else runs against createApp().
const failingApp = express()
failingApp.get('/api-error', (req, res, next) => next(new ApiError(418, 'known failure')))
failingApp.get('/boom', (req, res, next) => next(new Error('internal driver details')))
failingApp.use(errorHandler)

it('errors: unknown route → responds 404 with a JSON message, not HTML', async () => {
  const res = await request(app).get('/api/nope')

  expect(res.status).toBe(404)
  expect(res.body.message).toBeTruthy()
  expect(res.headers['content-type']).toContain('application/json')
})

it('errors: malformed JSON body → responds 400 with a JSON message, not HTML', async () => {
  const res = await request(app)
    .post('/api/register')
    .set('Content-Type', 'application/json')
    .send('{"email": ')

  expect(res.status).toBe(400)
  expect(res.body.message).toBeTruthy()
  expect(res.headers['content-type']).toContain('application/json')
})

it('errors: an ApiError keeps its status and message', async () => {
  const res = await request(failingApp).get('/api-error')

  expect(res.status).toBe(418)
  expect(res.body.message).toBe('known failure')
  expect(res.headers['content-type']).toContain('application/json')
})

// AC: internals must never leak — the client sees a generic message only
it('errors: an unexpected failure → responds generic 500 JSON without internals', async () => {
  const res = await request(failingApp).get('/boom')

  expect(res.status).toBe(500)
  expect(res.body.message).toBe('Something went wrong')
  expect(JSON.stringify(res.body)).not.toContain('internal driver details')
  expect(res.headers['content-type']).toContain('application/json')
})
