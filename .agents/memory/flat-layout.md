---
name: Flat layout with inlined libs
description: lib/* packages inlined into backend/src/ and frontend/src/; flat layout at repo root instead of artifacts/
---

# Portfolio CMS flat layout

## The rule
This project uses a flat layout with packages directly at the repo root:
- `frontend/` (`@workspace/frontend`) — React+Vite SPA (port 21113)
- `backend/` (`@workspace/backend`) — Express 5 API (port 8080)
- `backend/api-spec/` (`@workspace/backend-api-spec`) — OpenAPI spec + Orval codegen

The old `lib/*` shared packages were inlined:
- `lib/db` → `backend/src/db/`
- `lib/api-zod` → `backend/src/validators/`
- `lib/api-client-react` → `frontend/src/api/`
- `lib/replit-auth-web` → `frontend/src/lib/auth/`
- `lib/api-spec` → `backend/api-spec/`

TypeScript path aliases in each package's `tsconfig.json` keep the old `@workspace/db`, `@workspace/api-zod`, `@workspace/api-client-react`, `@workspace/replit-auth-web` import paths working. esbuild `alias` in `build.mjs` mirrors them for bundling.

**Why:** User requested this layout. Inlining libs eliminates composite build ordering complexity.
