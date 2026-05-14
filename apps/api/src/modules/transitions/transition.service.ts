import {
  type Document,
  type DocumentEvent,
  type DocumentStatus,
  type TransitionResult,
  type UserRole,
  findTransitionRule,
  canTransition,
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
   * TODO: Execute a status transition on a document.
   *
   * Enforce these checks IN ORDER — fail fast, return a typed error for each:
   *
   *  1. Document exists → NotFoundError if not
   *  2. Transition is defined in ALLOWED_TRANSITIONS → InvalidTransitionError if not
   *     (use findTransitionRule from @test/shared — do not duplicate the table)
   *  3. Actor role is allowed by the rule → ForbiddenError if not
   *  4. If rule.requiresOwner: actor must be the document's authorId (or ADMIN)
   *     → ForbiddenError if not
   *  5. If rule.requiresAssignedReviewer: actor must be the document's reviewerId (or ADMIN)
   *     → ForbiddenError if not
   *  6. If rule.requiresComment: input.comment must be non-empty → ValidationError if not
   *  7. If rule.requiresReviewerId: input.reviewerId must refer to a real REVIEWER user
   *     → ValidationError if missing, NotFoundError/ForbiddenError if invalid
   *  8. Domain-specific pre-conditions:
   *     - DRAFT → SUBMITTED: document.title and document.content must be non-empty
   *       → ValidationError if not
   *
   *  After all checks pass:
   *  - Build the patch object (which fields change on the document row)
   *  - Build the event object
   *  - Call transitionRepo.recordTransition() — it handles the DB transaction
   *  - Return { document, event }
   *
   * Patch rules per transition:
   *   → UNDER_REVIEW : set reviewerId = input.reviewerId
   *   → APPROVED     : set reviewComment = input.comment
   *   → REJECTED     : set reviewComment = input.comment
   *   → DRAFT (from REJECTED) : clear reviewerId and reviewComment (set to null)
   *   all transitions : set status = targetStatus
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

    const isOwner =
      input.actorRole === "ADMIN" || document.authorId === input.actorId;
    const isAssignedReviewer =
      input.actorRole === "ADMIN" || document.reviewerId === input.actorId;

    if (
      !canTransition(
        document.status,
        input.targetStatus,
        input.actorRole,
        isOwner,
        isAssignedReviewer,
      )
    ) {
      throw new ForbiddenError("Transition not permitted");
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
   * TODO: Return the full event history for a document.
   *       Verify the requester can see the document before returning history.
   *       Reuse document visibility rules (same as DocumentService.getDocument).
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
