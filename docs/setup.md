# Project Setup

These steps install the repository dependencies and prepare the frontend and backend for local development.

## 1. Prerequisites

- Node.js 20+ (or the version supported by your workspace)
- pnpm installed globally
- PostgreSQL available locally or via a connection string

## 2. Install workspace dependencies

From the repository root:

```bash
pnpm install
```

This installs workspace dependencies and prepares both `frontend` and `backend` packages.

## 3. Install frontend dependencies separately (optional)

```bash
cd frontend
pnpm install
cd ..
```

## 4. Install backend dependencies separately (optional)

```bash
cd backend
pnpm install
cd ..
```

## 5. Configure backend environment

The backend requires a PostgreSQL connection string. Create or update `backend/.env` with:

```env
DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<database>
```

If you have a local database, use the correct credentials for your environment.

## 6. Verify build

Run the build for the backend and frontend from the repository root:

```bash
pnpm --filter @workspace/backend run build
pnpm --filter @workspace/frontend run build
```

If both builds pass, the project is ready for development.
