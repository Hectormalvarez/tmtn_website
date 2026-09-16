#!/usr/bin/env bash
set -euo pipefail

# deploy.sh — Production deployment orchestrator (blue/green with rollback).
#
# Two modes:
#   * Image mode (CD): scripts/deploy-wrapper.sh sets IMAGE_TAG=sha-<40-hex>,
#     and this script pulls ghcr.io/hectormalvarez/tmtn-website:<tag> and
#     swaps it in after health verification. No git operations.
#   * Build mode (manual): builds the image locally from the current checkout
#     (git pull included) — the legacy path, kept for manual host deploys.
#
# Safety features (mirrors mgdrywallusa-website):
#   * Lockfile (.deploy-in-progress) so watchdog/manual deploys never race.
#   * .last-deploy.json status file written on every exit.
#   * Blue/green: the live container is only replaced after a temp container
#     passes health checks, so a failed deploy leaves prod untouched.

# Resolve project root from script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# --- Load Local Environment ---
if [[ -f .env ]]; then
  set -a
  # shellcheck source=/dev/null
  source .env
  set +a
fi

# --- Configuration ---
GHCR_IMAGE="${GHCR_IMAGE:-ghcr.io/hectormalvarez/tmtn-website}"
LOCKFILE="$SCRIPT_DIR/.deploy-in-progress"
STATUS_FILE="$SCRIPT_DIR/.last-deploy.json"

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC}  $(date '+%H:%M:%S') $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC}  $(date '+%H:%M:%S') $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $(date '+%H:%M:%S') $*"; }

# --- Usage ---
usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS]

Deploy tmtn_website containers.

Options:
  -p, --prod       Deploy production only (blue/green)
  -d, --dev        Deploy dev only (simple rebuild)
  -a, --all        Deploy both prod and dev (default)
  --no-cleanup     Skip Docker image/container pruning
  -h, --help       Show this help message

Environment:
  IMAGE_TAG=<sha-...>   Deploy a pushed GHCR image instead of building locally
                        (set automatically by scripts/deploy-wrapper.sh for CD)
EOF
  exit 0
}

# --- Defaults ---
DEPLOY_PROD=false
DEPLOY_DEV=false
CLEANUP=true

# --- Parse flags ---
if [[ $# -eq 0 ]]; then
  DEPLOY_PROD=true
  DEPLOY_DEV=true
fi

while [[ $# -gt 0 ]]; do
  case "$1" in
    -p|--prod)
      DEPLOY_PROD=true
      shift
      ;;
    -d|--dev)
      DEPLOY_DEV=true
      shift
      ;;
    -a|--all)
      DEPLOY_PROD=true
      DEPLOY_DEV=true
      shift
      ;;
    --no-cleanup)
      CLEANUP=false
      shift
      ;;
    -h|--help)
      usage
      ;;
    *)
      log_error "Unknown option: $1"
      usage
      ;;
  esac
done

# --- Extensibility Hooks ---
notify() {
  local status="$1"
  local message="$2"
  log_info "Notification [$status]: $message"
}

# --- Lockfile + status (single-writer deploys, observable on the host) ---
if [[ -f "$LOCKFILE" ]]; then
  log_error "Another deploy is in progress ($LOCKFILE) — aborting."
  exit 1
fi
touch "$LOCKFILE"

on_exit() {
  local rc=$?
  rm -f "$LOCKFILE"
  local status=error
  if [[ $rc -eq 0 ]]; then
    status=ok
  fi
  printf '{"status":"%s","exit_code":%s,"image_tag":"%s","finished_at":"%s"}\n' \
    "$status" "$rc" "${IMAGE_TAG:-local}" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    > "$STATUS_FILE"
  if [[ $rc -ne 0 ]]; then
    log_error "deploy.sh FAILED with exit code $rc — last steps above"
  fi
}
trap on_exit EXIT

# Generic Port Resolver (No Hardcoded Defaults)
resolve_port() {
  local var_name="$1"
  local current_val="${!var_name:-}"

  if [[ -n "$current_val" ]]; then
    echo "$current_val"
    return 0
  fi

  # Fail fast if running non-interactively (CI/cron) and variable is unset
  if [[ ! -t 0 ]]; then
    log_error "Required variable $var_name is not defined in environment or .env" >&2
    exit 1
  fi

  local user_input=""
  while [[ -z "$user_input" ]]; do
    read -r -p "$(echo -e "${YELLOW}[PROMPT]${NC} Enter host port for $var_name: ")" user_input
    if [[ -z "$user_input" ]]; then
      echo -e "${RED}[ERROR]${NC} Port cannot be empty." >&2
    elif ! [[ "$user_input" =~ ^[0-9]+$ ]] || [ "$user_input" -le 0 ] || [ "$user_input" -gt 65535 ]; then
      echo -e "${RED}[ERROR]${NC} Invalid port. Must be an integer between 1 and 65535." >&2
      user_input=""
    fi
  done

  echo "$user_input"
}

# Health check
health_check() {
  local port="$1"
  local max_attempts="${2:-30}"
  local interval=2
  local endpoint="/"

  log_info "Health check on port $port (max ${max_attempts} attempts)..."
  for ((i=1; i<=max_attempts; i++)); do
    if curl -sf "http://127.0.0.1:${port}${endpoint}" > /dev/null 2>&1; then
      log_info "Health check passed (attempt $i/$max_attempts)"
      return 0
    fi
    if [[ $i -lt $max_attempts ]]; then
      sleep "$interval"
    fi
  done

  log_error "Health check failed after $max_attempts attempts"
  return 1
}

# --- Git Pull (build mode only) ---
pull_latest() {
  log_info "Pulling latest changes..."
  git pull origin main --ff-only || {
    log_error "Fast-forward merge failed. Manual intervention required."
    exit 1
  }
}

# --- Cloudflare edge cache purge (best-effort, never blocks) ---
purge_cf_cache() {
  if [[ -n "${CLOUDFLARE_API_TOKEN:-}" && -n "${CLOUDFLARE_ZONE_ID:-}" ]]; then
    log_info "Purging Cloudflare edge cache..."
    local purge_status
    purge_status=$(curl -s -o /dev/null -w '%{http_code}' -X POST \
      "https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache" \
      -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
      -H "Content-Type: application/json" \
      --data '{"purge_everything":true}' || echo "curl-failed")
    if [[ "$purge_status" == "200" ]]; then
      log_info "Cloudflare edge cache purged"
    else
      log_warn "Cloudflare purge failed (HTTP $purge_status) — non-blocking"
    fi
  else
    log_info "CLOUDFLARE_API_TOKEN/CLOUDFLARE_ZONE_ID not set — skipping cache purge"
  fi
}

# --- Deploy Development ---
deploy_dev() {
  log_info "=== Deploying Development ==="

  local dev_port
  dev_port="$(resolve_port "DEV_PORT")"

  DEV_PORT="$dev_port" docker compose --profile dev build web-dev
  DEV_PORT="$dev_port" docker compose --profile dev up -d web-dev

  notify "success" "Dev environment deployed (port $dev_port)"
  log_info "Dev running on port $dev_port"
}

# --- Deploy Production (Blue/Green) ---
deploy_prod() {
  log_info "=== Deploying Production (Blue/Green) ==="

  local prod_port
  prod_port="$(resolve_port "PORT")"
  
  # Temporary verification container port
  local temp_port=$((prod_port + 1))
  local temp_name="tmtn-prod-temp"

  local image
  if [[ -n "${IMAGE_TAG:-}" ]]; then
    # Image mode (CD): pull the pushed image for this commit.
    image="${GHCR_IMAGE}:${IMAGE_TAG}"
    log_info "Pulling $image..."
    docker pull "$image"
  else
    # Build mode (manual): build from the local checkout.
    log_info "Building new production image..."
    docker compose build web
    image="tmtn_website-web:latest"
  fi

  # Clean up leftover temp container if present
  docker rm -f "$temp_name" >/dev/null 2>&1 || true

  log_info "Starting temporary verification container on port $temp_port..."
  docker run -d \
    --name "$temp_name" \
    -e GITHUB_TOKEN="${GITHUB_TOKEN:-}" \
    -e HOSTNAME="${HOSTNAME:-0.0.0.0}" \
    -e PORT=3000 \
    -p "127.0.0.1:${temp_port}:3000" \
    "$image"

  if health_check "$temp_port" 30; then
    log_info "New container healthy — swapping to live port $prod_port..."

    # Tear down verification container and existing live container
    docker rm -f "$temp_name" >/dev/null 2>&1 || true
    docker rm -f tmtn-prod >/dev/null 2>&1 || true

    # Launch live production container
    docker run -d \
      --name tmtn-prod \
      -e GITHUB_TOKEN="${GITHUB_TOKEN:-}" \
      -e HOSTNAME="${HOSTNAME:-0.0.0.0}" \
      -e PORT=3000 \
      -p "127.0.0.1:${prod_port}:3000" \
      --restart unless-stopped \
      "$image"

    notify "success" "Production deployed (port $prod_port)"
    log_info "Production live on port $prod_port"
    purge_cf_cache
  else
    log_error "Health check failed — old container left untouched (blue/green rollback)"
    docker rm -f "$temp_name" >/dev/null 2>&1 || true
    notify "failure" "Production deployment failed, rolled back"
    exit 1
  fi
}

# --- Cleanup ---
cleanup() {
  if [[ "$CLEANUP" == true ]]; then
    log_info "Pruning old images and stopped containers..."
    docker image prune -f
    docker container prune -f
  else
    log_info "Cleanup skipped (--no-cleanup)"
  fi
}

# --- Main ---
main() {
  log_info "Starting deployment..."

  # Image mode (CD) skips git operations — the image IS the release.
  if [[ -z "${IMAGE_TAG:-}" ]]; then
    pull_latest
  fi

  if [[ "$DEPLOY_PROD" == true ]]; then
    deploy_prod
  fi

  if [[ "$DEPLOY_DEV" == true ]]; then
    deploy_dev
  fi

  cleanup
  log_info "Deployment complete."
}

main