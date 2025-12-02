# RayneGrok-Web Migration Status

## ⏳ Migration Pending

This directory is a placeholder for the RayneGrok-Fusion web frontend.

### To Complete Migration

Run the migration script from the repository root:

```bash
./scripts/migrate_repos.sh
```

This will download and copy the complete frontend application from:
- **Source**: [MillaRayne/RayneGrok-Fusion](https://github.com/MillaRayne/RayneGrok-Fusion)
- **Path**: `client/` → `apps/rayne-grok-web/`
- **Commit SHA**: `10d2e6e2ee26b62e17159d535edfcf7cb4cd263c`

### What Will Be Included

- React/TypeScript frontend with Vite
- TailwindCSS styling
- xAI Grok integration
- Adaptive scene-based UI
- Voice synthesis integration
- Real-time conversation interface

### After Migration

```bash
# Start development server
npm run dev --filter=@millacore/rayne-grok-web

# Build for production
npm run build --filter=@millacore/rayne-grok-web
```

See [MIGRATION.md](../../MIGRATION.md) for details.
