import {
  type Document,
  type DocumentEvent,
  type DocumentStatus,
  type TransitionResult,
  type UserRole,
  findTransitionRule,
  canTransition,
} from '@test/shared'
import type { DocumentRepository } from '../documents/document.repository'
import type { TransitionRepository } from './transition.repository'
import {
  NotFoundError,
  ForbiddenError,
  ValidationError,
  InvalidTransitionError,
} from '../../shared/errors'

export interface ExecuteTransitionInput {
  documentId: string
  targetStatus: DocumentStatus
  actorId: string
  actorRole: UserRole
  comment?: string
  reviewerId?: string
}

export class TransitionService {
  constructor(
    private readonly documentRepo: DocumentRepository,
    private readonly transitionRepo: TransitionRepository,
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
  async execute(_input: ExecuteTransitionInput): Promise<TransitionResult> {
    throw new Error('Not implemented')
  }

  /**
   * TODO: Return the full event history for a document.
   *       Verify the requester can see the document before returning history.
   *       Reuse document visibility rules (same as DocumentService.getDocument).
   */
  async getHistory(
    _documentId: string,
    _requesterId: string,
    _requesterRole: UserRole,
  ): Promise<DocumentEvent[]> {
    throw new Error('Not implemented')
  }
}
