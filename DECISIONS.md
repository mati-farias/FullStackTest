# DECISIONS.md

> Optional but valued. A few bullet points explaining non-obvious choices
> tells us more about your thinking than the code alone.

## Architecture decisions

<!-- Examples:
- Chose to validate reviewer existence in TransitionService rather than the DB constraint
  because the error message is user-facing and needs to be typed
- Put the transaction boundary in the repository because it owns all SQL
-->

## Trade-offs accepted

<!-- Examples:
- Skipped pagination on the frontend to focus on TransitionService correctness
- Left EventHistory as a flat list rather than grouping by day
-->

## What I would do with more time

<!-- Examples:
- Add optimistic UI updates on transitions
- Extract a proper state machine library instead of iterating ALLOWED_TRANSITIONS
-->

## Ambiguities resolved

<!-- If you found something unclear and made an assumption, document it here.
     Example:
     - Spec says REVIEWER can pick any SUBMITTED document for review, not just unassigned ones.
       Assumed a document can only have one reviewer at a time and reassignment requires ADMIN.
-->
