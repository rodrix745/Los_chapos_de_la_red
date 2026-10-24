import jwt from 'jsonwebtoken'
import { pool } from '../../db.js'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret'

export async function profile(req, res) {
  const [, token] = (req.headers.authorization ?? '').split(' ')
  const payload = jwt.verify(token, JWT_SECRET)
  const { rows } = await pool.query(
    'SELECT id, email, nickname FROM users WHERE id = $1',
    [payload.sub],
  )
  const user = rows[0]
  res.status(200).json(user)
}
