#!/bin/sh
# deploy-wrapper.sh — the ONLY command the gha-tmtn-deploy SSH key may run.
# The authorized_keys entry for this key carries a forced command pointing
# here, so even a compromised key cannot open a shell: it can only deploy.
#
# GitHub Actions sends exactly:   deploy sha-<40-hex-commit>
# Anything else is refused.
set -euo pipefail

CMD="${SSH_ORIGINAL_COMMAND:-}"
TAG="${CMD#deploy }"

if [ "$CMD" = "$TAG" ] || [ -z "$TAG" ]; then
  echo '{"status":"error","message":"refused: command must be `deploy sha-<40-hex>`"}'
  exit 1
fi

if ! printf '%s' "$TAG" | grep -qE '^sha-[0-9a-f]{40}$'; then
  echo '{"status":"error","message":"refused: bad image tag"}'
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# Keep the host checkout current BEFORE exec'ing deploy.sh: in image mode the
# checkout is the source of the deploy tooling itself, and a stale checkout
# would run stale deploy logic against the fresh image. Safe here because the
# pull happens before the exec — deploy.sh is loaded fresh by the new process.
git -C "$SCRIPT_DIR" pull origin main --ff-only >>"$SCRIPT_DIR/.deploy-git-pull.log" 2>&1 \
  || echo '{"status":"warning","message":"git pull failed — deploying with existing checkout"}'

exec env IMAGE_TAG="$TAG" "$SCRIPT_DIR/deploy.sh" -p

