import type {
  Document,
  CreateDocumentDTO,
  UpdateDocumentDTO,
  DocumentFilters,
} from '@test/shared'

export interface UseDocumentsResult {
  documents: Document[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useDocuments(_filters?: DocumentFilters): UseDocumentsResult {
  // TODO: Fetch GET /api/documents with filters serialised as query params.
  //       Return { documents, loading, error, refetch }.
  //       Re-fetch when filters change (useEffect with filters as dependency).
  throw new Error('Not implemented')
}

export interface UseDocumentResult {
  document: Document | null
  loading: boolean
  error: string | null
  refetch: () => void
  update: (dto: UpdateDocumentDTO) => Promise<void>
}

export function useDocument(_id: string): UseDocumentResult {
  // TODO: Fetch GET /api/documents/:id.
  //       update(dto) calls PATCH /api/documents/:id and refreshes.
  //       Return { document, loading, error, refetch, update }.
  throw new Error('Not implemented')
}

export interface UseCreateDocumentResult {
  create: (dto: CreateDocumentDTO) => Promise<Document>
  loading: boolean
  error: string | null
}

export function useCreateDocument(): UseCreateDocumentResult {
  // TODO: Return { create, loading, error }.
  //       create(dto) calls POST /api/documents.
  throw new Error('Not implemented')
}
