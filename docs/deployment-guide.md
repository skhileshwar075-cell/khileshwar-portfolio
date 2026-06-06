# Deployment Guide

## Prerequisites

- Replit account with a provisioned PostgreSQL database
- `DATABASE_URL` environment variable set
- `SESSION_SECRET` environment variable set (32+ random chars)

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | Secret for signing session cookies |
| `NODE_ENV` | Auto | Set to `production` by the deploy system |
| `PORT` | Auto | Set per-service by the deploy system |

## Development

Start both services:

```bash
# In separate terminals (or use Replit workflows)
pnpm --filter @workspace/frontend run dev   # Vite dev server
pnpm --filter @workspace/backend  run dev   # Express API
```

## Database

```bash
# Push schema to development DB
pnpm --filter @workspace/backend run db:push

# Regenerate API hooks + validators from OpenAPI spec
pnpm --filter @workspace/backend/api-spec run codegen
```

## Production (Replit Deploy)

1. Click **Deploy** in the Replit editor
2. Replit builds the frontend (`vite build`) and backend (`esbuild`)
3. Static frontend is served from `frontend/dist/public`
4. The Express backend runs as a long-lived process on `/api/*`
5. The reverse proxy routes traffic to each service automatically

## CI Checklist

- [ ] `DATABASE_URL` and `SESSION_SECRET` are set in Replit Secrets
- [ ] Schema is up to date (`db:push` was run)
- [ ] No TypeScript errors (`pnpm --filter @workspace/frontend run typecheck`)
- [ ] API health check passes (`GET /api/healthz`)
