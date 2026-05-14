import { db } from "../../db/client";
import type {
  Document,
  DocumentFilters,
  DocumentStatus,
  UserRole,
  CreateDocumentDTO,
  UpdateDocumentDTO,
} from "@test/shared";

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

export class DocumentRepository {
  async findById(id: string): Promise<Document | null> {
    const rows = await db<DocumentRow[]>`
      SELECT id, author_id, reviewer_id, title, content, status, review_comment, created_at, updated_at
      FROM documents
      WHERE id = ${id}
      LIMIT 1
    `;
    return rows[0] ? mapDocumentRow(rows[0]) : null;
  }

  async findAllForUser(
    userId: string,
    role: UserRole,
    filters?: DocumentFilters,
  ): Promise<Document[]> {
    let whereClause = "";
    let limitClause = "";
    const params: string[] = [];

    if (role === "AUTHOR") {
      whereClause = "WHERE author_id = $1";
      params.push(userId);
    } else if (role === "REVIEWER") {
      whereClause = "WHERE (reviewer_id = $1 OR status = 'SUBMITTED')";
      params.push(userId);
    }

    if (filters?.status) {
      const paramIndex = params.length + 1;
      const op = whereClause ? "AND" : "WHERE";
      whereClause += ` ${op} status = $${paramIndex}`;
      params.push(filters.status);
    }

    if (filters?.page !== undefined && filters?.pageSize !== undefined) {
      const page = Math.max(filters.page, 1);
      const pageSize = Math.max(filters.pageSize, 1);
      const offset = (page - 1) * pageSize;

      limitClause = ` LIMIT ${pageSize} OFFSET ${offset}`;
    }

    const sql = `
    SELECT id, author_id, reviewer_id, title, content, status, review_comment, created_at, updated_at
    FROM documents
    ${whereClause}
    ORDER BY created_at DESC
    ${limitClause}
  `;

    const rows = await db.unsafe<DocumentRow[]>(sql, params);

    return rows.map(mapDocumentRow);
  }

  async create(authorId: string, dto: CreateDocumentDTO): Promise<Document> {
    const rows = await db<DocumentRow[]>`
      INSERT INTO documents (author_id, title, content, status)
      VALUES (${authorId}, ${dto.title}, ${dto.content}, 'DRAFT')
      RETURNING id, author_id, reviewer_id, title, content, status, review_comment, created_at, updated_at
    `;
    const row = rows[0];
    if (!row) throw new Error("Insert failed to return a row");
    return mapDocumentRow(row);
  }

  async update(id: string, dto: UpdateDocumentDTO): Promise<Document> {
    const updates: string[] = [];
    const params: string[] = [];
    let paramIndex = 1;

    if (dto.title !== undefined) {
      updates.push(`title = $${paramIndex}`);
      params.push(dto.title);
      paramIndex++;
    }

    if (dto.content !== undefined) {
      updates.push(`content = $${paramIndex}`);
      params.push(dto.content);
      paramIndex++;
    }

    updates.push(`updated_at = NOW()`);
    params.push(id);

    const sql = `
      UPDATE documents
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING id, author_id, reviewer_id, title, content, status, review_comment, created_at, updated_at
    `;

    const rows = await db.unsafe<DocumentRow[]>(sql, params);
    const row = rows[0];
    if (!row) throw new Error("Update failed to return a row");
    return mapDocumentRow(row);
  }
}
