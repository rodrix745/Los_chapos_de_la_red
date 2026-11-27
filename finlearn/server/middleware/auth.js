// Shared route protection. requireAuth verifies the Bearer token and loads the
// fresh user row into req.user; requireRole guards endpoints by role. Handlers
// must never verify tokens inline — wire these through app.js instead.
import jwt from 'jsonwebtoken'
import { eq } from 'drizzle-orm'
import { db } from '../settings/db.js'
import { users } from '../modules/users/schema.js'
import { JWT_SECRET } from '../settings/env.js'

const SESSION_ERROR = 'Invalid or expired session'

export async function requireAuth(req, res, next) {
  const [, token] = (req.headers.authorization ?? '').split(' ')
  let payload
  try {
    payload = jwt.verify(token, JWT_SECRET)
  } catch {
    return res.status(401).json({ message: SESSION_ERROR })
  }
  const [user] = await db
    .select({ id: users.id, email: users.email, nickname: users.nickname, role: users.role })
    .from(users)
    .where(eq(users.id, payload.sub))
  if (!user) {
    return res.status(401).json({ message: SESSION_ERROR })
  }
  req.user = user
  next()
}

// Usage: app.get('/api/admin/...', requireAuth, requireRole('admin'), handler)
// The role is read from req.user (fresh from the DB on every request), never
// from token claims, so a promoted or demoted user changes access without
// waiting for the token to expire.
export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You do not have permission to do that' })
    }
    next()
  }
}
