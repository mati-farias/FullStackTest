import { Link } from "react-router-dom";
import type { Document, User } from "@test/shared";

interface DocumentCardProps {
  document: Document;
  currentUser: User;
}

export function DocumentCard({
  document,
  currentUser,
}: DocumentCardProps): JSX.Element {
  const canEdit =
    currentUser.role === "ADMIN" || document.authorId === currentUser.id;
  const summary = document.content.trim()
    ? `${document.content.slice(0, 140)}${
        document.content.length > 140 ? "..." : ""
      }`
    : "No content yet.";

  return (
    <article className="card document-card">
      <div className="document-card__header">
        <h3 className="document-card__title">
          <Link to={`/documents/${document.id}`}>
            {document.title.trim() || "Untitled document"}
          </Link>
        </h3>

        <span className={`status-chip status-chip--${document.status}`}>
          {document.status.replace("_", " ")}
        </span>
      </div>

      <p className="document-card__summary">{summary}</p>

      <p className="document-card__updated">
        Updated {new Date(document.updatedAt).toLocaleString()}
        {canEdit && document.status === "DRAFT" ? " - Editable draft" : ""}
      </p>
    </article>
  );
}
