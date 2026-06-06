---
name: Vite hoist pattern
description: pnpm must hoist vite-related packages to workspace root so Vite's node_modules/.vite-temp config runner can resolve them
---

# Vite .vite-temp resolution bug in pnpm workspaces

## The rule
Always add these lines to `.npmrc` in any pnpm workspace that has a Vite frontend:
```
public-hoist-pattern[]=vite
public-hoist-pattern[]=@vitejs/*
public-hoist-pattern[]=@tailwindcss/*
public-hoist-pattern[]=@replit/*
```

**Why:** Vite compiles its config file to a temp `.mjs` file inside `node_modules/.vite-temp/`. Node.js module resolution does NOT traverse upward past a `node_modules` folder boundary, so it can't find `@vitejs/plugin-react` (etc.) in the parent `node_modules/`. Hoisting these packages to the workspace root `node_modules/` fixes this.

**How to apply:** After changing `.npmrc` hoist patterns, you MUST run `rm -rf node_modules && pnpm install` — pnpm refuses to auto-remove `node_modules` without a TTY (`ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY`). The `CI=true` env var also works: `CI=true pnpm install`.
