import type { DocumentEvent } from "@test/shared";

interface EventHistoryProps {
  events: DocumentEvent[];
}

export function EventHistory({ events }: EventHistoryProps): JSX.Element {
  if (events.length === 0) {
    return <p>No history yet.</p>;
  }

  return (
    <div>
      {events.map((event) => (
        <div
          key={event.id}
          style={{
            borderLeft: "3px solid #ccc",
            paddingLeft: 12,
            marginBottom: 12,
          }}
        >
          <strong>
            {event.fromStatus} → {event.toStatus}
          </strong>
          <p style={{ margin: "4px 0", color: "#666" }}>
            By {event.actorId} · {new Date(event.createdAt).toLocaleString()}
          </p>
          {event.comment ? <p style={{ margin: 0 }}>{event.comment}</p> : null}
        </div>
      ))}
    </div>
  );
}
