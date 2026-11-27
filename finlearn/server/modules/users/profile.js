export async function profile(req, res) {
  res.status(200).json(req.user)
}
