import type { TransitionRequest, TransitionResult } from '@test/shared'

export interface UseTransitionResult {
  transition: (req: TransitionRequest) => Promise<TransitionResult>
  loading: boolean
  error: string | null
}

export function useTransition(_documentId: string): UseTransitionResult {
  // TODO: Return { transition, loading, error }.
  //       transition(req) calls POST /api/documents/:documentId/transitions.
  //       On success, return the TransitionResult.
  throw new Error('Not implemented')
}
