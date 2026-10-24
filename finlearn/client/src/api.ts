const BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

function token() {
  return localStorage.getItem('token')
}

export async function api<T>(path: string, options: { method?: string; body?: unknown; signal?: AbortSignal } = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const currentToken = token()
  if (currentToken) {
    headers.Authorization = `Bearer ${currentToken}`
  }
  const response = await fetch(`${BASE}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })
  const data = await response.json()
  if (!response.ok) {
    throw { status: response.status, data }
  }
  return data as T
}
