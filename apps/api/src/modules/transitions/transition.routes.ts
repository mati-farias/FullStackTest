import type { FastifyPluginAsync } from "fastify";
import { authenticate } from "../../plugins/authenticate";
import { DocumentRepository } from "../documents/document.repository";
import { TransitionRepository } from "./transition.repository";
import { TransitionService } from "./transition.service";
import { AuthRepository } from "../auth/auth.repository";
import { transitionRequestSchema } from "./transition.schemas";

export const transitionRoutes: FastifyPluginAsync = async (fastify) => {
  const documentRepo = new DocumentRepository();
  const transitionRepo = new TransitionRepository();
  const authRepo = new AuthRepository();
  const service = new TransitionService(documentRepo, transitionRepo, authRepo);

  fastify.addHook("preHandler", authenticate);

  fastify.post("/:id/transitions", async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = transitionRequestSchema.parse(request.body);

    const result = await service.execute({
      documentId: id,
      targetStatus: body.targetStatus,
      actorId: request.user.id,
      actorRole: request.user.role,
      comment: body.comment,
      reviewerId: body.reviewerId,
    });

    void reply.send({ data: result });
  });

  fastify.get("/:id/history", async (request, reply) => {
    const { id } = request.params as { id: string };

    const events = await service.getHistory(
      id,
      request.user.id,
      request.user.role,
    );

    void reply.send({ data: events });
  });
};
