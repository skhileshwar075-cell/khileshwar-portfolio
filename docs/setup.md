# Project Setup

Complete setup guide to get the portfolio CMS running locally with all dependencies and database configured.

## Prerequisites

- **Node.js** 20+ (tested with v24)
- **pnpm** installed globally (`npm install -g pnpm`)
- **PostgreSQL** installed locally or accessible via connection string
- **Git** for version control

## Step 1: Install Workspace Dependencies

From the repository root:

```bash
pnpm install
```

This installs dependencies for all workspace packages (backend, frontend, scripts, etc.).

### Troubleshooting pnpm build scripts

If you see `[ERR_PNPM_IGNORED_BUILDS]` errors for `esbuild`, approve builds:

```bash
pnpm approve-builds
```

Then run install again if needed.

## Step 2: Configure Backend Environment

Create or update `backend/.env` with your PostgreSQL credentials:

```env
DATABASE_URL=postgres://postgres:123456@localhost:5432/portfolio
PORT=8080
VITE_PORT=5173
SESSION_SECRET=changeme_replace_with_strong_secret_32_chars_or_more
JWT_SECRET=changeme_replace_with_strong_secret_32_chars_or_more
```

Replace credentials with your actual PostgreSQL username and password.

## Step 3: Create Database

From the repository root:

```bash
cd backend
node scripts/create_db.mjs "postgres://postgres:123456@localhost:5432/postgres" "portfolio"
cd ..
```

Or set environment variables:

```bash
ADMIN_DATABASE_URL=postgres://postgres:123456@localhost:5432/postgres \
TARGET_DB_NAME=portfolio \
node backend/scripts/create_db.mjs
```

The script creates the `portfolio` database if it doesn't exist.

## Step 4: Push Database Schema

Push the Drizzle ORM schema to your database:

```bash
cd backend
pnpm run db:push
cd ..
```

This creates all tables defined in `backend/src/db/schema/`.

## Step 5: Seed Demo Data (Optional)

Populate the database with sample portfolio content:

```bash
cd backend
pnpm run db:seed
cd ..
```

This creates:
- Portfolio settings
- Sample projects, skills, experience, education
- Blog posts and certificates
- Admin user: `admin@portfolio.com` (password from seed script)

## Step 6: Build for Development

Build both frontend and backend:

```bash
pnpm --filter @workspace/backend run build
pnpm --filter @workspace/frontend run build
```

Or from root with single command:

```bash
pnpm run build
```

Both builds should complete without errors.

## Step 7: Start Development Servers

In **terminal 1**, start the backend:

```bash
cd backend
pnpm run dev
```

Backend will run on `http://localhost:8080`

In **terminal 2**, start the frontend:

```bash
cd frontend
pnpm run dev
```

Frontend will run on `http://localhost:5173`

## Verification Checklist

- ✅ `pnpm install` completes without errors
- ✅ PostgreSQL database `portfolio` created
- ✅ `pnpm run db:push` applies schema successfully
- ✅ `pnpm run db:seed` populates demo data
- ✅ Backend starts on port 8080
- ✅ Frontend starts on port 5173
- ✅ Frontend can fetch data from `/api/*` endpoints
- ✅ Admin dashboard accessible at `/admin`

## Troubleshooting

| Issue | Solution |
|-------|----------|
| PostgreSQL connection failed | Verify credentials in `backend/.env` and PostgreSQL is running |
| `DATABASE_URL is required` | Ensure `DATABASE_URL` is set in `backend/.env` |
| Build errors | Run `pnpm install` again, then `pnpm approve-builds` |
| Port 8080/5173 already in use | Change `PORT` and `VITE_PORT` in `backend/.env` |
| Module not found errors | Delete `node_modules` and `pnpm-lock.yaml`, then run `pnpm install` |

## Next Steps

- See [start-stop.md](start-stop.md) for running development servers
- See [architecture.md](architecture.md) for project structure and tech stack
- See [deployment-guide.md](deployment-guide.md) for production setup
