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
      req.reviewerId = reviewerId;
    }

    const result = await transition(req);
    setActiveTarget(null);
    setComment("");
    setReviewerId("");
    onSuccess(result);
  }

  if (availableTargets.length === 0) {
    return <p>No actions available.</p>;
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {availableTargets.map((target) => {
          const rule = findTransitionRule(document.status, target);
          const needsInput = Boolean(
            rule?.requiresComment || rule?.requiresReviewerId,
          );

          return (
            <button
              key={target}
              type="button"
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
        <div style={{ marginTop: 12, padding: 12, border: "1px solid #ddd" }}>
          <h4 style={{ marginTop: 0 }}>Move to {activeTarget}</h4>
          {findTransitionRule(document.status, activeTarget)
            ?.requiresReviewerId ? (
            <div style={{ marginBottom: 8 }}>
              <label
                htmlFor="reviewerId"
                style={{ display: "block", marginBottom: 4 }}
              >
                Reviewer ID
              </label>
              <input
                id="reviewerId"
                value={reviewerId}
                onChange={(e) => setReviewerId(e.target.value)}
                style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
              />
            </div>
          ) : null}
          {findTransitionRule(document.status, activeTarget)
            ?.requiresComment ? (
            <div style={{ marginBottom: 8 }}>
              <label
                htmlFor="comment"
                style={{ display: "block", marginBottom: 4 }}
              >
                Comment
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                style={{ width: "100%", padding: 8, boxSizing: "border-box" }}
              />
            </div>
          ) : null}
          <button
            type="button"
            disabled={loading}
            onClick={() => void runTransition(activeTarget)}
          >
            Confirm
          </button>{" "}
          <button
            type="button"
            disabled={loading}
            onClick={() => setActiveTarget(null)}
          >
            Cancel
          </button>
        </div>
      ) : null}

      {error ? <p style={{ color: "red" }}>{error}</p> : null}
    </div>
  );
}
