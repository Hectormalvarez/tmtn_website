# TMTN Website — Project Rules

Single Next.js 16 App Router app (React 19, Tailwind 4, strict TypeScript, Node ≥22, `@/*` → `src/*` alias): a personal portfolio rendering live GitHub data (repos, profile, events, commit activity). Deployed as a standalone Docker container behind a Cloudflare tunnel; production deploys are blue/green via `deploy.sh` on the host.

## Canonical Commands

| Purpose | Command |
| :--- | :--- |
| Unit tests (Vitest) | `npm test` |
| Tests in watch mode | `npm run test:watch` |
| Lint (explicit — never runs during build) | `npm run lint` |
| Format | `npm run format` |
| Type check | `npx tsc --noEmit` |
| Production build | `npm run build` |
| Repo audit script | `npm run audit:repos` |

- **`next.config.js` intentionally bypasses ESLint during builds** — a green `npm run build` proves nothing about lint. Always run `npm run lint` and `npx tsc --noEmit` explicitly before declaring work done; run `npm test` when behavior or pure logic changed.
- GitHub API access requires no local stack, so tests and lint run directly on the host (Node 22).

## Safety

- Never edit `.env` (holds `GITHUB_TOKEN`, host ports) or commit its contents. `.env.example` is the documented template.
- Never run `./deploy.sh` (or any `docker compose up/build`) unless explicitly asked — it pulls from `main` and swaps the live production container.
- `next.config.js` security headers (CSP, HSTS, `X-Frame-Options`, COOP/CORP, Permissions-Policy) were deliberately hardened. Never weaken, remove, or add an allowlist entry to them without explicit user request.

## Conventions

- Conventional commits with scopes: `feat(ui): ...`, `fix(security): ...`, `test: ...` (see global Commit Discipline rule).
- Prettier is authoritative (single quotes, semicolons, 2-space, print width 80) and enforced through eslint-plugin-prettier — run `npm run format` if lint flags style.