import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthPayload } from '@test/shared'

interface AuthState {
  user: User | null
  token: string | null
  login: (payload: AuthPayload) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (payload) => set({ user: payload.user, token: payload.token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-store' },
  ),
)
