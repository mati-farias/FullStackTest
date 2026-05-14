import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { ApiResponse, DocumentEvent } from "@test/shared";
import { apiClient } from "../api/client";
import { useAuthStore } from "../store/auth.store";
import { useDocument } from "../hooks/useDocuments";
import { DocumentForm } from "../components/DocumentForm";
import { TransitionButton } from "../components/TransitionButton";
import { EventHistory } from "../components/EventHistory";
import { statusColors } from "../utils/document-status";

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
  if (error) return <p style={{ color: "#dc2626" }}>{error}</p>;
  if (!document) return <p>Document not found.</p>;

  const canEditDraft =
    document.status === "DRAFT" &&
    (user.role === "ADMIN" || document.authorId === user.id);

  return (
    <div>
      <p style={{ marginBottom: 24 }}>
        <Link to="/documents">← Back to documents</Link>
      </p>

      <section className="page-panel" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <h1 className="page-heading">
              {document.title.trim() || "Untitled document"}
            </h1>
          </div>

          <div className="document-meta">
            <span
              className={`status-chip status-chip--${document.status}`}
              style={{ backgroundColor: statusColors[document.status] }}
            >
              {document.status.replace("_", " ")}
            </span>
            <span>Author: {document.authorId}</span>
            <span>Reviewer: {document.reviewerId ?? "Not assigned"}</span>
          </div>

          {document.reviewComment ? (
            <p style={{ color: "#475569" }}>
              <strong>Review comment:</strong> {document.reviewComment}
            </p>
          ) : null}

          <div
            style={{
              whiteSpace: "pre-wrap",
              border: "1px solid #e2e8f0",
              borderRadius: 18,
              padding: 20,
              marginTop: 12,
              background: "#f8fafc",
              color: "#334155",
            }}
          >
            {document.content.trim() || "No content yet."}
          </div>
        </div>
      </section>

      {canEditDraft ? (
        <section className="page-panel" style={{ marginBottom: 24 }}>
          <h2 className="section-title">Edit draft</h2>
          <DocumentForm
            initial={{ title: document.title, content: document.content }}
            onSave={update}
            loading={loading}
          />
        </section>
      ) : null}

      <section className="page-panel" style={{ marginBottom: 24 }}>
        <h2 className="section-title">Actions</h2>
        <TransitionButton
          document={document}
          currentUser={user}
          onSuccess={() => {
            refetch();
            void fetchHistory();
          }}
        />
      </section>

      <section className="page-panel">
        <h2 className="section-title">History</h2>
        {historyError ? (
          <p style={{ color: "#dc2626", marginBottom: 12 }}>{historyError}</p>
        ) : null}
        <EventHistory events={events} />
      </section>
    </div>
  );
}
