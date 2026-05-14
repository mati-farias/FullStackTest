import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { DocumentStatus } from "@test/shared";
import { useAuthStore } from "../store/auth.store";
import { useCreateDocument, useDocuments } from "../hooks/useDocuments";
import { DocumentCard } from "../components/DocumentCard";
import { DocumentForm } from "../components/DocumentForm";

const statuses: Array<DocumentStatus | ""> = [
  "",
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "WITHDRAWN",
];

export function DocumentsPage(): JSX.Element {
  const [status, setStatus] = useState<DocumentStatus | "">("");
  const [showForm, setShowForm] = useState(false);

  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const { documents, loading, error, refetch } = useDocuments(
    status ? { status } : undefined,
  );
  const createDocument = useCreateDocument();

  async function handleCreate(dto: {
    title?: string;
    content?: string;
  }): Promise<void> {
    const document = await createDocument.create({
      title: dto.title ?? "",
      content: dto.content ?? "",
    });

    setShowForm(false);
    refetch();
    void navigate(`/documents/${document.id}`);
  }

  if (!user) {
    return <p>Loading user…</p>;
  }

  return (
    <div>
      <section className="page-panel" style={{ marginBottom: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 className="page-heading">Documents</h1>
            <p className="page-subtitle">Manage approval workflow documents.</p>
          </div>

          {(user.role === "AUTHOR" || user.role === "ADMIN") && (
            <button
              className="btn"
              type="button"
              onClick={() => setShowForm((value) => !value)}
            >
              {showForm ? "Cancel" : "New document"}
            </button>
          )}
        </div>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
          }}
        >
          <label htmlFor="status-filter" style={{ color: "#475569" }}>
            Status
          </label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value as DocumentStatus | "")}
            style={{ minWidth: 180, borderRadius: 14 }}
          >
            {statuses.map((item) => (
              <option key={item || "ALL"} value={item}>
                {item || "ALL"}
              </option>
            ))}
          </select>
        </div>
      </section>

      {showForm && (
        <section className="page-panel" style={{ marginBottom: 24 }}>
          <DocumentForm
            onSave={handleCreate}
            loading={createDocument.loading}
          />
          {createDocument.error && (
            <p style={{ color: "#dc2626", marginTop: 12 }}>
              {createDocument.error}
            </p>
          )}
        </section>
      )}

      {loading && <div className="empty-state">Loading documents…</div>}
      {error && <p style={{ color: "#dc2626", marginBottom: 16 }}>{error}</p>}

      {!loading && !error && documents.length === 0 && (
        <div className="empty-state">No documents found.</div>
      )}

      {!loading &&
        !error &&
        documents.map((document) => (
          <DocumentCard
            key={document.id}
            document={document}
            currentUser={user}
          />
        ))}
    </div>
  );
}
