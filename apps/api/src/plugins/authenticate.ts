import type { FastifyRequest, FastifyReply } from 'fastify'
import type { UserRole } from '@test/shared'
import { UnauthorizedError } from '../shared/errors'

declare module 'fastify' {
  interface FastifyRequest {
    user: {
      id: string
      role: UserRole
    }
  }
}

export async function authenticate(
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> {
  try {
    const payload = await request.jwtVerify<{ sub: string; role: UserRole }>()
    request.user = {
      id: payload.sub,
      role: payload.role,
    }
  } catch {
    throw new UnauthorizedError()
  }
}
