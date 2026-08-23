#!/usr/bin/env bash
set -euo pipefail

# Resolve project root from script location
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# --- Colors ---
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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

# Notification system (stub — add webhook/Slack/email here later)
# Usage: notify "success" "Production deployed"
notify() {
  local status="$1"
  local message="$2"
  # TODO: Integrate notification provider
  # Example webhook:
  # curl -sf -X POST "${WEBHOOK_URL:-}" \
  #   -H "Content-Type: application/json" \
  #   -d "{\"status\":\"$status\",\"message\":\"$message\"}" || true
  log_info "Notification [$status]: $message"
}

# Health check
# Usage: health_check 3000 30
health_check() {
  local port="$1"
  local max_attempts="${2:-30}"
  local interval=2
  local endpoint="/"

  log_info "Health check on port $port (max ${max_attempts} attempts)..."
  for ((i=1; i<=max_attempts; i++)); do
    if curl -sf "http://localhost:${port}${endpoint}" > /dev/null 2>&1; then
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

# --- Git Pull ---
pull_latest() {
  log_info "Pulling latest changes..."
  git pull origin main --ff-only || {
    log_error "Fast-forward merge failed. Manual intervention required."
    exit 1
  }
}

# --- Deploy Development ---
deploy_dev() {
  log_info "=== Deploying Development ==="

  docker compose --profile dev build web-dev
  docker compose --profile dev up -d web-dev

  notify "success" "Dev environment deployed"
  log_info "Dev running on port ${DEV_PORT:-8889}"
}

# --- Deploy Production (Blue/Green) ---
deploy_prod() {
  log_info "=== Deploying Production (Blue/Green) ==="

  local prod_port="${PORT:-9150}"
  local temp_port=9151
  local temp_name="tmtn-prod-temp"

  # Build new image
  log_info "Building new production image..."
  docker compose build web

  # Start temp container on alternate port
  log_info "Starting temp container on port $temp_port..."
  docker run -d \
    --name "$temp_name" \
    --env-file .env \
    -p "127.0.0.1:${temp_port}:3000" \
    tmtn_website-web:latest

  # Health check
  if health_check "$temp_port" 30; then
    log_info "New container healthy — swapping..."

    # Stop old container
    docker stop tmtn-prod 2>/dev/null || true
    docker rm tmtn-prod 2>/dev/null || true

    # Promote temp container
    docker rename "$temp_name" tmtn-prod
    docker stop tmtn-prod
    docker run -d \
      --name tmtn-prod \
      --env-file .env \
      -p "127.0.0.1:${prod_port}:3000" \
      --restart unless-stopped \
      tmtn_website-web:latest

    notify "success" "Production deployed (port $prod_port)"
    log_info "Production live on port $prod_port"
  else
    # Rollback — remove temp, keep old running
    log_error "Health check failed — rolling back"
    docker stop "$temp_name" 2>/dev/null || true
    docker rm "$temp_name" 2>/dev/null || true

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
