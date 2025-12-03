# MillaCore-Fusion — Monorepo (Consolidation)

This repository is the consolidated monorepo that brings together:
- mrdannyclark82/Milla-Gem -> apps/milla-gem
- mrdannyclark82/Gemini-Assistant -> apps/gemini-assistant
- MillaRayne/RayneGrok-Fusion -> apps/rayne-grok
- existing MillaCore-Fusion code -> apps/milla-core

What this patch provides
- A pnpm workspace-based monorepo layout
- scripts to import the other repos into apps/
- a dedupe reporting tool for duplicate functions
- packages/common and packages/ai-core skeletons to consolidate duplicated utilities
- docker-compose.dev + reverse-proxy for local dev
- apps/portal simple static app linking to both frontends
- minimal CI workflow and linters

How to apply this patch locally
1. Create and checkout a new branch:
   git checkout -b consolidate/monorepo

2. Copy the files in this patch into the repository root preserving file paths.

3. Install and bootstrap:
   pnpm install
   pnpm bootstrap

4. Run the migration script to snapshot-copy the source repos into apps/:
   bash scripts/migrate_repos.sh

5. Inspect duplicates reported by scripts/dedupe.py and consolidate as needed.

6. Commit and push:
   git add .
   git commit -m "chore: create monorepo skeleton and migration scripts"
   git push --set-upstream origin consolidate/monorepo

7. Open a Pull Request on GitHub from consolidate/monorepo.

Notes
- The migration script will attempt to clone the source repos; set GITHUB_TOKEN in environment if any repo is private.
- Review dedupe outputs carefully before removing files automatically.
