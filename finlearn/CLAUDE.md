# FinLearn

Gamified web app to teach personal finance (course project).
Stack: React + Vite + TypeScript + Tailwind + TanStack Router (client/) · Express + Drizzle + PostgreSQL + JWT (server/) · pnpm · single .env at the repo root.

## Language
- Code, test names, comments, API messages and test example data: English.
- User-facing UI copy: English for now.
- Project docs (backlog.md, plan.md) are the exception: Spanish.

## Tooling
- pnpm everywhere.
- Docker Compose runs db, server and client (no local Node/Postgres needed). Developer guide (quickstart, tests, production): `docs/docker-guide.md` (Spanish doc).
  - `docker-compose.override.yml` is auto-loaded by Compose and is dev-only (hot-reload, exposed ports). Production must run explicitly with `docker compose -f docker-compose.yml up`.
- GitHub Actions CI: `.github/workflows/ci.yml` lives at the repo root (one level above finlearn/), not in this directory. Runs on push/PRs touching finlearn/: server tests (Postgres 17 service container, env vars set at job level — no .env in CI), client lint+build, and `docker compose -f docker-compose.yml build` (production images only). Developer doc (Spanish): `docs/ci-guide.md`.
- Keep functionality and refactor in separate commits.

## Environment
- One `.env` at the finlearn root, shared by server and client. `.env` is gitignored; `.env.example` is the template, with code defaults documented inline as `# default: <value>`.
- Server: `settings/env.js` loads it once (dotenv) and validates every variable with Zod; missing/invalid config fails fast at startup with a readable error. Consumers import values from `settings/env.js`, never read raw `process.env`.
- `JWT_SECRET` has no default (required). `ACCESS_TOKEN_LIFETIME` defaults to `15m`, `REFRESH_TOKEN_LIFETIME` (reserved, unused until the refresh-token story) defaults to `7d`.
- Client: Vite reads the same `.env` (`envDir: "../"`); runtime values must be `VITE_*` prefixed. In dev, `/api/*` is proxied to the server port from `PORT`.

## Backend (server/)
- Domain modules: `modules/<domain>/` holds the endpoint handlers next to their `*.test.js` files (e.g. `modules/users/register.js` + `register.test.js`).
- Layering: `app.js` only wires routes; `index.js` is the entry point; `settings/db.js` owns the db pool/Drizzle; `settings/env.js` owns config.
- DB access via Drizzle (models in `modules/<domain>/schema.js`). No raw SQL in endpoints. Schema changes: edit the model, run `pnpm drizzle-kit generate` in `server/`, and commit the SQL it adds to `server/drizzle/`. Migrations apply at boot (`migrateToLatest` in `settings/db.js`) and in the tests' `beforeAll`; applied ones are tracked per database in `drizzle.__drizzle_migrations`.
- Input validation with Zod. Shape: valid → proceed; 400 `{ errors: { field: message } }`; 409/401 `{ message }`. Register: email format, nickname present, password ≥ 8 chars. Login: required-field presence only.
- Auth: JWT in `Authorization: Bearer <token>`, signed with sub = user id, exp = ACCESS_TOKEN_LIFETIME. Tokens in localStorage, attached to every request by `client/src/api.ts`.
- Route protection: `middleware/auth.js` exports `requireAuth` (verifies the token and loads the fresh user row into `req.user`; 401 `{ message: 'Invalid or expired session' }`) and `requireRole('admin')` (403, after requireAuth). Wire protected endpoints through them — never verify tokens inline. Roles: `player` (default, everyone registers as one) and `admin`; no self-service — promote manually via SQL until the admin story.
- Do not leak internals: generic 401 ("Wrong email or password") for both wrong email and wrong password; session errors return `401 { message: 'Invalid or expired session' }`.

## Testing
- Endpoint level with Vitest + supertest against `createApp()`; behavior through the public interface only, no logic mirrored from the implementation.
- Tests run against a separate `<DB_NAME>_test` database, auto-created by `settings/test-setup.js`. Never wipe real data.
- Because tests share that database, `fileParallelism: false` in vitest config.
- The client has no tests yet (`test` script is a placeholder). Frontend flows are verified manually until automated.

## Client (client/)
- TanStack Router, file-based: `src/routes/` files are thin entry points that only render; real logic lives in `src/modules/<page>/` with `services/` (API calls), and `hooks/`, `components/`, `models/`, `adapters/` folders created per page only when required.
- One fetch wrapper (`src/api.ts`): attaches the Bearer token from localStorage and is the only place that knows the API base (`VITE_API_BASE_URL`).
