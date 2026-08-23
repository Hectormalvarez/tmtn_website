# Taylor Made Technology Network (TMTN)

A professional portfolio and landing page showcasing
IT infrastructure and software automation projects,
featuring dynamic GitHub repository integration.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Standalone Output)
- **Library:** React 19
- **Styling:** Tailwind CSS 4.0
- **Language:** TypeScript

## Architecture & Deployment

- **Data Fetching:**
  - Server-side data fetching with 3600s revalidation cache.
  - Optimizes load times and prevents API rate limiting.

- **Build Rules:**
  - `next.config.js` bypasses ESLint errors during builds.

- **Deployment:**
  - Multi-stage Docker container (`node:22-alpine`).
  - Managed via `docker-compose.yml` on dedicated host.
  - Ingress via Cloudflare Zero Trust (`cloudflared` tunnel).

## Quick Reference

### Ports (configurable via `.env`)

| Service         | Host Port | Purpose     |
| --------------- | --------- | ----------- |
| `web` (prod)    | `9150`    | Live site   |
| `web-dev` (dev) | `8889`    | Dev/staging |

### Docker Compose

```bash
docker compose up -d web                          # Start prod
docker compose --profile dev up -d web-dev        # Start dev
docker compose --profile dev stop web-dev         # Stop dev
docker compose up -d --build web                  # Rebuild prod
```

### Deploy Script (`deploy.sh`)

```bash
./deploy.sh           # Deploy both prod + dev
./deploy.sh -p        # Prod only (blue/green with health check)
./deploy.sh -d        # Dev only (simple rebuild)
./deploy.sh --no-cleanup  # Skip image pruning
./deploy.sh -h        # Show help
```

The script auto-detects its location, pulls latest code, and for production performs a blue/green swap with health verification before cutting over.
