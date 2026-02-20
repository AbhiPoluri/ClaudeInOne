#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CLI_BIN="$ROOT_DIR/dist/index.js"

if [[ ! -f "$CLI_BIN" ]]; then
  echo "dist/index.js not found. Run npm run build first." >&2
  exit 1
fi

TMPDIR="$(mktemp -d /tmp/claudekit-smoke-XXXXXX)"
cleanup() {
  rm -rf "$TMPDIR"
}
trap cleanup EXIT

pushd "$TMPDIR" >/dev/null
node "$CLI_BIN" init --yes >/dev/null
node "$CLI_BIN" doctor --report >/dev/null
[[ -d .claude ]]
[[ -f CLAUDE.md ]]
[[ -d docs ]]
[[ -d plans ]]
[[ -d journals ]]

printf 'custom\n' > CLAUDE.md
node "$CLI_BIN" init --yes >/tmp/claudekit-smoke-init.log
if ! grep -q 'Backup created at' /tmp/claudekit-smoke-init.log; then
  echo "Expected backup creation message not found" >&2
  exit 1
fi

node "$CLI_BIN" uninstall >/dev/null
[[ ! -d .claude ]]
[[ ! -f CLAUDE.md ]]
[[ ! -d docs ]]
[[ ! -d plans ]]
[[ ! -d journals ]]

popd >/dev/null

echo "Smoke test passed"
