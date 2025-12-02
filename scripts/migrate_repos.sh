#!/usr/bin/env bash
set -euo pipefail

# Snapshot-import script
# Usage:
#   GITHUB_TOKEN=... bash scripts/migrate_repos.sh
#
# It clones the specified repos and copies their source tree into apps/.
# This is a snapshot copy — no commit history is preserved.
#
# Edit the REPOS array below to add/remove repos to import.

REPOS=(
  "https://github.com/mrdannyclark82/Milla-Gem.git"
  "https://github.com/mrdannyclark82/Gemini-Assistant.git"
  "https://github.com/MillaRayne/RayneGrok-Fusion.git"
)

# target mapping by repo name detection (simple)
target_for_repo() {
  case "$1" in
    *Milla-Gem*) echo "apps/milla-gem" ;;
    *Gemini-Assistant*) echo "apps/gemini-assistant" ;;
    *RayneGrok-Fusion*) echo "apps/rayne-grok" ;;
    *) echo "apps/$(basename "$1" .git)" ;;
  esac
}

TMP=$(mktemp -d)
echo "Using tmpdir $TMP"

for repo in "${REPOS[@]}"; do
  echo "Cloning $repo..."
  git -c http.extraheader="AUTHORIZATION: bearer ${GITHUB_TOKEN:-}" clone --depth 1 "$repo" "$TMP/$(basename "$repo" .git)"
  SRC="$TMP/$(basename "$repo" .git)"
  DEST="$(target_for_repo "$repo")"
  echo "Copying $SRC -> $DEST"
  mkdir -p "$DEST"
  # copy everything except .git
  rsync -a --exclude='.git' --exclude='node_modules' --exclude='venv' --exclude='__pycache__' "$SRC/" "$DEST/"
  # record provenance
  echo "# Migrated from $repo at snapshot" >> "$DEST"/MIGRATION_SOURCE.txt
done

echo "Cleaning up..."
rm -rf "$TMP"

echo "Running dedupe report (no destructive actions) ..."
python3 scripts/dedupe.py || true

echo "Migration snapshot finished. Please review apps/ and packages/ changes, then commit and push."
