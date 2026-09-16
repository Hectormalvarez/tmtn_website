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
  - Managed via `docker-compose.yml` on dedicated host (prod `web` + containerized `cloudflared` tunnel, dev behind the `dev` profile).
  - Ingress via a dedicated Cloudflare tunnel (`tmtn-prod`) running inside the compose network.
  - CD: GitHub Actions pushes `ghcr.io/hectormalvarez/tmtn-website:{latest,sha-*}` and deploys over SSH through Cloudflare Access.

## CI/CD

- **CI** (`.github/workflows/ci.yml`): lint + `tsc --noEmit` + Vitest + compose syntax check on every push/PR to `main`.
- **Release** (`.github/workflows/release.yml`): on green CI on `main`, builds/pushes the image to GHCR (`latest` + `sha-<sha>` tags), then SSHes to the host through Cloudflare Access (`ssh.taylormadetech.net`) and runs `deploy sha-<sha>`.
- **Server side:**
  - `scripts/deploy-wrapper.sh` — the only command the deploy SSH key may run (forced command in `authorized_keys`); validates the `deploy sha-<40-hex>` contract.
  - `deploy.sh` — in image mode, pulls the tagged GHCR image, verifies it in a temp container (blue/green), then swaps prod; writes `.last-deploy.json` and uses a `.deploy-in-progress` lockfile. Build mode (`./deploy.sh`) remains for manual deploys.
  - `scripts/watchdog.sh` — cron converge loop (every 15 min, skip while a deploy holds the lockfile):
    `*/15 * * * * /home/hadev/Projects/Code/tmtn_website/scripts/watchdog.sh >> /tmp/tmtn-watchdog.log 2>&1`

### Required GitHub secrets

| Secret | Value |
| :--- | :--- |
| `CF_ACCESS_ID` / `CF_ACCESS_SECRET` | Access service token `tmtn-deploy` (stored in `~/.cloudflare/tokens.env` on the workstation) |
| `CF_SSH_KEY` | Private key `~/.cloudflare/keys/tmtn-deploy_ed25519` |
| `CF_SSH_KNOWN_HOSTS` | `ssh.taylormadetech.net` host key (from `ssh-keyscan`) |

### Host `authorized_keys` line

```
command="/home/hadev/Projects/Code/tmtn_website/scripts/deploy-wrapper.sh" ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIKMZW/4LmuiSufZ9PUxAAmg80dx0FFKGFuItUBGvksq4 gha-tmtn-deploy
```


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
