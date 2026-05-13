import { db } from '../../db/client'

export interface UserRow {
  id: string
  email: string
  password_hash: string
  name: string
  role: string
  created_at: Date
  updated_at: Date
}

interface CreateUserDTO {
  email: string
  passwordHash: string
  name: string
  role: string
}

export class AuthRepository {
  async findByEmail(email: string): Promise<UserRow | null> {
    const rows = await db<UserRow[]>`
      SELECT id, email, password_hash, name, role, created_at, updated_at
      FROM users
      WHERE email = ${email}
      LIMIT 1
    `
    return rows[0] ?? null
  }

  async create(dto: CreateUserDTO): Promise<UserRow> {
    const rows = await db<UserRow[]>`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (${dto.email}, ${dto.passwordHash}, ${dto.name}, ${dto.role})
      RETURNING id, email, password_hash, name, role, created_at, updated_at
    `
    const row = rows[0]
    if (!row) throw new Error('Insert failed to return a row')
    return row
  }

  async findById(id: string): Promise<UserRow | null> {
    const rows = await db<UserRow[]>`
      SELECT id, email, password_hash, name, role, created_at, updated_at
      FROM users
      WHERE id = ${id}
      LIMIT 1
    `
    return rows[0] ?? null
  }
}
