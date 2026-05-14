import type { FastifyRequest, FastifyReply } from "fastify";
import type { DocumentService } from "./document.service";
import {
  createDocumentSchema,
  updateDocumentSchema,
  documentFiltersSchema,
} from "./document.schemas";

export class DocumentController {
  constructor(private readonly service: DocumentService) {}

  async list(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const filters = documentFiltersSchema.parse(request.query);

    const documents = await this.service.listDocuments(
      request.user.id,
      request.user.role,
      filters,
    );

    void reply.send({ data: documents });
  }

  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const dto = createDocumentSchema.parse(request.body);

    const document = await this.service.createDocument(
      request.user.id,
      request.user.role,
      dto,
    );

    void reply.code(201).send({ data: document });
  }

  async getOne(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = request.params as { id: string };

    const document = await this.service.getDocument(
      request.user.id,
      request.user.role,
      id,
    );

    void reply.send({ data: document });
  }

  async update(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { id } = request.params as { id: string };
    const dto = updateDocumentSchema.parse(request.body);

    const document = await this.service.editDocument(
      request.user.id,
      request.user.role,
      id,
      dto,
    );

    void reply.send({ data: document });
  }
}
