import { useState } from "react";
import type { UpdateDocumentDTO } from "@test/shared";

interface DocumentFormProps {
  initial?: { title: string; content: string };
  onSave: (dto: UpdateDocumentDTO) => Promise<void>;
  onSubmit?: () => Promise<void>;
  loading?: boolean;
}

export function DocumentForm({
  initial,
  onSave,
  onSubmit,
  loading = false,
}: DocumentFormProps): JSX.Element {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [error, setError] = useState<string | null>(null);

  async function handleSave(): Promise<void> {
    setError(null);

    try {
      await onSave({ title, content });
    } catch (err: unknown) {
      setError(
        (err as { message?: string }).message ?? "Failed to save document",
      );
    }
  }

  async function handleSubmit(): Promise<void> {
    setError(null);

    try {
      await handleSave();
      await onSubmit?.();
    } catch (err: unknown) {
      setError(
        (err as { message?: string }).message ?? "Failed to submit document",
      );
    }
  }

  return (
    <div className="card document-form">
      <div className="form-row">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="form-row">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          rows={6}
        />
      </div>

      {error !== null && (
        <p className="error-text">{error}</p>
      )}

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <button
          className="btn btn-secondary"
          type="button"
          onClick={() => void handleSave()}
          disabled={loading}
        >
          Save draft
        </button>

        {onSubmit ? (
          <button
            className="btn"
            type="button"
            onClick={() => void handleSubmit()}
            disabled={loading}
          >
            Submit for review
          </button>
        ) : null}
      </div>
    </div>
  );
}
