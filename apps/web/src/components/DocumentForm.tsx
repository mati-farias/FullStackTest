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
    <div style={{ border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="title" style={{ display: "block", marginBottom: 4 }}>
          Title
        </label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
          style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label htmlFor="content" style={{ display: "block", marginBottom: 4 }}>
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={loading}
          rows={6}
          style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
        />
      </div>

      {error !== null && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={loading}
        >
          Save draft
        </button>

        {onSubmit ? (
          <button
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
