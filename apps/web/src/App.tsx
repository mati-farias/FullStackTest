import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/auth.store'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DocumentsPage } from './pages/DocumentsPage'
import { DocumentDetailPage } from './pages/DocumentDetailPage'

function ProtectedRoute({ children }: { children: JSX.Element }): JSX.Element {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/login" replace />
  return children
}

export function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <DocumentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/:id"
          element={
            <ProtectedRoute>
              <DocumentDetailPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/documents" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
