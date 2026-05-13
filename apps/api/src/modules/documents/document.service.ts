import type {
  Document,
  DocumentFilters,
  UserRole,
  CreateDocumentDTO,
  UpdateDocumentDTO,
} from '@test/shared'
import type { DocumentRepository } from './document.repository'
import { NotFoundError, ForbiddenError } from '../../shared/errors'

export class DocumentService {
  constructor(private readonly repo: DocumentRepository) {}

  async getDocument(
    _requesterId: string,
    _requesterRole: UserRole,
    _documentId: string,
  ): Promise<Document> {
    // TODO: Fetch document by id → NotFoundError if missing.
    //       Check visibility based on role:
    //         ADMIN    : always allowed
    //         AUTHOR   : allowed only if doc.authorId === requesterId
    //         REVIEWER : allowed if doc.reviewerId === requesterId OR doc.status === 'SUBMITTED'
    //       → ForbiddenError if the requester cannot see this document.
    throw new Error('Not implemented')
  }

  async listDocuments(
    _requesterId: string,
    _requesterRole: UserRole,
    _filters?: DocumentFilters,
  ): Promise<Document[]> {
    // TODO: Delegate to repo.findAllForUser — it handles role-based filtering.
    //       Pass through optional filters for status and pagination.
    throw new Error('Not implemented')
  }

  async createDocument(
    _authorId: string,
    _role: UserRole,
    _dto: CreateDocumentDTO,
  ): Promise<Document> {
    // TODO: Only AUTHOR and ADMIN roles may create documents.
    //       → ForbiddenError if role is REVIEWER.
    //       Delegate to repo.create and return the created document.
    throw new Error('Not implemented')
  }

  async editDocument(
    _requesterId: string,
    _role: UserRole,
    _documentId: string,
    _dto: UpdateDocumentDTO,
  ): Promise<Document> {
    // TODO: Fetch document → NotFoundError if missing.
    //       Only the document's author (or ADMIN) may edit → ForbiddenError if not.
    //       Document must be in DRAFT status to be editable.
    //       → ValidationError with code DOCUMENT_NOT_EDITABLE if status !== 'DRAFT'.
    //       Delegate to repo.update and return the updated document.
    throw new Error('Not implemented')
  }
}
