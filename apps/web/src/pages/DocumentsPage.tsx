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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ marginBottom: 4 }}>Documents</h1>
          <p style={{ marginTop: 0, color: "#666" }}>
            Manage approval workflow documents.
          </p>
        </div>

        {(user.role === "AUTHOR" || user.role === "ADMIN") && (
          <button type="button" onClick={() => setShowForm((value) => !value)}>
            {showForm ? "Cancel" : "New document"}
          </button>
        )}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label htmlFor="status-filter" style={{ marginRight: 8 }}>
          Status
        </label>
        <select
          id="status-filter"
          value={status}
          onChange={(e) => setStatus(e.target.value as DocumentStatus | "")}
        >
          {statuses.map((item) => (
            <option key={item || "ALL"} value={item}>
              {item || "ALL"}
            </option>
          ))}
        </select>
      </div>

      {showForm && (
        <div style={{ marginBottom: 24 }}>
          <DocumentForm
            onSave={handleCreate}
            loading={createDocument.loading}
          />
          {createDocument.error && (
            <p style={{ color: "red" }}>{createDocument.error}</p>
          )}
        </div>
      )}

      {loading && <p>Loading documents…</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && documents.length === 0 && (
        <p>No documents found.</p>
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
