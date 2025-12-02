# Repository Migration Documentation

## Overview

This document records the consolidation of multiple repositories into the MillaCore-Fusion monorepo.

## Source Repositories

### 1. mrdannyclark82/Milla-Gem
- **Commit SHA**: `00b4fc6539267fe8d29b65b188e1ad9d094cbacc`
- **Type**: TypeScript/React Frontend Application
- **Technology Stack**: React, TypeScript, Vite
- **Key Features**:
  - Gemini AI integration
  - Rich UI components (calendar, email, messaging, stocks, etc.)
  - Speech-to-text and text-to-speech hooks
  - Live conversation management
- **Destination**: `apps/milla-gem/`
- **Files Migrated**:
  - `App.tsx` → `apps/milla-gem/App.tsx`
  - `index.tsx` → `apps/milla-gem/index.tsx`
  - `index.html` → `apps/milla-gem/index.html`
  - `types.ts` → `apps/milla-gem/types.ts`
  - `package.json` → `apps/milla-gem/package.json`
  - `tsconfig.json` → `apps/milla-gem/tsconfig.json`
  - `vite.config.ts` → `apps/milla-gem/vite.config.ts`
  - `components/*` → `apps/milla-gem/components/*`
  - `hooks/*` → `apps/milla-gem/hooks/*`
  - `services/*` → `apps/milla-gem/services/*`

### 2. mrdannyclark82/Gemini-Assistant
- **Status**: **NOT MIGRATED** - Exact duplicate of Milla-Gem
- **Reason**: The Gemini-Assistant repository is byte-for-byte identical to Milla-Gem
- **Decision**: Use Milla-Gem as the canonical source, skip Gemini-Assistant

### 3. MillaRayne/RayneGrok-Fusion
- **Commit SHA**: `10d2e6e2ee26b62e17159d535edfcf7cb4cd263c`
- **Type**: Full-stack Application (React Frontend + Python Backend)
- **Technology Stack**: 
  - Frontend: React, TypeScript, Vite, TailwindCSS
  - Backend: Python, FastAPI/Flask
  - AI: xAI Grok integration, FAISS vector store
  - Database: SQLite, Drizzle ORM
- **Key Features**:
  - Advanced AI conversation system with Grok
  - Vector memory storage with FAISS
  - AES-256 encryption for sensitive data
  - Voice synthesis and recognition
  - Adaptive scene-based UI
  - Browser automation capabilities
  - Android app support
- **Destination**: 
  - Frontend: `apps/rayne-grok-web/`
  - Backend: `apps/rayne-grok-server/`
  - Shared AI modules: `packages/ai-core/`
- **Files Migrated**:
  - `client/` → `apps/rayne-grok-web/src/`
  - `server/` → `apps/rayne-grok-server/`
  - `shared/` → `packages/ai-core/`
  - Core Python services → `apps/rayne-grok-server/`
  - Configuration files preserved in respective apps

### 4. mrdannyclark82/MillaCore-Fusion (Existing)
- **Status**: Target repository with existing structure
- **Existing Apps**:
  - `apps/core/` - Core application logic
  - `apps/web/` - Web interface
  - `apps/server/` - Server updater
- **Existing Packages**:
  - `packages/core/` - Core MillaCore AI engine with xAI integration
- **Preserved**: All existing code maintained

## Deduplication Analysis

### Identified Duplicates

#### 1. AI Service Integration
**Duplicate Functionality**: Both Milla-Gem and RayneGrok-Fusion have AI service clients
- **Milla-Gem**: `services/geminiService.ts` (Gemini AI)
- **RayneGrok-Fusion**: Grok/xAI integration in server code
- **Existing**: `packages/core/src/MillaCore.ts` (xAI integration)
- **Resolution**: 
  - Consolidate into `packages/ai-utils/ai-service.ts`
  - Support multiple AI backends (Gemini, Grok, xAI)
  - Use strategy pattern for different AI providers

#### 2. API Service Layer
**Duplicate Functionality**: HTTP request handling and API communication
- **Milla-Gem**: `services/apiService.ts`
- **RayneGrok-Fusion**: Similar API layer in server code
- **Resolution**: 
  - Create `packages/common/api-client.ts`
  - Unified HTTP client with retry logic and error handling

#### 3. Memory/Vector Storage
**Duplicate Functionality**: Memory management and vector operations
- **Existing**: `packages/core/src/memory.ts` and `packages/core/src/vector.ts`
- **RayneGrok-Fusion**: FAISS-based memory system
- **Resolution**:
  - Consolidate into `packages/ai-core/memory/`
  - Use existing FAISS implementation
  - Add adapters for different vector stores

#### 4. Encryption Utilities
**Duplicate Functionality**: AES-256 encryption for sensitive data
- **Existing**: `packages/core/src/encryption.ts`
- **RayneGrok-Fusion**: Similar encryption utilities
- **Resolution**:
  - Keep existing `packages/core/src/encryption.ts` as canonical
  - Update RayneGrok imports to use shared package

#### 5. Type Definitions
**Duplicate Functionality**: Common type definitions
- **Milla-Gem**: `types.ts`
- **RayneGrok-Fusion**: `shared/types.ts`
- **Resolution**:
  - Consolidate into `packages/common/types/`
  - Export common interfaces and types
  - App-specific types remain in respective apps

#### 6. Speech/Voice Utilities
**Duplicate Functionality**: Text-to-speech and speech-to-text
- **Milla-Gem**: `hooks/useSpeech.ts`
- **RayneGrok-Fusion**: Voice synthesis system
- **Resolution**:
  - Create `packages/ai-utils/voice/`
  - Unified voice interface
  - Support multiple TTS providers

### Files Removed (Duplicates)

None yet - this is a documentation-first migration. Actual deduplication will be performed after code review.

## Consolidated Packages

### packages/common
**Purpose**: Shared utilities used across all applications

**Contents**:
- `api-client.ts` - HTTP client with retry and error handling
- `config.ts` - Configuration management
- `logger.ts` - Logging utilities
- `types/` - Common type definitions
- `utils/` - General utility functions

### packages/ai-core
**Purpose**: AI and ML-related shared functionality

**Contents**:
- `memory/` - Memory management and vector storage
  - `faiss-store.ts` - FAISS vector store implementation
  - `memory-manager.ts` - Memory lifecycle management
- `ai-service/` - AI provider integrations
  - `base-provider.ts` - Abstract AI provider interface
  - `gemini-provider.ts` - Google Gemini integration
  - `grok-provider.ts` - xAI Grok integration
  - `xai-provider.ts` - General xAI integration
- `voice/` - Speech synthesis and recognition
  - `tts-engine.ts` - Text-to-speech
  - `stt-engine.ts` - Speech-to-text

### packages/ai-utils
**Purpose**: AI-related utility functions and helpers

**Contents**:
- `embedding/` - Text embedding utilities
- `prompt-templates/` - Reusable prompt templates
- `response-parsers/` - AI response parsing utilities

## Dependency Consolidation

### Root-level Dependencies (package.json)

```json
{
  "workspaces": [
    "apps/*",
    "packages/*",
    "tools/*"
  ],
  "devDependencies": {
    "turbo": "^1.10.16",
    "typescript": "^5.9.3",
    "eslint": "^8.56.0",
    "prettier": "^3.1.0",
    "@typescript-eslint/eslint-plugin": "^6.17.0",
    "@typescript-eslint/parser": "^6.17.0"
  }
}
```

### Python Dependencies (pyproject.toml)

```toml
[project]
name = "millacore-fusion"
version = "1.0.0"
dependencies = [
    "fastapi>=0.104.0",
    "uvicorn>=0.24.0",
    "faiss-cpu>=1.7.4",
    "numpy>=1.24.0",
    "python-dotenv>=1.0.0",
    "cryptography>=41.0.0",
    "openai>=1.0.0",
]

[project.optional-dependencies]
dev = [
    "black>=23.0.0",
    "flake8>=6.0.0",
    "ruff>=0.1.0",
    "pytest>=7.0.0",
    "mypy>=1.0.0",
]
```

## Environment Variables

### Consolidated .env.example

```env
# AI Provider Keys
XAI_API_KEY=your_xai_api_key_here
GROK_API_KEY=your_grok_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here

# FAISS Configuration
FAISS_INDEX_PATH=./data/faiss_index
FAISS_DIMENSION=1536

# Encryption
AES_ENCRYPTION_KEY=your_32_byte_encryption_key_here
AES_ENCRYPTION_SALT=your_salt_here

# Database
DATABASE_URL=sqlite:///./data/milla.db

# Server Configuration
SERVER_HOST=0.0.0.0
SERVER_PORT=3000
API_BASE_URL=http://localhost:3000

# Voice Services
ELEVENLABS_API_KEY=your_elevenlabs_key_here
VOICE_MODEL=alice

# Development
NODE_ENV=development
LOG_LEVEL=info
```

## Import Rewriting

### Example Import Changes

#### Before (Milla-Gem):
```typescript
import { geminiService } from './services/geminiService';
import { Message } from './types';
```

#### After (Monorepo):
```typescript
import { GeminiProvider } from '@millacore/ai-core/ai-service';
import { Message } from '@millacore/common/types';
```

#### Before (RayneGrok-Fusion):
```python
from shared.encryption import encrypt_data
from memory.vector_store import FAISSStore
```

#### After (Monorepo):
```python
from millacore.core.encryption import encrypt_data
from millacore.ai_core.memory import FAISSStore
```

## Build and Development

### Building All Apps
```bash
npm run build
# or
turbo run build
```

### Running Development Servers
```bash
# Start all apps
npm run dev

# Start specific app
npm run dev --filter=@millacore/milla-gem
npm run dev --filter=@millacore/rayne-grok-web
```

### Linting
```bash
# TypeScript/JavaScript
npm run lint

# Python
cd apps/rayne-grok-server
black .
ruff check .
```

### Testing
```bash
# Run all tests
npm test

# Python tests
cd apps/rayne-grok-server
pytest
```

## Migration Status

- [x] Repository analysis complete
- [x] Monorepo structure created
- [x] Base configuration files added (tsconfig.base.json, pnpm-workspace.yaml)
- [ ] Milla-Gem code migration (in progress)
- [ ] RayneGrok-Fusion code migration (pending)
- [ ] Duplicate code identification (pending)
- [ ] Code consolidation into shared packages (pending)
- [ ] Import rewriting (pending)
- [ ] Dependency consolidation (pending)
- [ ] Testing infrastructure setup (pending)
- [ ] CI/CD configuration update (pending)
- [ ] Documentation update (pending)

## Notes

- All original commit history is preserved in the source repositories
- This migration maintains backward compatibility where possible
- Breaking changes are documented in each app's CHANGELOG.md
- The migration is performed incrementally to allow for testing at each stage

## Original Repository Links

- [mrdannyclark82/Milla-Gem](https://github.com/mrdannyclark82/Milla-Gem)
- [mrdannyclark82/Gemini-Assistant](https://github.com/mrdannyclark82/Gemini-Assistant) (duplicate, not migrated)
- [MillaRayne/RayneGrok-Fusion](https://github.com/MillaRayne/RayneGrok-Fusion)
- [mrdannyclark82/MillaCore-Fusion](https://github.com/mrdannyclark82/MillaCore-Fusion) (target)
