#!/usr/bin/env node
import { rmSync } from "fs";
import { resolve } from "path";

const root = new URL("..", import.meta.url).pathname;

for (const lockfile of ["package-lock.json", "yarn.lock"]) {
  try {
    rmSync(resolve(root, lockfile), { force: true });
  } catch {
    // ignore — file may not exist
  }
}

const agent = process.env.npm_config_user_agent ?? "";
if (!agent.startsWith("pnpm/")) {
  process.stderr.write(
    "ERROR: Please use pnpm to install dependencies.\n" +
      "  Run: corepack enable && pnpm install\n"
  );
  process.exit(1);
}
