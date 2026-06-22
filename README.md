# Portfolio CMS

A full-stack portfolio content management system for a CS graduate and AI-assisted developer. Features a public-facing portfolio website and a protected admin dashboard for managing all content.

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Approve build scripts if prompted
pnpm approve-builds

# 3. Configure backend environment
# Copy backend/.env.example to backend/.env and update DATABASE_URL

# 4. Create and seed database
cd backend
node scripts/create_db.mjs "postgres://postgres:123456@localhost:5432/postgres" "portfolio"
pnpm run db:push
pnpm run db:seed
cd ..

# 5. Start development servers
# Terminal 1:
cd backend && pnpm run dev

# Terminal 2:
cd frontend && pnpm run dev
```

**Frontend:** http://localhost:5173  
**Backend API:** http://localhost:8080/api  
**Admin Dashboard:** http://localhost:5173/admin

> For detailed setup instructions, see [docs/setup.md](docs/setup.md)

## Project Structure

```
portfolio-cms/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── api/            # Auto-generated React Query hooks + custom fetch
│   │   ├── components/     # UI components (shadcn/ui + custom)
│   │   ├── pages/
│   │   │   ├── public/     # Public portfolio pages
│   │   │   └── admin/      # Admin dashboard pages
│   │   ├── lib/            # Shared utilities & auth hooks
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                # Express 5 REST API
│   ├── src/
│   │   ├── db/             # Drizzle ORM schema & connection
│   │   ├── routes/         # Route handlers (projects, blog, auth…)
│   │   ├── middlewares/    # Auth middleware, etc.
│   │   ├── validators/     # Auto-generated Zod schemas
│   │   └── app.ts
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   │   └── openapi.yaml    # Source of truth for all API contracts
│   ├── drizzle.config.ts
│   └── package.json
│
├── docs/                   # Architecture, API docs, deployment guide
├── .gitignore
└── README.md
```

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, TypeScript, Tailwind CSS, shadcn/ui |
| Routing | Wouter |
| Data fetching | TanStack React Query (auto-generated hooks via Orval) |
| Animation | Framer Motion |
| Backend | Express 5, Node.js 24, TypeScript |
| Database | PostgreSQL + Drizzle ORM |
| Validation | Zod (generated from OpenAPI spec) |
| Auth | Local JWT auth with bcrypt and HTTP-only cookie |

## Public Routes

| Path | Page |
|------|------|
| `/` | Home |
| `/about` | About |
| `/projects` | Projects gallery |
| `/projects/:slug` | Project detail |
| `/skills` | Skills |
| `/experience` | Work experience |
| `/education` | Education |
| `/certifications` | Certifications |
| `/blog` | Blog |
| `/blog/:slug` | Blog post |
| `/contact` | Contact form |

## Admin Routes (require login)

| Path | Page |
|------|------|
| `/admin/login` | Login |
| `/admin/dashboard` | Dashboard overview |
| `/admin/projects` | Manage projects |
| `/admin/skills` | Manage skills |
| `/admin/experience` | Manage experience |
| `/admin/education` | Manage education |
| `/admin/certificates` | Manage certificates |
| `/admin/blog` | Manage blog posts |
| `/admin/contacts` | View messages |
| `/admin/analytics` | Analytics |
| `/admin/settings` | Site settings |

## Docs

- [Architecture](docs/architecture.md)
- [API Documentation](docs/api-documentation.md)
- [Deployment Guide](docs/deployment-guide.md)
