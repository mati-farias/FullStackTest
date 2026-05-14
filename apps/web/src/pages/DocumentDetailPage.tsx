import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { ApiResponse, DocumentEvent } from "@test/shared";
import { apiClient } from "../api/client";
import { useAuthStore } from "../store/auth.store";
import { useDocument } from "../hooks/useDocuments";
import { DocumentForm } from "../components/DocumentForm";
import { TransitionButton } from "../components/TransitionButton";
import { EventHistory } from "../components/EventHistory";

export function DocumentDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);

  const { document, loading, error, refetch, update } = useDocument(id ?? "");
  const [events, setEvents] = useState<DocumentEvent[]>([]);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    if (!id) return;

    setHistoryError(null);

    try {
      const response = await apiClient.get<ApiResponse<DocumentEvent[]>>(
        `/api/documents/${id}/history`,
      );
      setEvents(response.data);
    } catch (err: unknown) {
      setHistoryError(
        (err as { message?: string }).message ?? "Failed to load history",
      );
    }
  }, [id]);

  useEffect(() => {
    void fetchHistory();
  }, [fetchHistory]);

  if (!id) return <p>Missing document id.</p>;
  if (!user) return <p>Loading user…</p>;
  if (loading && !document) return <p>Loading document…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!document) return <p>Document not found.</p>;

  const canEditDraft =
    document.status === "DRAFT" &&
    (user.role === "ADMIN" || document.authorId === user.id);

  return (
    <div>
      <p>
        <Link to="/documents">← Back to documents</Link>
      </p>

      <section style={{ marginBottom: 24 }}>
        <h1>{document.title.trim() || "Untitled document"}</h1>

        <p>
          <strong>Status:</strong> {document.status}
        </p>

        <p>
          <strong>Author:</strong> {document.authorId}
        </p>

        <p>
          <strong>Reviewer:</strong> {document.reviewerId ?? "Not assigned"}
        </p>

        {document.reviewComment ? (
          <p>
            <strong>Review comment:</strong> {document.reviewComment}
          </p>
        ) : null}

        <div
          style={{
            whiteSpace: "pre-wrap",
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 16,
            marginTop: 12,
          }}
        >
          {document.content.trim() || "No content yet."}
        </div>
      </section>

      {canEditDraft ? (
        <section style={{ marginBottom: 24 }}>
          <h2>Edit draft</h2>
          <DocumentForm
            initial={{ title: document.title, content: document.content }}
            onSave={update}
            loading={loading}
          />
        </section>
      ) : null}

      <section style={{ marginBottom: 24 }}>
        <h2>Actions</h2>
        <TransitionButton
          document={document}
          currentUser={user}
          onSuccess={() => {
            refetch();
            void fetchHistory();
          }}
        />
      </section>

      <section>
        <h2>History</h2>
        {historyError ? <p style={{ color: "red" }}>{historyError}</p> : null}
        <EventHistory events={events} />
      </section>
    </div>
  );
}
