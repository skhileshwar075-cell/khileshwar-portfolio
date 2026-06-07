# Render Deployment

## Summary

This repository is a pnpm workspace with a root-level `pnpm-workspace.yaml` and `pnpm-lock.yaml`. The backend package uses `catalog:` dependencies such as `drizzle-orm`, `zod`, and `@types/node`, so Render must deploy from the repository root.

The Render build failure is caused by an unnecessary `corepack enable` command. Render already provides `pnpm` in the build image, and `corepack enable` attempts to modify `/usr/bin/pnpm` on a read-only filesystem.

## Correct Render Service Configuration

- Root Directory: repository root (the folder containing `package.json`, `pnpm-workspace.yaml`, and `.npmrc`)
- Build Command:
  ```bash
  pnpm install --include=dev
  pnpm --filter @workspace/backend run build
  ```
- Start Command:
  ```bash
  pnpm --filter @workspace/backend run start
  ```
- Node Version: `24.x` (Render default is `24.14.1`, local verified `24.14.0`)

## Why the Root Directory Must Be the Repository Root

The backend package uses `catalog:` dependency notation:

- `drizzle-orm: catalog:`
- `zod: catalog:`
- `@types/node: catalog:`

These package specs are resolved from the root workspace configuration in `pnpm-workspace.yaml` and the root lockfile. Deploying only the `backend/` folder will not resolve these catalog packages correctly.

## Recommended Build Command Details

Use the exact build commands below and remove any `corepack enable` step.

```bash
pnpm install --include=dev
pnpm --filter @workspace/backend run build
```

Notes:

- `pnpm install --include=dev` ensures development dependencies needed for the build are installed even if `NODE_ENV=production` is set in Render.
- `pnpm --filter @workspace/backend run build` runs only the backend build and avoids unnecessary workspace-wide frontend build steps during deployment.

## Recommended Start Command

```bash
pnpm --filter @workspace/backend run start
```

This runs `node --enable-source-maps ./dist/index.mjs` from the backend package and uses the compiled backend output.

## Required Environment Variables

At minimum, set these environment variables in Render:

- `DATABASE_URL` — PostgreSQL connection string for the backend database
- `SESSION_SECRET` — secret used for session signing
- `JWT_SECRET` — secret used for JWT signing
- `NODE_ENV=production`
- `CLIENT_URL` — frontend URL used by CORS and client integration

Optional / useful environment variables:

- `PORT` — Render provides a port value automatically, but you can set a custom port if needed.

## Neon Database Setup

1. Create a Neon project and database.
2. Copy the Neon connection string.
3. Set `DATABASE_URL` in Render to the Neon connection string.
4. Locally, you can run backend database migrations or seed data with:
   ```bash
   pnpm --filter @workspace/backend run db:push
   pnpm --filter @workspace/backend run db:seed
   ```

## Local Development Compatibility

The repository remains unchanged for local development. The following commands still work as before:

- `pnpm install`
- `pnpm run build`
- `pnpm start`
- `pnpm dev`

Local verification:

- `backend/dist/index.mjs` exists and is the backend build output.
- `backend/package.json` start script is `node --enable-source-maps ./dist/index.mjs`.
- Local pnpm version is `11.2.2` and Node version is `24.14.0`.

## Troubleshooting

### Build fails with `EROFS: read-only file system, unlink '/usr/bin/pnpm'`

This means the Render build command still contains `corepack enable`. Remove that command. Render already provides a usable pnpm binary.

### Deployment fails when `catalog:` packages cannot resolve

Ensure the Render service root is set to the repository root, not `backend/`.

### Build fails due missing dev dependencies

If `NODE_ENV=production` is defined in Render, make sure the build command installs dev dependencies:

```bash
pnpm install --include=dev
```

### Start fails after build

Confirm Render uses the root start command and the backend package start script:

```bash
pnpm --filter @workspace/backend run start
```
