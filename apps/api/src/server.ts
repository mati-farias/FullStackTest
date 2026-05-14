import Fastify from "fastify";
import fastifyJwt from "@fastify/jwt";
import { registerSwagger } from "./plugins/swagger";
import { errorHandler } from "./plugins/error-handler";
import { authRoutes } from "./modules/auth/auth.routes";
import { documentRoutes } from "./modules/documents/document.routes";
import { transitionRoutes } from "./modules/transitions/transition.routes";
import { migrate } from "./db/migrate";
import { env } from "./config/env";
import cors from "@fastify/cors";

export async function buildApp() {
  const app = Fastify({
    logger: { level: env.NODE_ENV === "test" ? "silent" : "info" },
  });

  await app.register(cors, {
    origin: "http://localhost:5173",
  });

  await app.register(fastifyJwt, { secret: env.JWT_SECRET });

  await registerSwagger(app);

  app.setErrorHandler(errorHandler);

  app.get("/api/health", async () => ({ status: "ok" }));

  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(documentRoutes, { prefix: "/api/documents" });
  await app.register(transitionRoutes, { prefix: "/api/documents" });

  return app;
}

async function main(): Promise<void> {
  try {
    await migrate();
    const app = await buildApp();
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

void main();
