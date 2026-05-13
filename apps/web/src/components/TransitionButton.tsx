import { canTransition } from '@test/shared'
import type { Document, User, TransitionResult } from '@test/shared'

interface TransitionButtonProps {
  document: Document
  currentUser: User
  onSuccess: (result: TransitionResult) => void
}

export function TransitionButton({
  document,
  currentUser,
  onSuccess,
}: TransitionButtonProps): JSX.Element {
  // TODO: Use canTransition() from @test/shared to compute which target statuses
  //       are available to currentUser given document.status.
  //       Render one button per available transition.
  //
  //       For transitions that require a comment or reviewerId, show a small
  //       inline form (textarea / user select) before calling the API.
  //
  //       On success, call onSuccess(result) so the parent can refresh the document.
  //
  // NOTE: Do NOT duplicate the transition logic here. canTransition() is the single
  //       source of truth — it reads ALLOWED_TRANSITIONS from @test/shared.
  void canTransition; void document; void currentUser; void onSuccess
  throw new Error('Not implemented')
}
