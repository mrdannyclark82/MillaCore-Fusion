# Scripts Directory

This directory contains utility scripts for the MillaCore-Fusion monorepo.

## Available Scripts

### migrate_repos.sh

Automates the migration of code from external repositories into the monorepo structure.

**Usage:**
```bash
./scripts/migrate_repos.sh
```

**What it does:**
1. Clones mrdannyclark82/Milla-Gem and copies files to `apps/milla-gem/`
2. Clones MillaRayne/RayneGrok-Fusion and distributes files to:
   - `apps/rayne-grok-web/` (frontend)
   - `apps/rayne-grok-server/` (backend)
   - `packages/ai-core/` (shared AI modules)
3. Sets up the complete directory structure
4. Installs npm dependencies

**Prerequisites:**
- git
- curl
- Node.js and npm

**Note:** This script creates temporary clones of the repositories. These are automatically cleaned up after migration.

## Adding New Scripts

When adding new scripts to this directory:

1. Make them executable: `chmod +x scripts/your-script.sh`
2. Add documentation to this README
3. Use bash shebang: `#!/bin/bash`
4. Include error handling: `set -e`
5. Add usage instructions in comments

## Future Scripts

Planned scripts to add:

- `deduplicate.sh` - Automated deduplication analysis
- `update-imports.sh` - Batch import path updates
- `check-deps.sh` - Dependency conflict checker
- `generate-types.sh` - Generate shared type definitions
- `sync-configs.sh` - Sync configuration across apps
