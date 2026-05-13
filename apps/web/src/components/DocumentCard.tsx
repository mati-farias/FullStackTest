import type { Document, User } from '@test/shared'

interface DocumentCardProps {
  document: Document
  currentUser: User
}

export function DocumentCard({ document, currentUser }: DocumentCardProps): JSX.Element {
  // TODO: Render document title, status badge (colour-coded per status),
  //       author name, updatedAt date, and a link to /documents/:id.
  //       Status badge colours: DRAFT=gray, SUBMITTED=blue, UNDER_REVIEW=amber,
  //       APPROVED=green, REJECTED=red, WITHDRAWN=gray.
  //       Use currentUser to conditionally show edit affordances.
  void currentUser
  throw new Error('Not implemented')
}
