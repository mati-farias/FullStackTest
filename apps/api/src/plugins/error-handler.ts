import type { FastifyError, FastifyRequest, FastifyReply } from 'fastify'
import { ZodError } from 'zod'
import { AppError } from '../shared/errors'
import type { ApiError } from '@test/shared'

export function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
): void {
  if (error instanceof AppError) {
    const body: ApiError = {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    }
    void reply.code(error.statusCode).send(body)
    return
  }

  if (error instanceof ZodError) {
    const body: ApiError = {
      message: error.errors
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join('; '),
      code: 'VALIDATION_ERROR',
      statusCode: 422,
    }
    void reply.code(422).send(body)
    return
  }

  request.log.error(error)
  const body: ApiError = {
    message: 'Internal server error',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
  }
  void reply.code(500).send(body)
}
