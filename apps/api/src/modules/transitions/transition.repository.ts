import type { Document, DocumentEvent, TransitionResult } from '@test/shared'

export class TransitionRepository {
  async recordTransition(
    _documentId: string,
    _patch: Partial<Pick<Document, 'status' | 'reviewerId' | 'reviewComment'>>,
    _event: Omit<DocumentEvent, 'id' | 'createdAt'>,
  ): Promise<TransitionResult> {
    // TODO: Atomically update the document row and insert a new event row.
    //       Use a database transaction — both writes succeed or both fail.
    //       The patch object contains only the fields to update on the document.
    //       Map DB rows back to Document and DocumentEvent shapes before returning.
    throw new Error('Not implemented')
  }

  async getHistory(_documentId: string): Promise<DocumentEvent[]> {
    // TODO: SELECT * FROM document_events WHERE document_id = documentId
    //       ORDER BY created_at ASC.
    //       Map rows to DocumentEvent shape (camelCase).
    throw new Error('Not implemented')
  }
}
