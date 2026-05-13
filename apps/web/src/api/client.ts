import type { ApiError } from '@test/shared'

const API_BASE =
  (import.meta.env['VITE_API_URL'] as string | undefined) ?? 'http://localhost:3000'

function getToken(): string | null {
  try {
    const stored = localStorage.getItem('auth-store')
    if (!stored) return null
    const parsed = JSON.parse(stored) as { state?: { token?: string | null } }
    return parsed.state?.token ?? null
  } catch {
    return null
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers as Record<string, string> | undefined),
    },
  })

  if (!response.ok) {
    const error = (await response.json()) as ApiError
    throw error
  }

  return response.json() as Promise<T>
}

export const apiClient = {
  get: <T>(path: string): Promise<T> => request<T>(path),
  post: <T>(path: string, body: unknown): Promise<T> =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown): Promise<T> =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
}
