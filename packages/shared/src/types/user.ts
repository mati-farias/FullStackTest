export type UserRole = 'AUTHOR' | 'REVIEWER' | 'ADMIN'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
}

export interface AuthPayload {
  token: string
  user: User
}
