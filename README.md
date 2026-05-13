# Full Stack Technical Test — Document Approval Workflow

> **Time:** 8 hours · **Level:** Senior Full Stack (TypeScript) · **AI tools: allowed**

---

## The Challenge

You are working on a partially-built codebase for a **Document Approval Workflow** system.
Documents move through a lifecycle with defined states, roles, and transition rules.
The architecture, contracts, and a reference module are already in place.
Your job is to implement the business logic and connect the frontend.

---

## Quick Start

**Prerequisites:** Docker + Docker Compose v2

```bash
cp .env.example .env
docker compose up
```

Verify:
```bash
curl http://localhost:3000/api/health
# → { "status": "ok" }

open http://localhost:3000/docs   # Swagger UI
open http://localhost:5173        # React app
```

The database runs migrations automatically on first start.

---

## Domain Model

### Document lifecycle

```
DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED
                                 ↘ REJECTED → DRAFT (resubmit)
        ↓
      WITHDRAWN   (author or admin can withdraw from any non-APPROVED status)
```

### Roles

| Role | Can do |
|---|---|
| `AUTHOR` | Create/edit documents, submit, resubmit after rejection, withdraw own documents |
| `REVIEWER` | Pick up SUBMITTED documents, approve or reject UNDER_REVIEW documents |
| `ADMIN` | Everything |

### Transition rules

| From | To | Who | Condition |
|---|---|---|---|
| DRAFT | SUBMITTED | AUTHOR (owner) | title + content must be non-empty |
| SUBMITTED | UNDER_REVIEW | REVIEWER or ADMIN | must provide a `reviewerId` |
| UNDER_REVIEW | APPROVED | assigned REVIEWER or ADMIN | must include a comment |
| UNDER_REVIEW | REJECTED | assigned REVIEWER or ADMIN | must include a comment |
| REJECTED | DRAFT | AUTHOR (owner) | clears reviewer + comment |
| any (except APPROVED) | WITHDRAWN | AUTHOR (owner) or ADMIN | — |

Any other transition must be rejected with a `409 INVALID_TRANSITION` error.

---

## What Is Already Implemented

You can use these as-is and as reference for what you need to build:

- **Auth module** (`apps/api/src/modules/auth/`) — full controller → service → repository example
- **Shared types + state machine** (`packages/shared/`) — `Document`, `User`, `ALLOWED_TRANSITIONS`, `canTransition()`
- **Error class hierarchy** (`apps/api/src/shared/errors.ts`) — `NotFoundError`, `ForbiddenError`, etc.
- **Error handler plugin** — maps `AppError` subclasses to structured HTTP responses
- **Authenticate plugin** — JWT `preHandler`; attaches `request.user` to every protected route
- **API client** (`apps/web/src/api/client.ts`) — typed fetch wrapper with auth headers and 401 auto-logout
- **Auth store** (`apps/web/src/store/auth.store.ts`) — Zustand store with token persistence
- **AppShell** (`apps/web/src/components/AppShell.tsx`) — layout with header, user badge, and sign-out
- **ErrorBoundary** (`apps/web/src/components/ErrorBoundary.tsx`) — catches stub pages and real errors separately
- **Login / Register pages** — fully implemented
- **Docker Compose + migrations** — runs on first `docker compose up`

---

## What to Implement

Files with `throw new Error('Not implemented')` are yours to implement.
Read the `// TODO:` comments — they describe exactly what each method must do.

### Required

- [ ] `TransitionService.execute()` — enforce all 8 guard checks, build patch, call repository
- [ ] `TransitionRepository.recordTransition()` — atomic transaction (document update + event insert)
- [ ] `DocumentRepository` — `findById`, `findAllForUser`, `create`, `update`
- [ ] `DocumentService` — `getDocument`, `listDocuments`, `createDocument`, `editDocument`
- [ ] Document routes — `GET /api/documents`, `POST /api/documents`, `GET /api/documents/:id`, `PATCH /api/documents/:id`
- [ ] Transition routes — `POST /api/documents/:id/transitions`, `GET /api/documents/:id/history`
- [ ] Frontend: `DocumentsPage` — list with status filter, create button
- [ ] Frontend: `DocumentDetailPage` — document view, transition buttons, event history

### Bonus

- [ ] `TransitionButton` uses `canTransition()` from `@test/shared` (no duplicated logic)
- [ ] Unit tests for `TransitionService` (guard conditions)
- [ ] Integration test for a full flow: DRAFT → SUBMITTED → UNDER_REVIEW → APPROVED
- [ ] Pagination on `GET /api/documents`
- [ ] GitHub Actions CI (lint + type-check)

---

## How We Evaluate

Four dimensions, in priority order:

**1. Domain correctness**
Does `TransitionService.execute()` enforce every rule without gaps? We will test:
a REVIEWER approving a document they are not assigned to, an AUTHOR approving their own document,
submitting an empty document, and resubmitting after rejection.

**2. Architecture**
Is the state machine logic isolated in `TransitionService`?
Does `canTransition()` from `@test/shared` get used, or is the transition logic duplicated?
Is SQL only in repositories?

**3. TypeScript discipline**
Are types meaningful? `unknown` at API boundaries? No implicit `any`?

**4. Operational completeness**
Does `docker compose up` work on first run?
Does a bad transition request return a structured `{ message, code, statusCode }` error,
or does the server crash?

---

## Environment Variables

Copy `.env.example` to `.env` — the defaults work out of the box with Docker Compose.

```bash
# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/document_workflow
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=document_workflow

# JWT — change before deploying
JWT_SECRET=change-me-in-production-must-be-at-least-32-characters-long

# API server
PORT=3000
NODE_ENV=development

# Web (Vite)
VITE_API_URL=http://localhost:3000
```

---

## Submission

1. Push your implementation to a **public GitHub repository**
2. Ensure `docker compose up` works from a clean clone
3. Submit the repository URL via the provided form

If you could not complete a section, leave the stub in place and add a comment
explaining your approach and what you would do with more time.

---

## Tips

**AI tools are allowed and expected.**
Seniority is demonstrated through the decisions you make, not typing speed.
We look at: how you enforce the state machine rules, how you handle errors,
how you structure the transaction, how you avoid duplicating logic.

**Fill in `DECISIONS.md`** (optional but valued).
A short bullet list of non-obvious choices tells us more than the code alone.

**Scope ruthlessly.**
A correct `TransitionService` with a minimal frontend beats
a polished UI with a broken state machine.
