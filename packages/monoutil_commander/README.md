# Monoutil Commander

A locally run commander UI to work with packages and monorepos on your local machine.

- Backend: Bun + Hono
- Frontend: Vite + React
- Config storage: User temp folder (e.g. %TEMP%\monoutil_commander\config.json)
- Linking: Uses `local-package-link` to copy packages into node_modules without symlinks

## Dev

From the monorepo root (or this package folder), install deps and run dev:

```sh
bun install
# Option A (from package folder):
cd packages/monoutil_commander && bun run dev
# Option B (if bun workspaces are configured):
bun run --filter @monoutil/commander dev
```

This starts:
- Backend on http://localhost:8787
- Frontend on http://localhost:5174 (proxying /api to backend)

## API

- GET /api/health
- GET /api/projects
- POST /api/projects { path: string; name?: string; type?: "monorepo" | "single"; id?: string }
- DELETE /api/projects/:id
- POST /api/link { projectPath: string; watch?: boolean }

`/api/link` executes `local-package-link` in the given project's working directory. Ensure your project has a `link-local-packages.json` (and optional `link-local-packages.local.json`) configured as per `local-package-link` docs.

## Notes
- Projects are persisted in `%TEMP%/monoutil_commander/config.json`.
- Watch mode returns immediately with a PID; stop it using your OS process tools if necessary.
