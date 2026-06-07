# Deployment Guide

## Prerequisites

- PostgreSQL database available for the backend
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
# In separate terminals
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

## Production

Deploy the frontend as a static site and run the backend on a Node host. The backend exposes `/api/*`, and the frontend should proxy or route requests to that API.

If deploying to Replit, ensure `DATABASE_URL` and `SESSION_SECRET` are configured in Replit Secrets.

## CI Checklist

- [ ] `DATABASE_URL` and `SESSION_SECRET` are set in environment configuration
- [ ] Schema is up to date (`db:push` was run)
- [ ] No TypeScript errors (`pnpm --filter @workspace/frontend run typecheck`)
- [ ] API health check passes (`GET /api/healthz`)
