import bcrypt from 'bcryptjs'
import type { AuthPayload, User } from '@test/shared'
import type { RegisterDTO, LoginDTO } from './auth.schemas'
import type { AuthRepository, UserRow } from './auth.repository'
import { UnauthorizedError, NotFoundError, ValidationError } from '../../shared/errors'

export class AuthService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly jwtSign: (payload: object) => string,
  ) {}

  async register(dto: RegisterDTO): Promise<AuthPayload> {
    const existing = await this.repo.findByEmail(dto.email)
    if (existing) {
      throw new ValidationError('Email already in use')
    }
    const passwordHash = await bcrypt.hash(dto.password, 10)
    const row = await this.repo.create({
      email: dto.email,
      passwordHash,
      name: dto.name,
      role: dto.role,
    })
    return this.toPayload(row)
  }

  async login(dto: LoginDTO): Promise<AuthPayload> {
    const row = await this.repo.findByEmail(dto.email)
    if (!row) {
      throw new UnauthorizedError('Invalid credentials')
    }
    const valid = await bcrypt.compare(dto.password, row.password_hash)
    if (!valid) {
      throw new UnauthorizedError('Invalid credentials')
    }
    return this.toPayload(row)
  }

  async getMe(userId: string): Promise<User> {
    const row = await this.repo.findById(userId)
    if (!row) {
      throw new NotFoundError('User not found')
    }
    return this.rowToUser(row)
  }

  private toPayload(row: UserRow): AuthPayload {
    const user = this.rowToUser(row)
    const token = this.jwtSign({ sub: user.id, role: user.role })
    return { token, user }
  }

  private rowToUser(row: UserRow): User {
    return {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role as User['role'],
      createdAt: row.created_at.toISOString(),
    }
  }
}
