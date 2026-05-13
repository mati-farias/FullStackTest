import type { FastifyRequest, FastifyReply } from 'fastify'
import type { DocumentService } from './document.service'
import {
  createDocumentSchema,
  updateDocumentSchema,
  documentFiltersSchema,
} from './document.schemas'

export class DocumentController {
  constructor(private readonly service: DocumentService) {}

  async list(_request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    // TODO: Parse query string with documentFiltersSchema.
    //       Call service.listDocuments(request.user.id, request.user.role, filters).
    //       Return 200 { data: documents }.
    throw new Error('Not implemented')
  }

  async create(_request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    // TODO: Parse request.body with createDocumentSchema.
    //       Call service.createDocument(request.user.id, request.user.role, dto).
    //       Return 201 { data: document }.
    throw new Error('Not implemented')
  }

  async getOne(_request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    // TODO: Extract id from (request.params as { id: string }).id.
    //       Call service.getDocument(request.user.id, request.user.role, id).
    //       Return 200 { data: document }.
    throw new Error('Not implemented')
  }

  async update(_request: FastifyRequest, _reply: FastifyReply): Promise<void> {
    // TODO: Extract id from (request.params as { id: string }).id.
    //       Parse request.body with updateDocumentSchema.
    //       Call service.editDocument(request.user.id, request.user.role, id, dto).
    //       Return 200 { data: document }.
    throw new Error('Not implemented')
  }
}
