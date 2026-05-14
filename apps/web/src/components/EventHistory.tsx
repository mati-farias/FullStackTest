import type { DocumentEvent } from "@test/shared";

interface EventHistoryProps {
  events: DocumentEvent[];
}

export function EventHistory({ events }: EventHistoryProps): JSX.Element {
  if (events.length === 0) {
    return <div className="empty-state">No history yet.</div>;
  }

  return (
    <div>
      {events.map((event) => (
        <div key={event.id} className="event-history__item">
          <strong>
            {event.fromStatus.replace("_", " ")} -&gt;{" "}
            {event.toStatus.replace("_", " ")}
          </strong>
          <p>
            By {event.actorId} &middot;{" "}
            {new Date(event.createdAt).toLocaleString()}
          </p>
          {event.comment ? <p>{event.comment}</p> : null}
        </div>
      ))}
    </div>
  );
}
