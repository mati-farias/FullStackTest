export type DocumentStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'WITHDRAWN'

export interface Document {
  id: string
  authorId: string
  reviewerId: string | null
  title: string
  content: string
  status: DocumentStatus
  reviewComment: string | null
  createdAt: string
  updatedAt: string
}

export interface DocumentEvent {
  id: string
  documentId: string
  actorId: string
  fromStatus: DocumentStatus
  toStatus: DocumentStatus
  comment: string | null
  createdAt: string
}

export interface CreateDocumentDTO {
  title: string
  content: string
}

export interface UpdateDocumentDTO {
  title?: string
  content?: string
}

export interface TransitionRequest {
  targetStatus: DocumentStatus
  comment?: string
  reviewerId?: string
}

export interface TransitionResult {
  document: Document
  event: DocumentEvent
}

export interface DocumentFilters {
  status?: DocumentStatus
  page?: number
  pageSize?: number
}
