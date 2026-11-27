// JSON error contract: throw ApiError for known failures; anything else is a
// generic 500 — internals never reach the client.
export class ApiError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

export function notFound(req, res, next) {
  next(new ApiError(404, 'Not found'))
}

// Must be the last middleware in app.js.
export function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message })
  }
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' })
  }
  console.error(err)
  return res.status(500).json({ message: 'Something went wrong' })
}
