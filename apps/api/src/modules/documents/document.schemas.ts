import { z } from 'zod'

export const createDocumentSchema = z.object({
  title: z.string(),
  content: z.string(),
})

export const updateDocumentSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
})

export const documentFiltersSchema = z.object({
  status: z
    .enum(['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'WITHDRAWN'])
    .optional(),
  page: z.coerce.number().positive().optional(),
  pageSize: z.coerce.number().positive().max(100).optional(),
})

export type CreateDocumentBody = z.infer<typeof createDocumentSchema>
export type UpdateDocumentBody = z.infer<typeof updateDocumentSchema>
export type DocumentFiltersQuery = z.infer<typeof documentFiltersSchema>
