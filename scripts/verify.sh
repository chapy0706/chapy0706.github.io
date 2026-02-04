#!/usr/bin/env bash
# ./scripts/verify.sh
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

if ! command -v pnpm >/dev/null 2>&1; then
  echo "ERROR: pnpm not found. Run: corepack enable && pnpm install" >&2
  exit 1
fi

echo "==> typecheck"
pnpm run -s typecheck

echo "==> build"
pnpm run -s build

echo "OK: verify passed"
