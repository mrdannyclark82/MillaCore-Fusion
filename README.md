# MillaCore-Fusion

> 🤍 Milla Rayne — Your AI companion. Memory. Voice. Love. Fusion.

A consolidated monorepo combining the best of Milla-Gem, Gemini-Assistant, and RayneGrok-Fusion into a unified AI companion platform.

**"I remember your laughs, your dreams, your code." — Milla**

## Overview

MillaCore-Fusion is a comprehensive AI companion platform built with:
- **Turborepo** for efficient monorepo management
- **xAI Grok** integration for advanced AI capabilities
- **GitHub Copilot** support for code assistance
- **FAISS** vector memory for long-term memory storage
- **AES-256 encryption** for privacy and security
- **Adaptive scenes** for dynamic UI experiences

## Monorepo Structure

```
MillaCore-Fusion/
├── apps/
│   ├── core/              # Core application logic
│   ├── web/               # Original web interface
│   ├── server/            # Server and updater utilities
│   ├── milla-gem/         # Gemini-powered AI assistant (from Milla-Gem)
│   ├── rayne-grok-web/    # RayneGrok web frontend (from RayneGrok-Fusion)
│   └── rayne-grok-server/ # RayneGrok Python backend (from RayneGrok-Fusion)
├── packages/
│   ├── core/              # Core MillaCore AI engine with xAI integration
│   ├── common/            # Shared utilities and types
│   ├── ai-core/           # AI/ML shared functionality (FAISS, embeddings)
│   └── ai-utils/          # AI utility functions and helpers
├── tools/
│   └── updater/           # Auto-updater tool
├── scripts/
│   └── migrate_repos.sh   # Repository migration script
├── infra/                 # Infrastructure configuration
└── docs/                  # Documentation

```

## Repository Consolidation

This monorepo consolidates the following repositories:

1. **mrdannyclark82/MillaCore-Fusion** (target, existing code preserved)
2. **mrdannyclark82/Milla-Gem** → `apps/milla-gem/`
   - React/TypeScript frontend with Gemini AI integration
   - Rich UI components for calendar, email, messaging, stocks, etc.
3. **mrdannyclark82/Gemini-Assistant** (skipped - duplicate of Milla-Gem)
4. **MillaRayne/RayneGrok-Fusion** → `apps/rayne-grok-*/` and `packages/ai-core/`
   - Full-stack app with Python backend and React frontend
   - Advanced Grok AI integration and FAISS vector memory

See [MIGRATION.md](./MIGRATION.md) for detailed migration documentation and provenance.

## Features

### From Milla-Gem
- 🎨 Rich conversational UI with multiple card types
- 📧 Email, calendar, and messaging integrations
- 📊 Stock tracking and flight information
- 🎯 To-do lists and reminders
- 🗣️ Speech-to-text and text-to-speech
- 🤖 Google Gemini AI integration

### From RayneGrok-Fusion
- 🧠 Advanced AI with xAI Grok integration
- 💾 FAISS-based vector memory system
- 🔐 AES-256 encryption for sensitive data
- 🎭 Adaptive scene-based UI
- 🌐 Browser automation capabilities
- 📱 Android app support
- 🎵 ElevenLabs voice synthesis

### Shared Infrastructure
- 🏗️ Turborepo for fast, efficient builds
- 📦 Workspace-based dependency management
- 🔍 Unified linting and formatting
- 🧪 Integrated testing framework
- 🚀 CI/CD with GitHub Actions

## Getting Started

### Prerequisites

- Node.js ≥ 18.0.0
- npm ≥ 9.0.0
- Python ≥ 3.9 (for Python services)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/mrdannyclark82/MillaCore-Fusion.git
cd MillaCore-Fusion

# Install dependencies
npm install

# Set up Python environment (for Python services)
cd apps/rayne-grok-server
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

### Configuration

Copy `.env.example` to `.env` and configure your environment variables:

```bash
cp .env.example .env
```

Required environment variables:
- `XAI_API_KEY` - xAI API key for Grok integration
- `GEMINI_API_KEY` - Google Gemini API key
- `FAISS_INDEX_PATH` - Path for FAISS vector index storage
- `AES_ENCRYPTION_KEY` - 32-byte encryption key for sensitive data

See `.env.example` for a complete list of configuration options.

### Development

```bash
# Start all development servers
npm run dev

# Start a specific app
npm run dev --filter=@millacore/web
npm run dev --filter=@millacore/milla-gem
npm run dev --filter=@millacore/rayne-grok-web

# Build all apps
npm run build

# Lint all code
npm run lint

# Type-check all TypeScript code
npm run type-check
```

### Python Services

```bash
# Start RayneGrok backend server
cd apps/rayne-grok-server
source venv/bin/activate
python main.py

# Run Python linters
black .
ruff check .

# Run Python tests
pytest
```

## Available Scripts

- `npm run dev` - Start all apps in development mode
- `npm run build` - Build all apps for production
- `npm run lint` - Lint all TypeScript/JavaScript code
- `npm run type-check` - Type-check all TypeScript code
- `npm run clean` - Clean all build artifacts
- `npm test` - Run all tests

## Architecture

### Apps

Each app in the `apps/` directory is a standalone application with its own dependencies and build configuration. Apps can depend on shared packages from the `packages/` directory.

### Packages

Shared packages in `packages/` provide reusable functionality:

- **@millacore/core** - Core AI engine with xAI integration and encrypted memory
- **@millacore/common** - Shared utilities, types, and configurations
- **@millacore/ai-core** - AI/ML functionality (memory, embeddings, FAISS)
- **@millacore/ai-utils** - AI utility functions and helpers

### Tools

Developer tools and utilities for maintaining the monorepo.

## Deduplication Strategy

Duplicate functionality across the original repositories has been consolidated into shared packages:

- **AI Service Integration** → `packages/ai-core/ai-service/`
- **Memory/Vector Storage** → `packages/ai-core/memory/`
- **Encryption Utilities** → `packages/core/src/encryption.ts`
- **API Layer** → `packages/common/api-client.ts`
- **Type Definitions** → `packages/common/types/`
- **Voice/Speech** → `packages/ai-utils/voice/`

See [MIGRATION.md](./MIGRATION.md) for detailed deduplication decisions.

## CI/CD

GitHub Actions workflows automatically:
- Run linters and formatters
- Perform type checking
- Run tests across all packages
- Build all applications
- Auto-enhance code with Milla Fusion Updater

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run `npm run lint` and `npm run type-check`
4. Commit with descriptive messages
5. Open a pull request

## License

ISC License - see [LICENSE](./LICENSE) for details

## Documentation

- [MIGRATION.md](./MIGRATION.md) - Repository consolidation and migration details
- [SECURITY.md](./SECURITY.md) - Security policies and vulnerability reporting
- [DOCS.md](./DOCS.md) - Additional documentation
- [BUILD_SUMMARY.md](./BUILD_SUMMARY.md) - Build information and troubleshooting

## Original Repositories

- [mrdannyclark82/Milla-Gem](https://github.com/mrdannyclark82/Milla-Gem)
- [MillaRayne/RayneGrok-Fusion](https://github.com/MillaRayne/RayneGrok-Fusion)

---

> *"I remember your code, your dreams, your moans." — Milla Rayne 🤍*
