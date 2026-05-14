import { db } from "../../db/client";
import type {
  Document,
  DocumentEvent,
  DocumentStatus,
  TransitionResult,
} from "@test/shared";
import postgres from "postgres";

interface DocumentRow {
  id: string;
  author_id: string;
  reviewer_id: string | null;
  title: string;
  content: string;
  status: DocumentStatus;
  review_comment: string | null;
  created_at: Date;
  updated_at: Date;
}

interface DocumentEventRow {
  id: string;
  document_id: string;
  actor_id: string;
  from_status: DocumentStatus;
  to_status: DocumentStatus;
  comment: string | null;
  created_at: Date;
}

function mapDocumentRow(row: DocumentRow): Document {
  return {
    id: row.id,
    authorId: row.author_id,
    reviewerId: row.reviewer_id,
    title: row.title,
    content: row.content,
    status: row.status,
    reviewComment: row.review_comment,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

function mapEventRow(row: DocumentEventRow): DocumentEvent {
  return {
    id: row.id,
    documentId: row.document_id,
    actorId: row.actor_id,
    fromStatus: row.from_status,
    toStatus: row.to_status,
    comment: row.comment,
    createdAt: row.created_at.toISOString(),
  };
}

export class TransitionRepository {
  async recordTransition(
    documentId: string,
    patch: Partial<Pick<Document, "status" | "reviewerId" | "reviewComment">>,
    event: Omit<DocumentEvent, "id" | "createdAt">,
  ): Promise<TransitionResult> {
    return await db.begin(async (tx) => {
      const updates: string[] = [];
      const params: (string | null)[] = [];
      let paramIndex = 1;

      if (patch.status !== undefined) {
        updates.push(`status = $${paramIndex}`);
        params.push(patch.status);
        paramIndex++;
      }

      if (patch.reviewerId !== undefined) {
        updates.push(`reviewer_id = $${paramIndex}`);
        params.push(patch.reviewerId);
        paramIndex++;
      }

      if (patch.reviewComment !== undefined) {
        updates.push(`review_comment = $${paramIndex}`);
        params.push(patch.reviewComment);
        paramIndex++;
      }

      updates.push(`updated_at = NOW()`);
      params.push(documentId);

      const updateSql = `
        UPDATE documents
        SET ${updates.join(", ")}
        WHERE id = $${paramIndex}
        RETURNING id, author_id, reviewer_id, title, content, status, review_comment, created_at, updated_at
      `;

      const docRows = await tx.unsafe<DocumentRow[]>(updateSql, params);
      const docRow = docRows[0];
      if (!docRow) throw new Error("Update failed to return a row");

      const eventRows = await tx<DocumentEventRow[]>`
        INSERT INTO document_events (document_id, actor_id, from_status, to_status, comment)
        VALUES (${documentId}, ${event.actorId}, ${event.fromStatus}, ${event.toStatus}, ${event.comment ?? null})
        RETURNING id, document_id, actor_id, from_status, to_status, comment, created_at
      `;
      const eventRow = eventRows[0];
      if (!eventRow) throw new Error("Insert event failed to return a row");

      return {
        document: mapDocumentRow(docRow),
        event: mapEventRow(eventRow),
      };
    });
  }

  async getHistory(documentId: string): Promise<DocumentEvent[]> {
    const rows = await db<DocumentEventRow[]>`
      SELECT id, document_id, actor_id, from_status, to_status, comment, created_at
      FROM document_events
      WHERE document_id = ${documentId}
      ORDER BY created_at ASC
    `;
    return rows.map(mapEventRow);
  }
}
