import { DomainErrorCode } from '@test/shared'

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: DomainErrorCode,
    public readonly statusCode: number,
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, DomainErrorCode.NOT_FOUND, 404)
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, DomainErrorCode.FORBIDDEN, 403)
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, DomainErrorCode.UNAUTHORIZED, 401)
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, DomainErrorCode.VALIDATION_ERROR, 422)
  }
}

export class InvalidTransitionError extends AppError {
  constructor(from: string, to: string) {
    super(
      `Transition from ${from} to ${to} is not allowed`,
      DomainErrorCode.INVALID_TRANSITION,
      409,
    )
  }
}
