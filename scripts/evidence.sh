#!/usr/bin/env bash
# ./scripts/evidence.sh
# Purpose:
#   Run a quality gate command (ci/verify) and persist its full output as evidence.
# Output:
#   out/evidence/YYYYMMDD-HHMMSS_<shortsha>_<command>.log
#
# Usage:
#   ./scripts/evidence.sh ci
#   ./scripts/evidence.sh verify

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

cmd="${1:-ci}"
case "${cmd}" in
  ci)     runner=(./scripts/ci.sh) ;;
  verify) runner=(./scripts/verify.sh) ;;
  *)
    echo "ERROR: unknown command '${cmd}'. Use: ci | verify" >&2
    exit 2
    ;;
esac

mkdir -p out/evidence

# Use UTC for filenames (stable across machines) + keep local timestamp in the log.
file_ts="$(date -u +'%Y%m%d-%H%M%S')"
utc_ts="$(date -u +'%Y-%m-%dT%H:%M:%SZ')"
local_ts="$(date +'%Y-%m-%dT%H:%M:%S%z')"

shortsha="nogit"
branch="unknown"
repo="unknown"

if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  shortsha="$(git rev-parse --short HEAD 2>/dev/null || echo 'nogit')"
  branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')"
  repo="$(git rev-parse --show-toplevel 2>/dev/null || echo 'unknown')"
fi

node_ver="n/a"
pnpm_ver="n/a"
astro_ver="n/a"

if command -v node >/dev/null 2>&1; then
  node_ver="$(node -v 2>/dev/null || echo 'n/a')"
fi

if command -v pnpm >/dev/null 2>&1; then
  pnpm_ver="$(pnpm -v 2>/dev/null || echo 'n/a')"
  astro_ver="$(pnpm exec astro --version 2>/dev/null || echo 'n/a')"
fi

log="out/evidence/${file_ts}_${shortsha}_${cmd}.log"

# Write metadata header first.
{
  echo "timestamp_utc: ${utc_ts}"
  echo "timestamp_local: ${local_ts}"
  echo "repo: ${repo}"
  echo "branch: ${branch}"
  echo "sha: ${shortsha}"
  echo "command: ${cmd}"
  echo "node: ${node_ver}"
  echo "pnpm: ${pnpm_ver}"
  echo "astro: ${astro_ver}"
  echo "---"
  echo "==> run: ${runner[*]}"
} > "${log}"

# Run and capture full output (stdout+stderr) into the log.
set +e
{
  "${runner[@]}"
} 2>&1 | tee -a "${log}"
exit_code="${PIPESTATUS[0]}"
set -e

echo "---" >> "${log}"
echo "exit_code: ${exit_code}" >> "${log}"

if [[ "${exit_code}" -ne 0 ]]; then
  echo "NG: ${cmd} failed (exit ${exit_code})" >&2
  echo "Evidence: ${log}" >&2
  exit "${exit_code}"
fi

echo "OK: ${cmd} passed"
echo "Evidence: ${log}"
