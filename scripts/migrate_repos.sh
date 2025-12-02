#!/bin/bash

# Migration script for consolidating repositories into MillaCore-Fusion monorepo
# This script automates the process of migrating code from:
# - mrdannyclark82/Milla-Gem → apps/milla-gem
# - mrdannyclark82/Gemini-Assistant (SKIPPED - duplicate of Milla-Gem)
# - MillaRayne/RayneGrok-Fusion → apps/rayne-grok-*

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

MILLA_GEM_REF="00b4fc6539267fe8d29b65b188e1ad9d094cbacc"
RAYNE_GROK_REF="10d2e6e2ee26b62e17159d535edfcf7cb4cd263c"

# Validate commit SHAs format (basic check)
if ! [[ "$MILLA_GEM_REF" =~ ^[0-9a-f]{40}$ ]]; then
    echo "Error: Invalid Milla-Gem commit SHA format"
    exit 1
fi

if ! [[ "$RAYNE_GROK_REF" =~ ^[0-9a-f]{40}$ ]]; then
    echo "Error: Invalid RayneGrok commit SHA format"
    exit 1
fi

echo "========================================"
echo "MillaCore-Fusion Monorepo Migration"
echo "========================================"
echo ""
echo "This script will download and consolidate code from:"
echo "  1. mrdannyclark82/Milla-Gem"
echo "  2. MillaRayne/RayneGrok-Fusion"
echo ""
echo "Into the MillaCore-Fusion monorepo structure."
echo ""

# Check if git is available
if ! command -v git &> /dev/null; then
    echo "Error: git is required but not installed."
    exit 1
fi

# Check if curl is available
if ! command -v curl &> /dev/null; then
    echo "Error: curl is required but not installed."
    exit 1
fi

# Create temporary directory for cloning
TMP_DIR=$(mktemp -d)
trap "rm -rf $TMP_DIR" EXIT

echo "Step 1: Migrating Milla-Gem..."
echo "--------------------------------"
if [ -d "apps/milla-gem/components" ]; then
    echo "Milla-Gem already partially migrated. Skipping..."
else
    cd "$TMP_DIR"
    git clone --depth 1 --single-branch https://github.com/mrdannyclark82/Milla-Gem.git milla-gem
    cd milla-gem
    git checkout $MILLA_GEM_REF 2>/dev/null || echo "Using default branch"
    
    # Copy files to monorepo
    cd "$REPO_ROOT"
    mkdir -p apps/milla-gem
    
    # Copy source files (excluding what's already there)
    if [ -d "$TMP_DIR/milla-gem/components" ]; then
        cp -r "$TMP_DIR/milla-gem/components" apps/milla-gem/ || {
            echo "Warning: Failed to copy components directory"
        }
    else
        echo "Warning: components directory not found in source"
    fi
    
    if [ -d "$TMP_DIR/milla-gem/hooks" ]; then
        cp -r "$TMP_DIR/milla-gem/hooks" apps/milla-gem/ || {
            echo "Warning: Failed to copy hooks directory"
        }
    else
        echo "Warning: hooks directory not found in source"
    fi
    
    if [ -d "$TMP_DIR/milla-gem/services" ]; then
        cp -r "$TMP_DIR/milla-gem/services" apps/milla-gem/ || {
            echo "Warning: Failed to copy services directory"
        }
    else
        echo "Warning: services directory not found in source"
    fi
    
    echo "✓ Milla-Gem migrated to apps/milla-gem"
fi
echo ""

echo "Step 2: Migrating RayneGrok-Fusion..."
echo "--------------------------------------"
if [ -d "apps/rayne-grok-web/src" ] || [ -d "apps/rayne-grok-server/server" ]; then
    echo "RayneGrok-Fusion already partially migrated. Skipping..."
else
    cd "$TMP_DIR"
    git clone --depth 1 --single-branch https://github.com/MillaRayne/RayneGrok-Fusion.git rayne-grok
    cd rayne-grok
    git checkout $RAYNE_GROK_REF 2>/dev/null || echo "Using default branch"
    
    # Copy files to monorepo
    cd "$REPO_ROOT"
    
    # Frontend
    mkdir -p apps/rayne-grok-web
    if [ -d "$TMP_DIR/rayne-grok/client" ]; then
        cp -r "$TMP_DIR/rayne-grok/client"/* apps/rayne-grok-web/ || true
    fi
    
    # Backend
    mkdir -p apps/rayne-grok-server
    if [ -d "$TMP_DIR/rayne-grok/server" ]; then
        cp -r "$TMP_DIR/rayne-grok/server"/* apps/rayne-grok-server/ || true
    fi
    
    # Copy Python files from root
    cp "$TMP_DIR/rayne-grok"/*.py apps/rayne-grok-server/ 2>/dev/null || true
    
    # Shared/AI core modules
    mkdir -p packages/ai-core
    if [ -d "$TMP_DIR/rayne-grok/shared" ]; then
        cp -r "$TMP_DIR/rayne-grok/shared"/* packages/ai-core/ || true
    fi
    if [ -d "$TMP_DIR/rayne-grok/memory" ]; then
        cp -r "$TMP_DIR/rayne-grok/memory"/* packages/ai-core/ || true
    fi
    
    # Copy configuration files
    cp "$TMP_DIR/rayne-grok/.env.example" ./ 2>/dev/null || true
    cp "$TMP_DIR/rayne-grok/docker-compose.yml" ./infra/ 2>/dev/null || true
    cp "$TMP_DIR/rayne-grok/Dockerfile" ./infra/ 2>/dev/null || true
    
    echo "✓ RayneGrok-Fusion migrated to apps/rayne-grok-*"
fi
echo ""

echo "Step 3: Setting up package structure..."
echo "----------------------------------------"
# Ensure all necessary directories exist
mkdir -p apps/milla-gem/components apps/milla-gem/hooks apps/milla-gem/services
mkdir -p apps/rayne-grok-web/src
mkdir -p apps/rayne-grok-server
mkdir -p packages/common/src packages/ai-utils/src packages/ai-core/src
mkdir -p infra scripts
echo "✓ Directory structure created"
echo ""

echo "Step 4: Installing dependencies..."
echo "-----------------------------------"
if [ -f "package.json" ]; then
    echo "Installing npm dependencies..."
    npm install || echo "Warning: npm install had issues"
fi
echo ""

echo "========================================"
echo "Migration Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo "  1. Review the migrated code in apps/ and packages/"
echo "  2. Check MIGRATION.md for provenance and deduplication notes"
echo "  3. Run 'npm run build' to ensure everything builds"
echo "  4. Run 'npm run lint' to check code quality"
echo "  5. Review and update import statements as needed"
echo ""
echo "For more information, see:"
echo "  - README.md - General documentation"
echo "  - MIGRATION.md - Migration details and decisions"
echo "  - .env.example - Environment configuration"
echo ""
