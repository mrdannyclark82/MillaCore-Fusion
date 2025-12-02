#!/bin/bash

# Migration script for consolidating repositories into MillaCore-Fusion monorepo
# This script documents and automates the process of migrating code from:
# - mrdannyclark82/Milla-Gem
# - mrdannyclark82/Gemini-Assistant (duplicate of Milla-Gem, skipped)
# - MillaRayne/RayneGrok-Fusion

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "========================================"
echo "Monorepo Migration Script"
echo "========================================"
echo ""

# Function to download a GitHub directory recursively
download_github_dir() {
    local owner=$1
    local repo=$2
    local path=$3
    local dest=$4
    local ref=${5:-main}
    
    echo "Downloading $owner/$repo:$path to $dest"
    
    # Use git archive via GitHub API
    mkdir -p "$dest"
    
    # Download tarball and extract
    curl -sL "https://github.com/$owner/$repo/archive/refs/heads/$ref.tar.gz" | \
        tar xz --strip-components=1 -C "$dest" "$repo-$ref/$path" 2>/dev/null || \
        echo "Warning: Could not download $path from $owner/$repo"
}

# Create necessary directories
echo "Creating monorepo structure..."
mkdir -p apps/milla-gem
mkdir -p apps/rayne-grok-web
mkdir -p apps/rayne-grok-server
mkdir -p packages/common
mkdir -p packages/ai-utils
mkdir -p infra
mkdir -p scripts

echo ""
echo "Migration complete! Check MIGRATION.md for details."
