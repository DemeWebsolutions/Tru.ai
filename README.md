# Tru.ai Desktop IDE

A complete cross-platform Electron desktop IDE with integrated TruAi Core governance system for risk classification, AI routing, and forensic audit trails.

## Quick Start

```bash
cd electron
./start.sh
```

The `start.sh` script will automatically:
- Check system requirements (Node.js 16+, npm)
- Install dependencies if needed
- Start the application

## Project Structure

```
electron/
├── core/                      # TruAi Core governance engine
│   ├── truai-core.js         # Central orchestration
│   ├── risk-engine.js        # Risk classification & kill-switch
│   └── ai-router.js          # AI routing & watermarking
├── src/
│   ├── css/                  # Complete styling system
│   │   ├── styles.css        # Main application styles
│   │   ├── editor.css        # Editor styles
│   │   └── terminal.css      # Terminal styles
│   └── js/                   # Complete IDE modules
│       ├── app.js            # Main application logic
│       ├── monaco-loader.js  # Monaco Editor integration
│       ├── file-explorer.js  # File/workspace management
│       ├── terminal.js       # Terminal with node-pty
│       ├── git.js            # Git operations
│       ├── ai.js             # AI chat functionality
│       ├── agents.js         # Agent management
│       ├── editor.js         # Editor utilities
│       ├── search.js         # File search
│       ├── settings.js       # Settings management
│       └── contents-panel.js # Contents/Outline panel
├── main.js                   # Electron main process
├── preload.js                # Secure IPC bridge
├── renderer.js               # Frontend initialization
├── index.html                # UI structure
├── package.json              # Dependencies
└── start.sh                  # Startup script
```

## Features

### IDE Capabilities
- **Monaco Editor** - VS Code's editor with 20+ language support
- **File Explorer** - Workspace management with multi-tab editing
- **Integrated Terminal** - Real terminal with command history
- **Git Integration** - Status, commit, push, pull operations
- **AI Chat** - Multi-provider AI (OpenAI, Anthropic, Custom)
- **Agent Management** - Search/New Agent functionality
- **File Search** - Case-sensitive and whole word options
- **Contents/Outline Panel** - File structure visualization
- **Settings Management** - Configurable preferences
- **Keyboard Shortcuts** - Full IDE shortcuts

### TruAi Core Governance
- **Risk Classification** - SAFE/ELEVATED/LOCKED states
- **AI Router** - Cost-efficient model selection
- **Forensic Watermarking** - Traceable AI outputs
- **Kill-switch Authority** - Admin-only emergency stops
- **Immutable Audit Logging** - Integrity hashing
- **CI Enforcement** - Policy validation

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

- **Cmd+S** (Ctrl+S) - Save file
- **Cmd+W** (Ctrl+W) - Close tab
- **Cmd+F** (Ctrl+F) - Find in file
- **Cmd+H** (Ctrl+H) - Replace in file
- **Cmd+G** (Ctrl+G) - Go to line
- **Cmd+Shift+F** (Ctrl+Shift+F) - Format code

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
- `monaco-editor@^0.45.0` - Code editor
- `simple-git@^3.20.0` - Git operations
- `node-pty@^1.0.0` - Terminal/PTY support

### Development
- `electron@^28.0.0` - Framework
- `electron-builder@^24.9.1` - Build and packaging

## Documentation

- [Electron README](electron/README.md) - Detailed Electron app documentation
- [TruAi Core README](TRUAI_CORE_README.md) - Governance system documentation
- [CI Enforcement](ci/enforce-truai-policies.sh) - Policy validation script

## License

Copyright Tru.ai | TruAi | TruAi Core | Tru.ai Core - Proprietary and intellectual property My Deme, Llc. © 2026 All rights reserved.

## Support

For issues and questions, please contact the Tru.ai development team.
