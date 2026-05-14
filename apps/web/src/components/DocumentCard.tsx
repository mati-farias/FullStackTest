import { Link } from "react-router-dom";
import type { Document, DocumentStatus, User } from "@test/shared";

interface DocumentCardProps {
  document: Document;
  currentUser: User;
}

const statusColors: Record<DocumentStatus, string> = {
  DRAFT: "#777",
  SUBMITTED: "#2563eb",
  UNDER_REVIEW: "#d97706",
  APPROVED: "#16a34a",
  REJECTED: "#dc2626",
  WITHDRAWN: "#777",
};

export function DocumentCard({
  document,
  currentUser,
}: DocumentCardProps): JSX.Element {
  const canEdit =
    currentUser.role === "ADMIN" || document.authorId === currentUser.id;

  return (
    <article
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <div
        style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
      >
        <h3 style={{ margin: 0 }}>
          <Link to={`/documents/${document.id}`}>
            {document.title.trim() || "Untitled document"}
          </Link>
        </h3>

        <span
          style={{
            background: statusColors[document.status],
            color: "white",
            borderRadius: 999,
            padding: "4px 8px",
            fontSize: 12,
            height: "fit-content",
          }}
        >
          {document.status}
        </span>
      </div>

      <p style={{ margin: "8px 0", color: "#666" }}>
        Updated {new Date(document.updatedAt).toLocaleString()}
      </p>

      <p style={{ margin: 0 }}>
        {document.content.trim()
          ? `${document.content.slice(0, 140)}${document.content.length > 140 ? "…" : ""}`
          : "No content yet."}
      </p>

      {canEdit && document.status === "DRAFT" ? (
        <p style={{ marginTop: 8, fontSize: 13 }}>Editable draft</p>
      ) : null}
    </article>
  );
}
