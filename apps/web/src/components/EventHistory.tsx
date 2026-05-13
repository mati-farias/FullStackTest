import type { DocumentEvent } from '@test/shared'

interface EventHistoryProps {
  events: DocumentEvent[]
}

export function EventHistory({ events }: EventHistoryProps): JSX.Element {
  // TODO: Render a chronological timeline of DocumentEvent[].
  //       For each event show: fromStatus → toStatus, actorId, createdAt date,
  //       and comment if present.
  //       Display oldest events first (events arrive ordered ASC from the API).
  void events
  throw new Error('Not implemented')
}
