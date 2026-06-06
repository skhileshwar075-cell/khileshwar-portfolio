# Architecture

## Overview

Portfolio CMS is a full-stack web application with a React frontend and an Express REST API backend, connected to a PostgreSQL database.

```
frontend/   React + Vite + Tailwind CSS + shadcn/ui
backend/    Express 5 + Drizzle ORM + PostgreSQL
```

## Request Flow

```
Browser → Reverse Proxy (path-based)
  /         → frontend (Vite dev server / static build)
  /api/*    → backend (Express 5)
```

## Frontend (`frontend/`)

| Layer | Technology |
|-------|-----------|
| UI Framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Routing | Wouter |
| State / Data fetching | TanStack React Query |
| Forms | React Hook Form |
| Animation | Framer Motion |
| API client | Auto-generated hooks (Orval → `frontend/src/api/`) |

## Backend (`backend/`)

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 24 + TypeScript |
| Framework | Express 5 |
| Database | PostgreSQL |
| ORM | Drizzle ORM |
| Schema | `backend/src/db/schema/` |
| Validation | Zod (auto-generated from OpenAPI) |
| Auth | Replit Auth (OpenID Connect / PKCE) |

## API Contract

The single source of truth is `backend/api-spec/openapi.yaml`. Orval reads this spec and generates:
- `frontend/src/api/generated/` — React Query hooks for the frontend
- `backend/src/validators/generated/` — Zod schemas for backend validation

Run codegen: `pnpm --filter @workspace/backend run codegen` (from workspace root)

## Auth

Authentication uses Replit Auth (OIDC). Sessions are stored server-side in the `sessions` DB table. The frontend calls `/api/auth/user` to check session state.

## Database Schema

Tables: `projects`, `skills`, `experience`, `education`, `certificates`, `blog_posts`, `contacts`, `analytics`, `settings`, `users`, `sessions`

Push schema changes: `pnpm --filter @workspace/backend run db:push`
