# Start and Stop

This file describes how to start and stop the frontend and backend locally.

## Start backend

From the repository root:

```bash
cd backend
pnpm run dev
```

Or from the workspace root using the root script:

```bash
pnpm run dev:backend
```

### Backend defaults

- `PORT` defaults to `8080` if not provided
- Backend loads `backend/.env` automatically using `dotenv`

## Start frontend

From the repository root:

```bash
cd frontend
pnpm run dev
```

Or from the workspace root using the root script:

```bash
pnpm run dev:frontend
```

### Frontend defaults

- `PORT` defaults to `5173` if not provided
- `BASE_PATH` defaults to `/` if not provided

## Stop servers

In each terminal running a server, stop the process with:

- `Ctrl+C`

If you started the frontend and backend in separate terminals, stop each terminal independently.

## Optional production build

Build only the frontend for production:

```bash
cd frontend
pnpm run build
```

Or from the repository root:

```bash
pnpm run build:frontend
```
