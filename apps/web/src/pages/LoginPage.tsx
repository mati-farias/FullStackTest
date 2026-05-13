import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'
import { apiClient } from '../api/client'
import type { ApiResponse, AuthPayload } from '@test/shared'

export function LoginPage(): JSX.Element {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { data } = await apiClient.post<ApiResponse<AuthPayload>>('/api/auth/login', {
        email,
        password,
      })
      login(data)
      void navigate('/documents')
    } catch (err: unknown) {
      const apiErr = err as { message?: string }
      setError(apiErr.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 24 }}>
      <h1>Sign in</h1>
      <form onSubmit={(e) => void handleSubmit(e)}>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: 4 }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: 4 }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        {error !== null && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '10px', cursor: loading ? 'not-allowed' : 'pointer' }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p style={{ marginTop: 16, textAlign: 'center' }}>
        No account? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}
