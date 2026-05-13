import type { FastifyPluginAsync } from 'fastify'
import { AuthRepository } from './auth.repository'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { authenticate } from '../../plugins/authenticate'

export const authRoutes: FastifyPluginAsync = async (fastify) => {
  const repo = new AuthRepository()
  const service = new AuthService(repo, (payload) => fastify.jwt.sign(payload))
  const controller = new AuthController(service)

  fastify.post('/register', (req, reply) => controller.register(req, reply))
  fastify.post('/login', (req, reply) => controller.login(req, reply))
  fastify.get('/me', { preHandler: [authenticate] }, (req, reply) => controller.me(req, reply))
}
