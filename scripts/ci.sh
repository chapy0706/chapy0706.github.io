#!/usr/bin/env bash
# ./scripts/ci.sh
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

# Ensure pnpm is available and pinned (prefer packageManager + corepack)
if command -v corepack >/dev/null 2>&1; then
  corepack enable >/dev/null 2>&1 || true
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "ERROR: pnpm not found in CI runner. Ensure corepack is enabled or install pnpm." >&2
  exit 1
fi

echo "==> install (frozen)"
pnpm install --frozen-lockfile

echo "==> verify"
./scripts/verify.sh