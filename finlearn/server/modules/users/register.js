import jwt from 'jsonwebtoken'
import { pool } from '../../db.js'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret'

export async function register(req, res) {
  const { email, nickname, password } = req.body
  const { rows } = await pool.query(
    'INSERT INTO users (email, nickname, password) VALUES ($1, $2, $3) RETURNING id, email, nickname',
    [email, nickname, password],
  )
  const user = rows[0]
  const token = jwt.sign({ sub: user.id }, JWT_SECRET)
  res.status(201).json({ token, user })
}
