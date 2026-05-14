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
    return <p>Loading user...</p>;
  }

  return (
    <div>
      <div className="page-toolbar">
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
            {showForm ? "Cancel" : "+ New document"}
          </button>
        )}
      </div>

      <div className="filter-pills" aria-label="Filter documents by status">
        {statuses.map((item) => (
          <button
            key={item || "ALL"}
            type="button"
            className={`filter-pill${
              status === item ? " filter-pill--active" : ""
            }`}
            onClick={() => setStatus(item)}
          >
            {item ? item.replace("_", " ") : "ALL"}
          </button>
        ))}
      </div>

      {showForm && (
        <section className="page-panel" style={{ marginBottom: 24 }}>
          <DocumentForm
            onSave={handleCreate}
            loading={createDocument.loading}
          />
          {createDocument.error && (
            <p className="error-text" style={{ marginTop: 12 }}>
              {createDocument.error}
            </p>
          )}
        </section>
      )}

      {loading && <div className="empty-state">Loading documents...</div>}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && documents.length === 0 && (
        <div className="empty-state">No documents found.</div>
      )}

      {!loading && !error && documents.length > 0 && (
        <div className="documents-grid">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              currentUser={user}
            />
          ))}
        </div>
      )}
    </div>
  );
}
