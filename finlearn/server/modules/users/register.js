import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { db } from '../../db.js'
import { users } from './schema.js'

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret'

export async function register(req, res) {
  const { email, nickname, password } = req.body
  const passwordHash = await bcrypt.hash(password, 10)
  try {
    const [user] = await db
      .insert(users)
      .values({ email, nickname, password: passwordHash })
      .returning({ id: users.id, email: users.email, nickname: users.nickname })
    const token = jwt.sign({ sub: user.id }, JWT_SECRET)
    res.status(201).json({ token, user })
  } catch (err) {
    // Drizzle wraps the pg error, so the unique-violation code may sit in the cause.
    if (err.code === '23505' || err.cause?.code === '23505') {
      return res.status(409).json({ message: 'That email is already registered' })
    }
    throw err
  }
}
