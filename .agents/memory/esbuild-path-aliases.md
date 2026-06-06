---
name: esbuild path aliases
description: esbuild ignores TypeScript tsconfig paths; must add matching alias entries in build.mjs
---

# esbuild does not read tsconfig paths

## The rule
Whenever `tsconfig.json` defines `paths` (e.g. `"@workspace/db": ["./src/db/index.ts"]`), mirror every entry in the esbuild config's `alias` map in `build.mjs`:

```js
const srcDir = path.resolve(artifactDir, "src");
// inside the esbuild() call:
alias: {
  "@workspace/db": path.resolve(srcDir, "db/index.ts"),
  "@workspace/api-zod": path.resolve(srcDir, "validators/index.ts"),
},
```

**Why:** esbuild resolves modules independently and does not read `tsconfig.json` `paths` by default. TypeScript path aliases that work for `tsc` will silently break at bundle time unless you add the `alias` map.

**How to apply:** Any time you add or change a `paths` entry in `backend/tsconfig.json`, add the matching `alias` entry to `backend/build.mjs`.
