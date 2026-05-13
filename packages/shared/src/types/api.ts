export interface ApiError {
  message: string
  code: string
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
