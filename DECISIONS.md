# DECISIONS.md

> Optional but valued. A few bullet points explaining non-obvious choices
> tells us more about your thinking than the code alone.

## Architecture decisions

- Kept transition validation logic inside `TransitionService` so business rules remain centralized and independent from the transport layer.
- Used explicit repository classes to isolate SQL access and keep services focused on domain rules.
- Placed the transaction boundary inside `TransitionRepository.recordTransition()` because the repository owns both the document update and event insert operations.
- Reused `ALLOWED_TRANSITIONS` and helper functions from `@test/shared` in both frontend and backend to avoid duplicating workflow rules.
- Added typed domain errors instead of relying only on database constraints to provide clearer API responses and UI feedback.
- Automatically infer the `reviewerId` from the authenticated reviewer session in the frontend to improve UX while keeping explicit reviewer assignment validation in the backend.

## Trade-offs accepted

- Kept the UI intentionally minimal to focus on workflow correctness and business logic.
- Reviewer selection currently uses manual assignment for ADMIN users instead of a searchable reviewer picker.
- Pagination support exists in the backend query layer but was not fully implemented in the frontend UI.

## What I would do with more time

- Add automated unit and integration tests for transition rules and permission flows.
- Replace manual reviewer assignment for ADMIN users with a searchable reviewer selector.
- Improve the visual design system and responsive behavior across pages.
- Add optimistic UI updates and smarter cache invalidation after transitions.
- Replace inline styles with a reusable component styling strategy.
- Add pagination controls in the frontend UI.
- Introduce audit improvements such as displaying reviewer names instead of raw IDs in history entries.
- Extract the workflow orchestration into a dedicated state machine abstraction if transition complexity grows.

## Ambiguities resolved

- Assumed reviewers can access:
  - documents in `SUBMITTED` state
  - and only documents explicitly assigned to them.
- Assumed a document may only have one active reviewer at a time.
- Assumed rejected documents return control to the author, who may either:
  - revise and resubmit the document (`REJECTED → DRAFT`)
  - or withdraw it (`REJECTED → WITHDRAWN`).
- Assumed `UNDER_REVIEW` requires explicit reviewer assignment before approval or rejection actions are allowed.
- Assumed ADMIN users may bypass ownership and reviewer assignment restrictions where permitted by transition rules.
