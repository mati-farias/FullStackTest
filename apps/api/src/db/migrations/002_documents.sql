CREATE TABLE documents (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id      UUID NOT NULL REFERENCES users(id),
  reviewer_id    UUID REFERENCES users(id),
  title          VARCHAR(255) NOT NULL DEFAULT '',
  content        TEXT NOT NULL DEFAULT '',
  status         VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
                   CHECK (status IN ('DRAFT','SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','WITHDRAWN')),
  review_comment TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_author   ON documents(author_id);
CREATE INDEX idx_documents_reviewer ON documents(reviewer_id);
CREATE INDEX idx_documents_status   ON documents(status);
