Auth Migration: Replit OIDC → Local JWT

Summary
-------
- Replaced Replit OIDC (openid-client) with a local JWT + bcrypt authentication flow.
- Added `admins` table and seeded a default admin `admin@portfolio.com` / `Admin@123`.
- New endpoints: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/user`.
- JWT is issued in an HTTP-only cookie named `sid`.

Files changed
-------------
- `backend/src/lib/auth.ts` — JWT sign/verify and credential validation.
- `backend/src/middlewares/authMiddleware.ts` — verify JWT and attach `req.user`.
- `backend/src/routes/auth.ts` — new login/logout/user routes.
- `backend/src/db/schema/auth.ts` — added `admins` table.
- `backend/src/db/seed.ts` — seeds default admin with bcrypt-hashed password.
- `frontend/src/pages/admin/login.tsx` — now posts email/password to `/api/auth/login`.
- `backend/package.json` — removed `openid-client`, added `jsonwebtoken` and `bcryptjs`.

Environment
-----------
- New/required env var: `SESSION_SECRET` (32+ random characters).
- `REPL_ID` and `ISSUER_URL` are no longer used and can be removed from environment.

Migration notes
---------------
1. Update `backend/.env` with a strong `SESSION_SECRET` and ensure `DATABASE_URL` is correct.
2. Run the seed to create default admin:

```bash
cd backend
pnpm run db:seed
```

The seeded default admin is `admin@portfolio.com` / `Admin@123`. Change the password after first login.

3. Start backend and frontend and sign in via the admin form at `/admin/login` using `admin@portfolio.com` / `Admin@123` (change after first login).

Security notes
--------------
- The admin password is stored as a bcrypt hash. Rotate the seeded password immediately in production.
- JWT tokens are stateless; to revoke tokens you must implement a token blacklist or change `SESSION_SECRET`.
