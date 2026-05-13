import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth.store'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps): JSX.Element {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  function handleLogout(): void {
    logout()
    void navigate('/login', { replace: true })
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: 56,
          borderBottom: '1px solid #e0e0e0',
          background: '#fff',
          flexShrink: 0,
        }}
      >
        <Link
          to="/documents"
          style={{
            fontWeight: 600,
            fontSize: '0.95rem',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          Document Approval
        </Link>

        {user !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span
              style={{ fontSize: '0.875rem', color: '#555' }}
              aria-label={`Signed in as ${user.name} (${user.role})`}
            >
              {user.name}
              <span
                style={{
                  marginLeft: 6,
                  fontSize: '0.75rem',
                  padding: '2px 6px',
                  borderRadius: 3,
                  background: '#e8e8e8',
                  color: '#333',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  fontWeight: 600,
                }}
              >
                {user.role}
              </span>
            </span>
            <button
              onClick={handleLogout}
              style={{
                fontSize: '0.875rem',
                padding: '4px 12px',
                cursor: 'pointer',
                borderRadius: 4,
                border: '1px solid #ccc',
                background: 'transparent',
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </header>

      <main
        style={{
          flex: 1,
          padding: '32px 24px',
          maxWidth: 960,
          width: '100%',
          margin: '0 auto',
        }}
      >
        {children}
      </main>
    </div>
  )
}
