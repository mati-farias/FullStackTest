import type { FastifyPluginAsync } from "fastify";
import { authenticate } from "../../plugins/authenticate";
import { DocumentRepository } from "../documents/document.repository";
import { TransitionRepository } from "./transition.repository";
import { TransitionService } from "./transition.service";
import { AuthRepository } from "../auth/auth.repository";

export const transitionRoutes: FastifyPluginAsync = async (fastify) => {
  const documentRepo = new DocumentRepository();
  const transitionRepo = new TransitionRepository();
  const authRepo = new AuthRepository();
  const service = new TransitionService(documentRepo, transitionRepo, authRepo);

  fastify.addHook("preHandler", authenticate);

  // POST /api/documents/:id/transitions
  // Body: TransitionRequest (targetStatus, comment?, reviewerId?)
  // TODO: parse and validate body, call TransitionService.execute, return 200 { data: { document, event } }
  fastify.post("/:id/transitions", async (_request, _reply) => {
    throw new Error("Not implemented");
  });

  // GET /api/documents/:id/history
  // TODO: call TransitionService.getHistory, return 200 { data: events }
  fastify.get("/:id/history", async (_request, _reply) => {
    throw new Error("Not implemented");
  });
};
