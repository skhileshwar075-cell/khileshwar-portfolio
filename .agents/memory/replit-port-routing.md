---
name: Replit port routing
description: localhost:80 inside the container maps directly to the backend; Replit's path proxy (artifact.toml routes) only applies to external access
---

# Replit path routing — internal vs external

## The rule
`localhost:80` inside the Replit container is NOT the artifact path proxy. It maps directly to whichever local port has `externalPort = 80` in `.replit` [[ports]]. In this project that is the backend (port 8080).

The artifact.toml `paths` routing (e.g. `/api` → 8080, `/` → 21113) only applies to external access through the Replit domain (the external Replit proxy infrastructure).

**Why this matters:**
- `curl localhost:80/api/healthz` works (Express handles it) — correct behavior
- `curl localhost:80/` returns Express 404 — this is expected; the frontend is only visible externally
- Screenshot tool captures `localhost:80`, so it always shows the backend, not the frontend SPA

**How to apply:**
- For API smoke tests in bash, `curl localhost:80/api/...` or `curl localhost:8080/api/...` both work
- To verify the frontend, use the user's preview pane (external Replit proxy) — not curl or screenshot tool
- Do NOT add Vite proxy config to forward `/api` to the backend; the external Replit proxy handles it
- `.replit` [[ports]] cannot be edited directly — managed by the platform
