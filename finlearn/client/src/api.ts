const BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

function token() {
  return localStorage.getItem('token')
}

// Shape thrown when a response is not ok.
export interface ApiError {
  status: number
  data: { errors?: Record<string, string>; message?: string }
}

export function isApiError(error: unknown): error is ApiError {
  return typeof error === "object" && error !== null && "status" in error && "data" in error
}

export async function api<T>(path: string, options: { method?: string; body?: unknown; signal?: AbortSignal } = {}): Promise<T> {
  const headers: Record<string, string> = {}
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }
  const currentToken = token()
  if (currentToken) {
    headers.Authorization = `Bearer ${currentToken}`
  }
  const response = await fetch(`${BASE}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })
  const raw = await response.text()
  let data: unknown = raw
  try {
    data = JSON.parse(raw)
  } catch {
    // non-JSON responses (error pages, empty bodies) keep the raw text as data
  }
  if (!response.ok) {
    throw { status: response.status, data }
  }
  return data as T
}
