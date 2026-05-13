import type { FastifyInstance } from 'fastify'
import swagger from '@fastify/swagger'
import swaggerUi from '@fastify/swagger-ui'

export async function registerSwagger(app: FastifyInstance): Promise<void> {
  await app.register(swagger, {
    openapi: {
      info: {
        title: 'Document Approval Workflow API',
        description: 'API for managing document approval workflows',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  })

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
    },
  })
}
