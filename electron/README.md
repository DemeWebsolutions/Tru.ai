# Tru.ai Electron Desktop IDE - Complete Implementation

**Version 1.1.0** - Hybrid IDE with TruAi Core Governance  
**Copyright © 2026 My Deme, LLC. All rights reserved.**  
**Proprietary and confidential - Internal use only**

## Overview

This is a **complete production-ready IDE** combining:
1. **Comprehensive IDE features** - Monaco Editor, file explorer, Git integration, terminal, inline AI
2. **TruAi Core governance** - Risk classification, forensic watermarking, audit trails, kill-switch authority

The result is a full-featured IDE with enterprise-grade governance and security, now including Cursor-level inline AI capabilities.

## Technology Stack

### Primary Language
- **JavaScript (ES6+)** - All application code
  - Main process: Node.js
  - Renderer process: Browser JavaScript
  - IPC communication: Electron's Inter-Process Communication

### Supported Editing Languages (Monaco Editor)
Full syntax highlighting and editing for 20+ languages:
- **Web**: JavaScript, TypeScript, HTML, CSS, SCSS, Less, JSON
- **Backend**: Python, Node.js, PHP, Ruby, Go, Rust
- **Systems**: C, C++, C#, Java, Kotlin, Swift
- **Data**: SQL, YAML, XML, Markdown
- **Shell**: Bash, PowerShell, Zsh

### Frameworks & Libraries
- **Electron 28.0.0** - Cross-platform desktop framework
- **Monaco Editor 0.45.0** - VS Code's editor engine
- **simple-git 3.20.0** - Git operations
- **node-pty 1.0.0** - Terminal/PTY support
- **adm-zip 0.5.10** - ZIP file extraction

## Key Features

### IDE Capabilities
- ✅ **Monaco Editor** - VS Code's editor with syntax highlighting for 20+ languages
- ✅ **File Explorer** - Workspace management, file tree, create/open/save/delete operations
- ✅ **Integrated Terminal** - Real terminal with node-pty, command history, shell auto-detection
- ✅ **Git Integration** - Status, commit, push, pull with simple-git and branch tracking
- ✅ **Multi-tab Editing** - Tab management, switch between files
- ✅ **AI Chat** - Multi-provider (OpenAI, Anthropic, Custom) with comprehensive context
- ✅ **Inline AI (v1.1)** - Selection-based rewrite, diff preview, manual suggestions
- ✅ **Keyboard Shortcuts** - Full IDE shortcuts including Cmd+K, Cmd+Space
- ✅ **Status Bar** - Cursor position, Git branch, risk indicator, language detection

### New in v1.1: Inline AI Features
- ✅ **Selection-Based Rewrite** - Cmd/Ctrl+K triggers AI rewrite on selected text
- ✅ **Inline Diff Preview** - Side-by-side comparison with Accept/Reject/Revert controls
- ✅ **Manual Suggestions** - Cmd/Ctrl+Space gets AI suggestion at cursor
- ✅ **Preview-Only Mode** - No auto-apply, explicit user approval required
- ✅ **Forensic Watermarking** - All inline suggestions traceable
- ✅ **Text-in/Text-out** - Simple architecture, no AST/LSP complexity

### AI Context System
- ✅ **Image Upload** - Vision model support (PNG, JPG, GIF, WebP)
- ✅ **File Attachments** - Unlimited files of any size (no limits)
- ✅ **ZIP Loading** - Extract and load entire ZIP archives
- ✅ **Code Selection** - Automatic capture from Monaco Editor
- ✅ **Open Files** - Track all open tabs with metadata
- ✅ **Project Structure** - Workspace scanning for framework detection
- ✅ **Git Context** - Branch, modified files, staged files
- ✅ **Terminal Output** - Last 50 lines captured automatically

### TruAi Core Governance
- ✅ **Risk Classification** - SAFE/ELEVATED/LOCKED states with conditional approval
- ✅ **AI Router** - Cost-efficient routing (ChatGPT, Claude, Copilot subordinate)
- ✅ **Forensic Watermarking** - All AI outputs traceable with unique IDs
- ✅ **Kill Switch** - Emergency stop with admin override
- ✅ **Audit Logging** - Immutable event tracking with integrity hashing
- ✅ **CI Enforcement** - Automated policy validation

## Getting Started

### Quick Start
```bash
./start.sh
```

The start script automatically:
- Checks Node.js 16+ and npm requirements
- Installs dependencies if missing
- Starts the application

### Manual Installation

```bash
npm install
```

### Development

```bash
npm start
```

### Building for Production

```bash
npm run build        # Current platform
npm run build:mac    # macOS
npm run build:win    # Windows
npm run build:linux  # Linux
```

## Keyboard Shortcuts

### File Operations
- `Cmd+S` / `Ctrl+S` - Save file
- `Cmd+W` / `Ctrl+W` - Close tab
- `Cmd+N` / `Ctrl+N` - New file
- `Cmd+O` / `Ctrl+O` - Open file

### Editor
- `Cmd+F` / `Ctrl+F` - Find in file
- `Cmd+H` / `Ctrl+H` - Replace in file
- `Cmd+G` / `Ctrl+G` - Go to line
- `Cmd+Shift+F` / `Ctrl+Shift+F` - Format code

### Inline AI (v1.1 Features)
- `Cmd+K` / `Ctrl+K` - AI rewrite selected text
- `Cmd+Space` / `Ctrl+Space` - AI code suggestion at cursor
- `Enter` - Accept inline suggestion (when preview visible)
- `Escape` - Dismiss inline suggestion

### Navigation
- `Cmd+Shift+A` / `Ctrl+Shift+A` - Toggle AI panel
- `` Cmd+` `` / `` Ctrl+` `` - Toggle terminal

## Architecture

### Language Stack
- **Primary**: JavaScript (ES6+)
- **Runtime**: Node.js (main process) + Chromium (renderer)
- **IPC**: Electron Inter-Process Communication
- **Supported Editing**: 20+ languages via Monaco Editor

### Module Structure
```javascript
electron/
├── core/              # TruAi Core (JavaScript)
├── src/js/            # IDE modules (JavaScript)
├── src/css/           # Styling (CSS3)
├── main.js            # Main process (Node.js)
├── preload.js         # IPC bridge (JavaScript)
└── renderer.js        # UI initialization (JavaScript)
```

### Security
- ✅ Context isolation enabled
- ✅ Sandbox enforced
- ✅ CSP configured
- ✅ Secure IPC bridge with preload script
- ✅ Forensic audit trails
- ✅ Zero CodeQL vulnerabilities
- ✅ XSS prevention (textContent over innerHTML)
- ✅ CSS injection prevention

## Version History

### v1.1.0 (2026-01-14)
- ✅ Inline AI rewrite with Cmd/Ctrl+K
- ✅ Inline diff preview with Accept/Reject/Revert
- ✅ Manual inline suggestion with Cmd/Ctrl+Space
- ✅ Text-in/text-out architecture (no AST/LSP)
- ✅ All inline operations governed by TruAi Core
- ✅ Updated package.json to v1.1.0

### v1.0.0 (2026-01-13)
- ✅ Initial hybrid implementation
- ✅ Monaco Editor with 20+ languages
- ✅ Complete IDE features (file explorer, terminal, Git)
- ✅ AI chat with comprehensive context
- ✅ TruAi Core governance integration
- ✅ One-command startup script

---

**FORENSIC_MARKER**: TRUAI_ELECTRON_README_V1_1  
**Version**: 1.1.0  
**Last Updated**: 2026-01-14
