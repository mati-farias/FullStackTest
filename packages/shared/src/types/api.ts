import type { DomainErrorCode } from '../errors/domain-errors'

export interface ApiError {
  message: string
  code: DomainErrorCode | 'INTERNAL_ERROR'
  statusCode: number
}

export interface ApiResponse<T> {
  data: T
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
