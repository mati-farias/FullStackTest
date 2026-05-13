import type { DocumentStatus } from '../types/document'
import type { UserRole } from '../types/user'

export interface TransitionRule {
  from: DocumentStatus
  to: DocumentStatus
  allowedRoles: UserRole[]
  requiresOwner?: boolean
  requiresAssignedReviewer?: boolean
  requiresComment?: boolean
  requiresReviewerId?: boolean
}

export const ALLOWED_TRANSITIONS: TransitionRule[] = [
  {
    from: 'DRAFT',
    to: 'SUBMITTED',
    allowedRoles: ['AUTHOR', 'ADMIN'],
    requiresOwner: true,
  },
  {
    from: 'SUBMITTED',
    to: 'UNDER_REVIEW',
    allowedRoles: ['REVIEWER', 'ADMIN'],
    requiresReviewerId: true,
  },
  {
    from: 'UNDER_REVIEW',
    to: 'APPROVED',
    allowedRoles: ['REVIEWER', 'ADMIN'],
    requiresAssignedReviewer: true,
    requiresComment: true,
  },
  {
    from: 'UNDER_REVIEW',
    to: 'REJECTED',
    allowedRoles: ['REVIEWER', 'ADMIN'],
    requiresAssignedReviewer: true,
    requiresComment: true,
  },
  {
    from: 'REJECTED',
    to: 'DRAFT',
    allowedRoles: ['AUTHOR', 'ADMIN'],
    requiresOwner: true,
  },
  {
    from: 'DRAFT',
    to: 'WITHDRAWN',
    allowedRoles: ['AUTHOR', 'ADMIN'],
    requiresOwner: true,
  },
  {
    from: 'SUBMITTED',
    to: 'WITHDRAWN',
    allowedRoles: ['AUTHOR', 'ADMIN'],
    requiresOwner: true,
  },
  {
    from: 'UNDER_REVIEW',
    to: 'WITHDRAWN',
    allowedRoles: ['AUTHOR', 'ADMIN'],
    requiresOwner: true,
  },
  {
    from: 'REJECTED',
    to: 'WITHDRAWN',
    allowedRoles: ['AUTHOR', 'ADMIN'],
    requiresOwner: true,
  },
]

export function findTransitionRule(
  from: DocumentStatus,
  to: DocumentStatus,
): TransitionRule | undefined {
  return ALLOWED_TRANSITIONS.find((r) => r.from === from && r.to === to)
}

export function canTransition(
  from: DocumentStatus,
  to: DocumentStatus,
  role: UserRole,
  isOwner: boolean,
  isAssignedReviewer: boolean,
): boolean {
  const rule = findTransitionRule(from, to)
  if (!rule) return false
  if (!rule.allowedRoles.includes(role)) return false
  if (rule.requiresOwner && !isOwner && role !== 'ADMIN') return false
  if (rule.requiresAssignedReviewer && !isAssignedReviewer && role !== 'ADMIN') return false
  return true
}
