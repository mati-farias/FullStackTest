import type { ApiError } from '@test/shared'
import { useAuthStore } from '../store/auth.store'

const API_BASE =
  (import.meta.env['VITE_API_URL'] as string | undefined) ?? 'http://localhost:3000'

function clearAuth(): void {
  try {
    localStorage.removeItem('auth-store')
  } catch {
    // storage may be unavailable; silent fail is acceptable here
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = useAuthStore.getState().token
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
    if (response.status === 401) {
      clearAuth()
      window.location.replace('/login')
      throw { message: 'Session expired', code: 'UNAUTHORIZED', statusCode: 401 } as ApiError
    }

    let error: ApiError
    try {
      error = (await response.json()) as ApiError
    } catch {
      error = {
        message: `Request failed with status ${response.status}`,
        code: 'INTERNAL_ERROR',
        statusCode: response.status,
      }
    }
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
