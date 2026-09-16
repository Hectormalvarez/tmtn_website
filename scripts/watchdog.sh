#!/bin/sh
# watchdog.sh — server-side converge loop.
#
# Install as a cron entry on the host (every 15 min):
#   */15 * * * * /home/hadev/Projects/Code/tmtn_website/scripts/watchdog.sh >> /tmp/tmtn-watchdog.log 2>&1
#
# Defense-in-depth: any prod container that is missing or stopped (deploy
# kill, manual accident, anything) is brought back by an idempotent
# `compose up -d`. It is a no-op while the stack is healthy and while a
# deploy is in progress (lockfile).
set -euo pipefail

DIR="/home/hadev/Projects/Code/tmtn_website"
LOCKFILE="$DIR/.deploy-in-progress"

# Never race a live deploy — deploy.sh creates/removes this lockfile.
if [ -f "$LOCKFILE" ]; then
  exit 0
fi

cd "$DIR"
docker compose up -d web cloudflared >/dev/null 2>&1
