---
paths:
  - "src/**"
---
# Code Standards (Next.js / React / Tailwind)

## Structure

- `src/app/` — App Router pages/layout/globals; `src/components/` — presentational components (one concern per file, kebab-case); `src/lib/` — pure logic and the GitHub API layer; `src/constants/` — site copy and config (`site.ts`); `src/test/` — shared setup and fixtures.
- Site-visible text, links, and contact details belong in `src/constants/site.ts` — never hardcode copy inside components.

## Data Fetching (`src/lib/github.ts`)

- All GitHub API calls live in `src/lib/github.ts`; components and pages never `fetch` directly.
- Every call follows the established pattern: optional `GITHUB_TOKEN` header via `getGithubHeaders()`, ISR caching with an explicit `next: { revalidate: N }`, an explicit response mapper that narrows `Record<string, unknown>` to the domain types in `github.types.ts`, and graceful degradation (`return []` / `return null` on any failure). Never throw or let fetch errors escape to the render path.
- Know the GitHub quirks: stats endpoints may answer `202` while computing (retry once, then give up); events need filtering to `SUPPORTED_EVENT_TYPES`. Extend these patterns rather than inventing new ones.

## Components & Styling

- Tailwind 4 utility classes only; no other CSS framework, no inline `style` objects except genuinely dynamic values.
- Server Components by default (`async` components in `src/app/`); add `'use client'` only when interactivity demands it.
- Hydration safety: anything derived from `Date.now()` or time-sensitive values must be computed server-side and passed as props (see the `isStale` computation in `page.tsx`) — never computed during client render.
- Keep accessibility on every interactive element: labels, focus-visible styles, `aria-label` on icon-only elements.

## Testing

- Vitest + Testing Library + jsdom; tests are **colocated** next to their source (`repo-card.test.tsx` beside `repo-card.tsx`), not in a separate tree.
- Shared mock data goes in `src/test/fixtures.ts`; setup in `src/test/setup.ts`. Add fixtures for new API shapes rather than inline literals in tests.
- Pure logic (`aggregate-stats`, `compute-streak`, `format-time`) lives as small exported functions with exhaustive unit tests — keep new logic in `src/lib/` testable and framework-free.
- Before committing: `npm run lint`, `npx tsc --noEmit`, and `npm test` for anything touched.