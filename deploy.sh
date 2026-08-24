#!/usr/bin/env bash
set -euo pipefail

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

  # Clean up leftover temp container if present
  docker rm -f "$temp_name" >/dev/null 2>&1 || true

  log_info "Building new production image..."
  docker compose build web

  log_info "Starting temporary verification container on port $temp_port..."
  docker run -d \
    --name "$temp_name" \
    -e GITHUB_TOKEN="${GITHUB_TOKEN:-}" \
    -e HOSTNAME="${HOSTNAME:-0.0.0.0}" \
    -e PORT=3000 \
    -p "127.0.0.1:${temp_port}:3000" \
    tmtn_website-web:latest

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
      tmtn_website-web:latest

    notify "success" "Production deployed (port $prod_port)"
    log_info "Production live on port $prod_port"
  else
    log_error "Health check failed — rolling back"
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
  pull_latest

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