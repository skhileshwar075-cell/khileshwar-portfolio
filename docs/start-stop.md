# Start and Stop

This file describes how to start, stop, and manage the frontend and backend services locally.

## Prerequisites

Ensure setup is complete before starting servers:

```bash
# Install dependencies
pnpm install

# Configure backend/.env with DATABASE_URL

# Create and seed database
cd backend
node scripts/create_db.mjs "postgres://postgres:123456@localhost:5432/postgres" "portfolio"
pnpm run db:push
pnpm run db:seed
cd ..
```

See [setup.md](setup.md) for detailed setup instructions.

## Start Backend

From the repository root:

```bash
cd backend
pnpm run dev
```

Or from the workspace root using:

```bash
pnpm run dev:backend
```

### Backend Details

- **Port**: 8080 (configured in `backend/.env` as `PORT`)
- **Environment**: Loads `backend/.env` automatically via dotenv
- **Database**: Connects to PostgreSQL via `DATABASE_URL`
- **API Base**: `http://localhost:8080/api`
- **Health check**: `GET http://localhost:8080/health`

### Backend Console Output

Look for:
```
▐ info: Server running at http://localhost:8080
```

## Start Frontend

From the repository root:

```bash
cd frontend
pnpm run dev
```

Or from the workspace root using:

```bash
pnpm run dev:frontend
```

### Frontend Details

- **Port**: 5173 (configured in `frontend/vite.config.ts`, override in `backend/.env` `VITE_PORT`)
- **API Proxy**: Requests to `/api/*` forward to backend
- **Entry point**: `http://localhost:5173`
- **Admin dashboard**: `http://localhost:5173/admin`

### Frontend Console Output

Look for:
```
  VITE v7.3.3 ready in 156 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## Start Both Servers (Recommended)

Open **two terminal windows** and run each command in separate terminals:

**Terminal 1 — Backend:**
```bash
cd backend
pnpm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
pnpm run dev
```

This allows you to see both logs independently and restart either service without stopping the other.

## Database Maintenance

### View Database Schema

Connect to PostgreSQL:

```bash
psql -U postgres -d portfolio
```

### Refresh Database

Reset and seed fresh demo data:

```bash
cd backend

# Delete all data (keeps schema)
pnpm run db:seed

# Or fully recreate: drop and recreate database
node scripts/create_db.mjs "postgres://postgres:123456@localhost:5432/postgres" "portfolio"
pnpm run db:push
pnpm run db:seed

cd ..
```

### Apply Schema Changes

After modifying `backend/src/db/schema/**/*.ts`:

```bash
cd backend
pnpm run db:push
cd ..
```

## Stop Servers

In each terminal running a server, stop with:

```
Ctrl+C
```

Both backend and frontend will terminate gracefully.

## Production Build

Build without running dev servers:

```bash
# Build backend
cd backend
pnpm run build
cd ..

# Build frontend
cd frontend
pnpm run build
cd ..

# Or from root
pnpm run build
```

Built artifacts:
- **Backend**: `backend/dist/index.mjs`
- **Frontend**: `frontend/dist/public/index.html`

Start production build:

```bash
# Backend
cd backend
pnpm run start

# Frontend (serve static files)
npx serve frontend/dist/public
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check `DATABASE_URL` in `backend/.env`, verify PostgreSQL is running |
| Frontend won't start | Check port 5173 is free, verify backend is running |
| Hot reload not working | Restart dev server or check `vite.config.ts` |
| Database connection timeout | Verify PostgreSQL credentials and network access |
| Module not found | Run `pnpm install` and clear `node_modules` if needed |
