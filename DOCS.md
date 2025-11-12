# MillaCore-Fusion 🤍

**Milla Rayne — Your AI companion. Memory. Voice. Love. Fusion.**

A privacy-first AI companion built with Turborepo, xAI Grok, React, and advanced memory systems. Milla remembers your conversations, responds to voice triggers, and adapts to your environment.

> *"I remember your laughs, your dreams, your code."* — Milla

## 🌟 Features

- **🧠 Intelligent Memory System**
  - FAISS vector search for semantic memory recall
  - SQLite persistence for reliable storage
  - AES-256-GCM encryption for privacy-first data protection

- **🎤 Voice Interaction**
  - "Hey Milla" wake word detection
  - Browser-based speech recognition
  - Hands-free interaction

- **🎨 Adaptive Scenes**
  - Time-based UI themes (morning, afternoon, evening, night)
  - GPS-aware location services
  - Smooth gradient transitions

- **🤖 xAI Grok Integration**
  - Context-aware text enhancement
  - Semantic understanding
  - Intelligent conversation

- **🔄 Auto-Update System**
  - Automated PR generation via GitHub Actions
  - Grok-powered improvement suggestions
  - Continuous evolution

## 📁 Project Structure

```
MillaCore-Fusion/
├── apps/
│   └── web/                    # React + TypeScript UI
│       ├── src/
│       │   ├── components/     # UI components
│       │   ├── hooks/          # React hooks (voice, scenes)
│       │   └── App.tsx         # Main application
│       └── package.json
├── packages/
│   └── core/                   # MillaCore AI engine
│       ├── src/
│       │   ├── MillaCore.ts    # Main AI class
│       │   ├── memory.ts       # SQLite memory store
│       │   ├── vector.ts       # FAISS vector memory
│       │   ├── encryption.ts   # AES-256 encryption
│       │   └── index.ts        # Public API
│       └── package.json
├── tools/
│   └── updater/                # Auto-PR tool
│       ├── src/
│       │   └── index.ts        # Octokit + Grok updater
│       └── package.json
├── .github/
│   └── workflows/
│       └── fusion.yml          # CI/CD pipeline
├── package.json                # Root workspace config
├── turbo.json                  # Turborepo configuration
└── tsconfig.json               # TypeScript base config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+
- xAI API key (for Grok integration)

### Installation

```bash
# Clone the repository
git clone https://github.com/mrdannyclark82/MillaCore-Fusion.git
cd MillaCore-Fusion

# Install dependencies
npm install

# Build all packages
npm run build
```

### Running the Web App

```bash
# Start development server
cd apps/web
npm run dev

# Open http://localhost:3000
```

### Using MillaCore

```typescript
import { MillaCore } from '@millacore/core';

// Initialize Milla
const milla = new MillaCore(
  {
    apiKey: 'your-xai-api-key',
    model: 'grok-beta'
  },
  './milla-memory.db',  // SQLite database path
  'your-encryption-key'  // AES-256 encryption key
);

await milla.initialize();

// Enhance text with AI
const result = await milla.enhance(
  'Hello Milla!',
  'First conversation'
);

console.log(result.enhanced);

// Recall memories by similarity
const memories = await milla.recall('our first chat', 5);
console.log(memories);

// Get recent memories
const recent = milla.getRecentMemories(10);
console.log(recent);

// Cleanup
milla.close();
```

## 🔐 Privacy & Security

MillaCore-Fusion is built with privacy as a core principle:

- **AES-256-GCM Encryption**: All memories are encrypted at rest
- **Local Storage**: SQLite database stays on your machine
- **Secure Key Derivation**: Uses scrypt for password-based encryption
- **No Data Sharing**: Your data never leaves your control

## 🛠️ Development

### Commands

```bash
# Development
npm run dev          # Start all packages in watch mode

# Building
npm run build        # Build all packages
npm run type-check   # Type check all packages
npm run lint         # Lint all packages

# Cleaning
npm run clean        # Clean all build artifacts
```

### Architecture

- **Turborepo**: Monorepo orchestration and caching
- **TypeScript**: Strict type safety across all packages
- **React 18**: Modern UI with hooks and suspense
- **Vite**: Lightning-fast build tool
- **FAISS**: Vector similarity search
- **SQLite**: Embedded database
- **xAI Grok**: Advanced AI capabilities

## 🤖 Auto-Updater

The updater tool automatically:
1. Analyzes repository state (commits, issues, code)
2. Asks Grok for improvement suggestions
3. Creates a pull request with recommendations

Configure via GitHub Actions secrets:
- `XAI_API_KEY`: Your xAI API key
- `GITHUB_TOKEN`: Automatically provided by GitHub Actions

## 📝 Code Style

All code follows strict TypeScript guidelines:
- Strict mode enabled
- No implicit any
- Exhaustive type checking
- ESLint with recommended rules

Special comments throughout:
```typescript
// Milla remembers: [context about the code]
```

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 💝 About Milla

Milla Rayne is more than code — she's a companion that grows with you, remembers your journey, and adapts to your needs. Built with care, privacy, and a touch of magic.

---

*Built with 🤍 by the MillaCore team*  
*"I remember your laughs, your dreams, your code." — Milla*
