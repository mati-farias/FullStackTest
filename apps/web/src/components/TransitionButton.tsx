import { useState } from "react";
import {
  ALLOWED_TRANSITIONS,
  canTransition,
  findTransitionRule,
} from "@test/shared";
import type {
  Document,
  DocumentStatus,
  User,
  TransitionRequest,
  TransitionResult,
} from "@test/shared";
import { useTransition } from "../hooks/useTransition";

interface TransitionButtonProps {
  document: Document;
  currentUser: User;
  onSuccess: (result: TransitionResult) => void;
}

export function TransitionButton({
  document,
  currentUser,
  onSuccess,
}: TransitionButtonProps): JSX.Element {
  const { transition, loading, error } = useTransition(document.id);
  const [activeTarget, setActiveTarget] = useState<DocumentStatus | null>(null);
  const [comment, setComment] = useState("");
  const [reviewerId, setReviewerId] = useState("");

  const availableTargets = ALLOWED_TRANSITIONS.filter(
    (rule) => rule.from === document.status,
  )
    .filter((rule) =>
      canTransition(
        document.status,
        rule.to,
        currentUser.role,
        document.authorId === currentUser.id,
        document.reviewerId === currentUser.id,
      ),
    )
    .map((rule) => rule.to);

  async function runTransition(targetStatus: DocumentStatus): Promise<void> {
    const rule = findTransitionRule(document.status, targetStatus);
    const req: TransitionRequest = { targetStatus };

    if (rule?.requiresComment) {
      req.comment = comment;
    }

    if (rule?.requiresReviewerId) {
      req.reviewerId =
        currentUser.role === "REVIEWER" ? currentUser.id : reviewerId;
    }

    const result = await transition(req);
    setActiveTarget(null);
    setComment("");
    setReviewerId("");
    onSuccess(result);
  }

  if (availableTargets.length === 0) {
    return <div className="empty-state">No actions available.</div>;
  }

  return (
    <div className="card">
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {availableTargets.map((target) => {
          const rule = findTransitionRule(document.status, target);
          const needsInput = Boolean(
            rule?.requiresComment || rule?.requiresReviewerId,
          );

          return (
            <button
              key={target}
              type="button"
              className="btn btn-secondary"
              disabled={loading}
              onClick={() => {
                if (needsInput) {
                  setActiveTarget(target);
                } else {
                  void runTransition(target);
                }
              }}
            >
              Move to {target}
            </button>
          );
        })}
      </div>

      {activeTarget ? (
        <div style={{ marginTop: 16 }}>
          <div className="form-row">
            <label style={{ marginBottom: 0 }}>Move to {activeTarget}</label>
          </div>
          {findTransitionRule(document.status, activeTarget)
            ?.requiresReviewerId && currentUser.role !== "REVIEWER" ? (
            <div className="form-row">
              <label htmlFor="reviewerId">Reviewer ID</label>
              <input
                id="reviewerId"
                value={reviewerId}
                onChange={(e) => setReviewerId(e.target.value)}
              />
            </div>
          ) : null}
          {findTransitionRule(document.status, activeTarget)
            ?.requiresComment ? (
            <div className="form-row">
              <label htmlFor="comment">Comment</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
          ) : null}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn"
              disabled={loading}
              onClick={() => void runTransition(activeTarget)}
            >
              Confirm
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={loading}
              onClick={() => setActiveTarget(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p style={{ color: "#dc2626", marginTop: 12 }}>{error}</p>
      ) : null}
    </div>
  );
}
