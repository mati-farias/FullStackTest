import type {
  Document,
  DocumentFilters,
  UserRole,
  CreateDocumentDTO,
  UpdateDocumentDTO,
} from '@test/shared'

export class DocumentRepository {
  async findById(_id: string): Promise<Document | null> {
    // TODO: SELECT the document row for the given id.
    //       Map snake_case columns to camelCase Document shape.
    //       Return null if no row is found.
    throw new Error('Not implemented')
  }

  async findAllForUser(
    _userId: string,
    _role: UserRole,
    _filters?: DocumentFilters,
  ): Promise<Document[]> {
    // TODO: Build a WHERE clause based on role:
    //       - AUTHOR   : WHERE author_id = userId
    //       - REVIEWER : WHERE reviewer_id = userId OR status = 'SUBMITTED'
    //       - ADMIN    : no additional filter
    //       Apply optional filters.status as an extra WHERE condition.
    //       Apply filters.page and filters.pageSize as LIMIT / OFFSET.
    //       Return rows mapped to the Document shape (camelCase).
    throw new Error('Not implemented')
  }

  async create(_authorId: string, _dto: CreateDocumentDTO): Promise<Document> {
    // TODO: INSERT a row with author_id = authorId, status = 'DRAFT',
    //       title and content from dto (empty strings are valid at creation).
    //       Use RETURNING to get the inserted row and map it to Document shape.
    throw new Error('Not implemented')
  }

  async update(_id: string, _dto: UpdateDocumentDTO): Promise<Document> {
    // TODO: UPDATE only the fields present in dto (partial update).
    //       Always set updated_at = NOW().
    //       Use RETURNING to get the updated row and map it to Document shape.
    throw new Error('Not implemented')
  }
}
