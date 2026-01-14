# Tru.ai Desktop IDE

**Version 1.1.0** - Production-Ready Cross-Platform IDE with AI Governance

A complete cross-platform Electron desktop IDE with integrated TruAi Core governance system for risk classification, AI routing, and forensic audit trails. Features inline AI code assistance, comprehensive context gathering, and enterprise-grade security.

[![Language: JavaScript](https://img.shields.io/badge/Language-JavaScript-yellow.svg)](https://www.javascript.com/)
[![Framework: Electron](https://img.shields.io/badge/Framework-Electron-blue.svg)](https://www.electronjs.org/)
[![Editor: Monaco](https://img.shields.io/badge/Editor-Monaco-green.svg)](https://microsoft.github.io/monaco-editor/)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)

## Quick Start

```bash
cd electron
./start.sh
```

The `start.sh` script will automatically:
- Check system requirements (Node.js 16+, npm)
- Install dependencies if needed
- Start the application

**One-command installation:**
```bash
git clone https://github.com/DemeWebsolutions/Tru.ai.git && cd Tru.ai/electron && ./start.sh
```

## Project Structure

```
electron/
├── core/                      # TruAi Core governance engine
│   ├── truai-core.js         # Central orchestration
│   ├── risk-engine.js        # Risk classification & kill-switch
│   └── ai-router.js          # AI routing & watermarking
├── src/
│   ├── css/                  # Complete styling system
│   │   ├── styles.css        # Main application styles + inline diff widgets
│   │   ├── editor.css        # Editor styles
│   │   └── terminal.css      # Terminal styles
│   └── js/                   # Complete IDE modules
│       ├── app.js            # Main application logic
│       ├── monaco-loader.js  # Monaco Editor integration
│       ├── file-explorer.js  # File/workspace management
│       ├── terminal.js       # Terminal with node-pty
│       ├── git.js            # Git operations
│       ├── ai.js             # AI chat with comprehensive context
│       ├── inline-ai.js      # ⭐ NEW v1.1 - Inline AI rewrite/diff/suggest
│       ├── agents.js         # Agent management
│       ├── editor.js         # Editor utilities
│       ├── search.js         # File search
│       ├── settings.js       # Multi-provider AI settings
│       └── contents-panel.js # Contents/Outline panel
├── main.js                   # Electron main process + AI IPC handlers
├── preload.js                # Secure IPC bridge
├── renderer.js               # Frontend initialization
├── index.html                # UI structure
├── package.json              # Dependencies (v1.1.0)
└── start.sh                  # ⭐ One-command startup script
```

## Technology Stack

### Core Technologies
- **Language**: JavaScript (ES6+)
- **Runtime**: Node.js 16+
- **Framework**: Electron 28.0.0
- **Editor**: Monaco Editor 0.45.0 (VS Code's editor engine)
- **Terminal**: node-pty 1.0.0
- **Git**: simple-git 3.20.0
- **ZIP**: adm-zip 0.5.10

### Supported Programming Languages (Monaco Editor)
The IDE provides full syntax highlighting and editing support for:
- **JavaScript** / **TypeScript** / **Node.js**
- **Python**
- **Java** / **C** / **C++** / **C#**
- **Go** / **Rust** / **PHP**
- **Ruby** / **Swift** / **Kotlin**
- **HTML** / **CSS** / **SCSS** / **Less**
- **JSON** / **YAML** / **XML**
- **Markdown** / **SQL**
- **Shell** (Bash, PowerShell)
- **And 10+ more...**

### AI Provider Support
- **OpenAI** - GPT-4, GPT-3.5 Turbo
- **Anthropic** - Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **Custom** - OpenAI-compatible APIs

## Features

### IDE Capabilities
- ✅ **Monaco Editor** - VS Code's editor with 20+ language support
- ✅ **File Explorer** - Workspace management with multi-tab editing
- ✅ **Integrated Terminal** - Real terminal with command history, auto-shell detection
- ✅ **Git Integration** - Status, commit, push, pull operations with branch tracking
- ✅ **AI Chat** - Multi-provider AI with comprehensive context gathering
- ✅ **Inline AI (v1.1)** - Selection-based rewrite, diff preview, manual suggestions
- ✅ **Agent Management** - Search/New Agent functionality
- ✅ **File Search** - Case-sensitive and whole word options
- ✅ **Contents/Outline Panel** - File structure visualization
- ✅ **Settings Management** - Configurable API keys, models, preferences
- ✅ **Keyboard Shortcuts** - Full IDE shortcuts including inline AI triggers

### New in v1.1: Inline AI Features
- ✅ **Cmd/Ctrl+K** - Inline AI rewrite on selected text
- ✅ **Cmd/Ctrl+Space** - AI code suggestion at cursor
- ✅ **Diff Preview** - Side-by-side comparison with Accept/Reject/Revert
- ✅ **Preview-Only Mode** - No auto-apply, explicit user approval required
- ✅ **Forensic Watermarking** - All inline suggestions traceable
- ✅ **TruAi Core Routing** - All operations governed and audited

### AI Context System
- ✅ **Text Input** - Raw user messages with preserved formatting
- ✅ **Image Upload** - Vision model support (PNG, JPG, GIF, WebP)
- ✅ **File Attachments** - Unlimited files of any size
- ✅ **ZIP Loading** - Extract and load entire ZIP archives
- ✅ **Code Selection** - Automatic capture from Monaco Editor
- ✅ **Open Files** - Track all open tabs with metadata
- ✅ **Project Structure** - Workspace scanning for framework detection
- ✅ **Git Context** - Branch, modified files, staged files
- ✅ **Terminal Output** - Last 50 lines of terminal history

### TruAi Core Governance
- ✅ **Risk Classification** - SAFE/ELEVATED/LOCKED states
- ✅ **AI Router** - Cost-efficient model selection
- ✅ **Forensic Watermarking** - All AI outputs traceable
- ✅ **Kill-switch Authority** - Admin-only emergency stops
- ✅ **Immutable Audit Logging** - Integrity hashing
- ✅ **CI Enforcement** - Automated policy validation

## Requirements

- **Node.js** 16.0.0 or higher
- **npm** 7.0.0 or higher
- **Git** (for Git integration features)

## Manual Installation

If you prefer manual installation:

```bash
cd electron
npm install
npm start
```

## Configuration

### AI Configuration
Launch the application and click Settings to configure:
- API keys (OpenAI, Anthropic, or Custom)
- AI model selection
- Temperature settings

### Editor Configuration
Configure in Settings:
- Font size (10-24px)
- Tab size (2-8 spaces)
- Word wrap (on/off)
- Line numbers (on/off)

### Terminal Configuration
The terminal automatically detects your system shell:
- macOS/Linux: zsh, bash, or fish
- Windows: PowerShell or cmd

## Keyboard Shortcuts

### File Operations
- **Cmd+S** (Ctrl+S) - Save file
- **Cmd+W** (Ctrl+W) - Close tab
- **Cmd+N** (Ctrl+N) - New file
- **Cmd+O** (Ctrl+O) - Open file

### Editor
- **Cmd+F** (Ctrl+F) - Find in file
- **Cmd+H** (Ctrl+H) - Replace in file
- **Cmd+G** (Ctrl+G) - Go to line
- **Cmd+Shift+F** (Ctrl+Shift+F) - Format code

### Inline AI (v1.1)
- **Cmd+K** (Ctrl+K) - AI rewrite selected text
- **Cmd+Space** (Ctrl+Space) - AI code suggestion at cursor
- **Enter** - Accept inline suggestion (when preview visible)
- **Escape** - Dismiss inline suggestion

### Navigation
- **Cmd+Shift+A** (Ctrl+Shift+A) - Toggle AI panel
- **Cmd+`** (Ctrl+`) - Toggle terminal

## Architecture

### Security
- Context isolation enabled
- Sandbox enforced
- Secure IPC bridge with preload script
- XSS prevention (textContent over innerHTML)
- CSS injection prevention
- All files include proprietary headers and forensic markers

### TruAi Core Integration
All AI operations are governed through TruAi Core:

```javascript
const result = await window.truaiCore.executeTask({
  type: 'code_generation',
  scope: 'project',
  isProduction: false,
  task: 'Refactor auth logic'
});
```

Risk classification determines approval flow:
- **SAFE** (🟢) - Auto-approved with audit trail
- **ELEVATED** (🟡) - Manual approval required
- **LOCKED** (🔴) - Admin-only override

## Building for Production

```bash
cd electron

# macOS
npm run build:mac

# Windows
npm run build:win

# Linux
npm run build:linux
```

## Dependencies

### Production
- `monaco-editor@^0.45.0` - Code editor (20+ language support)
- `simple-git@^3.20.0` - Git operations
- `node-pty@^1.0.0` - Terminal/PTY support
- `adm-zip@^0.5.10` - ZIP extraction

### Development
- `electron@^28.0.0` - Framework
- `electron-builder@^24.9.1` - Build and packaging

## Version History

### v1.1.0 (Latest - 2026-01-14)
- ✅ Inline AI rewrite with Cmd/Ctrl+K
- ✅ Inline diff preview with Accept/Reject/Revert
- ✅ Manual inline suggestion with Cmd/Ctrl+Space
- ✅ Text-in/text-out architecture (no AST/LSP)
- ✅ All inline operations governed by TruAi Core

### v1.0.0 (2026-01-13)
- ✅ Complete IDE with Monaco Editor, Terminal, Git, File Explorer
- ✅ AI Chat with comprehensive context system
- ✅ Unlimited file and ZIP attachments
- ✅ Multi-provider settings (OpenAI, Anthropic, Custom)
- ✅ TruAi Core governance integration
- ✅ One-command startup script

## Documentation

- [Electron README](electron/README.md) - Detailed Electron app documentation
- [TruAi Core README](TRUAI_CORE_README.md) - Governance system documentation
- [CI Enforcement](ci/enforce-truai-policies.sh) - Policy validation script

## License

Copyright Tru.ai | TruAi | TruAi Core | Tru.ai Core - Proprietary and intellectual property My Deme, Llc. © 2026 All rights reserved.

## Support

For issues and questions, please contact the Tru.ai development team.
