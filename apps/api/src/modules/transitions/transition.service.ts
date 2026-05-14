import {
  type Document,
  type DocumentEvent,
  type DocumentStatus,
  type TransitionResult,
  type UserRole,
  findTransitionRule,
} from "@test/shared";
import type { DocumentRepository } from "../documents/document.repository";
import type { TransitionRepository } from "./transition.repository";
import { AuthRepository } from "../auth/auth.repository";
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
  InvalidTransitionError,
} from "../../shared/errors";

export interface ExecuteTransitionInput {
  documentId: string;
  targetStatus: DocumentStatus;
  actorId: string;
  actorRole: UserRole;
  comment?: string;
  reviewerId?: string;
}

export class TransitionService {
  constructor(
    private readonly documentRepo: DocumentRepository,
    private readonly transitionRepo: TransitionRepository,
    private readonly authRepo: AuthRepository,
  ) {}

  /**
   * Executes a status transition on a document.
   *
   * Checks are intentionally evaluated in order so invalid requests return
   * deterministic, typed domain errors.
   */
  async execute(input: ExecuteTransitionInput): Promise<TransitionResult> {
    const document = await this.documentRepo.findById(input.documentId);

    if (!document) {
      throw new NotFoundError("Document not found");
    }

    const rule = findTransitionRule(document.status, input.targetStatus);

    if (!rule) {
      throw new InvalidTransitionError(document.status, input.targetStatus);
    }

    if (!rule.allowedRoles.includes(input.actorRole)) {
      throw new ForbiddenError("Actor role is not allowed for this transition");
    }

    if (
      rule.requiresOwner &&
      input.actorRole !== "ADMIN" &&
      document.authorId !== input.actorId
    ) {
      throw new ForbiddenError(
        "Only the document author or admin may perform this transition",
      );
    }

    if (
      rule.requiresAssignedReviewer &&
      input.actorRole !== "ADMIN" &&
      document.reviewerId !== input.actorId
    ) {
      throw new ForbiddenError(
        "Only the assigned reviewer or admin may perform this transition",
      );
    }

    if (rule.requiresComment && !input.comment?.trim()) {
      throw new ValidationError("Comment is required for this transition");
    }

    let reviewerId: string | undefined;

    if (rule.requiresReviewerId) {
      if (!input.reviewerId?.trim()) {
        throw new ValidationError("ReviewerId is required for this transition");
      }

      const reviewer = await this.authRepo.findById(input.reviewerId);

      if (!reviewer) {
        throw new NotFoundError("Reviewer not found");
      }

      if (reviewer.role !== "REVIEWER") {
        throw new ForbiddenError("Reviewer must have REVIEWER role");
      }

      reviewerId = reviewer.id;
    }

    if (
      document.status === "DRAFT" &&
      input.targetStatus === "SUBMITTED" &&
      (!document.title.trim() || !document.content.trim())
    ) {
      throw new ValidationError(
        "Document title and content are required before submission",
      );
    }

    const patch: Partial<
      Pick<Document, "status" | "reviewerId" | "reviewComment">
    > = {
      status: input.targetStatus,
    };

    if (input.targetStatus === "UNDER_REVIEW") {
      patch.reviewerId = reviewerId;
    }

    if (
      input.targetStatus === "APPROVED" ||
      input.targetStatus === "REJECTED"
    ) {
      patch.reviewComment = input.comment ?? null;
    }

    if (document.status === "REJECTED" && input.targetStatus === "DRAFT") {
      patch.reviewerId = null;
      patch.reviewComment = null;
    }

    const event: Omit<DocumentEvent, "id" | "createdAt"> = {
      documentId: input.documentId,
      actorId: input.actorId,
      fromStatus: document.status,
      toStatus: input.targetStatus,
      comment: input.comment ?? null,
    };

    return this.transitionRepo.recordTransition(input.documentId, patch, event);
  }

  /**
   * Returns the full event history for a document after applying the same
   * visibility rules used by DocumentService.getDocument.
   */
  async getHistory(
    documentId: string,
    requesterId: string,
    requesterRole: UserRole,
  ): Promise<DocumentEvent[]> {
    const document = await this.documentRepo.findById(documentId);

    if (!document) {
      throw new NotFoundError("Document not found");
    }

    if (requesterRole === "ADMIN") {
      return this.transitionRepo.getHistory(documentId);
    }

    if (requesterRole === "AUTHOR") {
      if (document.authorId !== requesterId) {
        throw new ForbiddenError("Access denied");
      }

      return this.transitionRepo.getHistory(documentId);
    }

    if (requesterRole === "REVIEWER") {
      const isAssignedReviewer = document.reviewerId === requesterId;
      const isSubmitted = document.status === "SUBMITTED";

      if (!isAssignedReviewer && !isSubmitted) {
        throw new ForbiddenError("Access denied");
      }

      return this.transitionRepo.getHistory(documentId);
    }

    throw new ForbiddenError("Access denied");
  }
}
