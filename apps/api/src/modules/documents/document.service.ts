import type {
  Document,
  DocumentFilters,
  UserRole,
  CreateDocumentDTO,
  UpdateDocumentDTO,
} from "@test/shared";
import type { DocumentRepository } from "./document.repository";
import {
  NotFoundError,
  ForbiddenError,
  DocumentNotEditableError,
} from "../../shared/errors";

export class DocumentService {
  constructor(private readonly repo: DocumentRepository) {}

  async getDocument(
    requesterId: string,
    requesterRole: UserRole,
    documentId: string,
  ): Promise<Document> {
    const document = await this.repo.findById(documentId);
    if (!document) {
      throw new NotFoundError("Document not found");
    }

    if (requesterRole === "ADMIN") {
      return document;
    }

    if (requesterRole === "AUTHOR") {
      if (document.authorId !== requesterId) {
        throw new ForbiddenError("Access denied");
      }
      return document;
    }

    if (requesterRole === "REVIEWER") {
      const isAssignedReviewer = document.reviewerId === requesterId;
      const isSubmitted = document.status === "SUBMITTED";
      if (!isAssignedReviewer && !isSubmitted) {
        throw new ForbiddenError("Access denied");
      }
      return document;
    }

    throw new ForbiddenError("Access denied");
  }

  async listDocuments(
    requesterId: string,
    requesterRole: UserRole,
    filters?: DocumentFilters,
  ): Promise<Document[]> {
    return this.repo.findAllForUser(requesterId, requesterRole, filters);
  }

  async createDocument(
    authorId: string,
    role: UserRole,
    dto: CreateDocumentDTO,
  ): Promise<Document> {
    if (role === "REVIEWER") {
      throw new ForbiddenError("Reviewers may not create documents");
    }

    return this.repo.create(authorId, dto);
  }

  async editDocument(
    requesterId: string,
    role: UserRole,
    documentId: string,
    dto: UpdateDocumentDTO,
  ): Promise<Document> {
    const document = await this.repo.findById(documentId);
    if (!document) {
      throw new NotFoundError("Document not found");
    }

    if (role !== "ADMIN" && document.authorId !== requesterId) {
      throw new ForbiddenError(
        "Only the document author or admin may edit this document",
      );
    }

    if (document.status !== "DRAFT") {
      throw new DocumentNotEditableError();
    }

    return this.repo.update(documentId, dto);
  }
}
