import type { FastifyRequest, FastifyReply } from 'fastify'
import type { AuthService } from './auth.service'
import { registerSchema, loginSchema } from './auth.schemas'

export class AuthController {
  constructor(private readonly service: AuthService) {}

  async register(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const dto = registerSchema.parse(request.body)
    const result = await this.service.register(dto)
    void reply.code(201).send({ data: result })
  }

  async login(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const dto = loginSchema.parse(request.body)
    const result = await this.service.login(dto)
    void reply.send({ data: result })
  }

  async me(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const user = await this.service.getMe(request.user.id)
    void reply.send({ data: user })
  }
}
