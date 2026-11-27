// GET /api/me. requireAuth has already verified the session and loaded the
// fresh user row, so the handler only returns it.
export async function profile(req, res) {
  res.status(200).json(req.user)
}
