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
