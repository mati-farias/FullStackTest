import { Link } from "react-router-dom";
import type { Document, DocumentStatus, User } from "@test/shared";
import { statusColors } from "../utils/document-status";

interface DocumentCardProps {
  document: Document;
  currentUser: User;
}

// const statusColors: Record<DocumentStatus, string> = {
//   DRAFT: "#777",
//   SUBMITTED: "#2563eb",
//   UNDER_REVIEW: "#d97706",
//   APPROVED: "#16a34a",
//   REJECTED: "#dc2626",
//   WITHDRAWN: "#777",
// };

export function DocumentCard({
  document,
  currentUser,
}: DocumentCardProps): JSX.Element {
  const canEdit =
    currentUser.role === "ADMIN" || document.authorId === currentUser.id;
  const summary = document.content.trim()
    ? `${document.content.slice(0, 140)}${document.content.length > 140 ? "…" : ""}`
    : "No content yet.";

  return (
    <article className="card" style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
          <Link to={`/documents/${document.id}`} style={{ color: "#0f172a" }}>
            {document.title.trim() || "Untitled document"}
          </Link>
        </h3>

        <span className={`status-chip status-chip--${document.status}`}>
          {document.status}
        </span>
      </div>

      <div className="document-meta">
        <span>Updated {new Date(document.updatedAt).toLocaleString()}</span>
        {canEdit && document.status === "DRAFT" ? (
          <span>Editable draft</span>
        ) : null}
      </div>

      <p style={{ marginTop: 14, color: "#475569", lineHeight: 1.7 }}>
        {summary}
      </p>
    </article>
  );
}
