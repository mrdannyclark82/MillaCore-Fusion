# MIGRATION NOTES

This migration snapshot copies code from the following repositories into this monorepo:

- mrdannyclark82/Milla-Gem -> apps/milla-gem
- mrdannyclark82/Gemini-Assistant -> apps/gemini-assistant
- MillaRayne/RayneGrok-Fusion -> apps/rayne-grok
- mrdannyclark82/MillaCore-Fusion (existing) -> apps/milla-core

Deduplication policy
- Run scripts/dedupe.py to find duplicate function definitions across Python and TypeScript/JavaScript files.
- Consolidate canonical implementations into:
  - packages/common (TypeScript/JS shared utilities/components)
  - packages/ai-core (Python AI helpers: FAISS wrappers, AES utilities, memory adapters)
- Update imports in apps/ to reference packages/ where duplication was removed.
- Record provenance for any file moved/merged by updating this document (add lists of original paths and new canonical paths).

How the migration script works
- scripts/migrate_repos.sh clones the source repos and copies their content into apps/<name>.
- Temporary clone directories are removed after copying.
- After copying, run scripts/dedupe.py to get a report on suspected duplicate functions.

Manual review required
- The dedupe script is conservative and reports candidates. A human reviewer must validate function equivalence before deletion or merging.
- Tests (if any exist in source repos) should be run after imports to verify behavior.

Provenance
- Each commit in the PR should include the original path of moved/copied files in the commit message (the migration script attempts to include a note).
