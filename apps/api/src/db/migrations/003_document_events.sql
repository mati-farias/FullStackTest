CREATE TABLE document_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  actor_id    UUID NOT NULL REFERENCES users(id),
  from_status VARCHAR(20) NOT NULL,
  to_status   VARCHAR(20) NOT NULL,
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_document_events_document ON document_events(document_id);
