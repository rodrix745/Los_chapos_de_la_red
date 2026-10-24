import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { pool } from '../../db.js'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret'

export async function login(req, res) {
  const { email, password } = req.body
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email])
  const user = rows[0]
  const passwordMatches = user
    ? await bcrypt.compare(password, user.password)
    : false
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Wrong email or password' })
  }
  const token = jwt.sign({ sub: user.id }, JWT_SECRET)
  res.status(200).json({
    token,
    user: { id: user.id, email: user.email, nickname: user.nickname },
  })
}
