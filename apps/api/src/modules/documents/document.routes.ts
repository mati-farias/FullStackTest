import type { FastifyPluginAsync } from 'fastify'
import { DocumentRepository } from './document.repository'
import { DocumentService } from './document.service'
import { DocumentController } from './document.controller'
import { authenticate } from '../../plugins/authenticate'

export const documentRoutes: FastifyPluginAsync = async (fastify) => {
  const repo = new DocumentRepository()
  const service = new DocumentService(repo)
  const controller = new DocumentController(service)

  fastify.addHook('preHandler', authenticate)

  // GET  /api/documents
  fastify.get('/', (req, reply) => controller.list(req, reply))

  // POST /api/documents
  fastify.post('/', (req, reply) => controller.create(req, reply))

  // GET  /api/documents/:id
  fastify.get('/:id', (req, reply) => controller.getOne(req, reply))

  // PATCH /api/documents/:id
  fastify.patch('/:id', (req, reply) => controller.update(req, reply))
}
