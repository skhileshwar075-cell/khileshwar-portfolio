# API Documentation

Base URL: `/api`

All protected routes require an authenticated session (Replit Auth). The session cookie is set automatically on login.

## Authentication

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/auth/user` | Get current authenticated user (or `{ user: null }`) |
| GET | `/api/login` | Initiate Replit OIDC login flow |
| GET | `/api/logout` | Clear session and redirect |
| GET | `/api/callback` | OIDC callback handler |

## Projects

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/projects` | No | List projects (supports `?search=`, `?category=`, `?featured=`) |
| POST | `/api/projects` | Yes | Create project |
| GET | `/api/projects/:slug` | No | Get project by slug |
| PUT | `/api/projects/:id` | Yes | Update project |
| DELETE | `/api/projects/:id` | Yes | Delete project |

## Skills

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/skills` | No | List all skills |
| POST | `/api/skills` | Yes | Create skill |
| PUT | `/api/skills/:id` | Yes | Update skill |
| DELETE | `/api/skills/:id` | Yes | Delete skill |

## Experience

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/experience` | No | List experience entries |
| POST | `/api/experience` | Yes | Create entry |
| PUT | `/api/experience/:id` | Yes | Update entry |
| DELETE | `/api/experience/:id` | Yes | Delete entry |

## Education

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/education` | No | List education entries |
| POST | `/api/education` | Yes | Create entry |
| PUT | `/api/education/:id` | Yes | Update entry |
| DELETE | `/api/education/:id` | Yes | Delete entry |

## Certificates

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/certificates` | No | List certificates |
| POST | `/api/certificates` | Yes | Create certificate |
| PUT | `/api/certificates/:id` | Yes | Update certificate |
| DELETE | `/api/certificates/:id` | Yes | Delete certificate |

## Blog

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/blog` | No | List published posts |
| POST | `/api/blog` | Yes | Create post |
| GET | `/api/blog/:slug` | No | Get post by slug |
| PUT | `/api/blog/:id` | Yes | Update post |
| DELETE | `/api/blog/:id` | Yes | Delete post |

## Contact / Messages

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/contacts` | No | Submit contact form |
| GET | `/api/contacts` | Yes | List messages (admin) |
| DELETE | `/api/contacts/:id` | Yes | Delete message |

## Analytics

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/analytics/track` | No | Track a page view |
| GET | `/api/analytics` | Yes | Get analytics data |
| GET | `/api/projects/:id/views` | Yes | Project view stats |

## Settings

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/settings` | No | Get public site settings |
| PUT | `/api/settings` | Yes | Update settings |

## Dashboard

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/dashboard/summary` | Yes | Stats summary for admin dashboard |

## Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/healthz` | Health check (used by deployment) |
