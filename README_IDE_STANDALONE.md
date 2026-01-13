# Tru.ai IDE - Standalone macOS Application

A complete Cursor-like code editor for macOS with AI integration, built with SwiftUI.

## Features

### 🎯 Core IDE Features

- **File Explorer** - Hierarchical file tree with file type icons and color coding
- **Code Editor** - Multi-tab editor with line numbers, syntax awareness, and auto-save
- **Terminal** - Integrated terminal for command execution
- **Activity Bar** - Quick access to Explorer, Search, Git, Debug, Extensions, and AI panels
- **Status Bar** - Shows file info, Git branch, cursor position, and encoding
- **Command Palette** - Quick access to all commands (Cmd+Shift+P)

### 🤖 AI Integration

- **AI Assistant** - Integrated Tru.ai chat panel for code assistance
- **Context-Aware** - AI understands your project context
- **Code Generation** - Generate code from natural language prompts
- **Code Explanation** - Get explanations for complex code
- **Code Fixing** - Automatically fix issues in your code

### 🔧 Developer Tools

- **Git Integration** - Stage, commit, push/pull, view diffs
- **Search** - Find in files with regex support
- **Code Completion** - IntelliSense-like completions
- **Multiple Themes** - Light, dark, and custom themes
- **Customizable Settings** - Font, tab size, key bindings, and more

## System Requirements

- macOS 12.0 (Monterey) or later
- 4GB RAM minimum (8GB recommended)
- 500MB free disk space

## Installation

### Option 1: Build from Source

1. Clone the repository:
```bash
git clone https://github.com/DemeWebsolutions/Tru.ai.git
cd Tru.ai
```

2. Open the project in Xcode:
```bash
open "TruAi troubleshoot/TruAi.xcodeproj"
```

3. Select the target scheme:
   - For the standalone IDE: Use `TruAiIDEApp.swift` as the main entry point
   - Edit scheme → Run → Info → Executable: Select "Tru.ai IDE"

4. Build and run (Cmd+R)

### Option 2: Download Pre-built App

Download the latest release from the [Releases page](https://github.com/DemeWebsolutions/Tru.ai/releases).

## Quick Start

1. **Launch the IDE** - Double-click the Tru.ai IDE app
2. **Open a Project** - File → Open... or Cmd+O
3. **Start Coding** - Click files in the explorer to open them
4. **Use AI Assistant** - Click the AI icon in the activity bar or press Cmd+Shift+L
5. **Run Terminal Commands** - Toggle terminal with Cmd+`

## Keyboard Shortcuts

### File Operations
- `Cmd+N` - New File
- `Cmd+O` - Open File/Project
- `Cmd+S` - Save
- `Cmd+Shift+S` - Save All
- `Cmd+W` - Close Tab

### Navigation
- `Cmd+P` - Quick Open File
- `Cmd+Shift+P` - Command Palette
- `Cmd+G` - Go to Line
- `Cmd+Shift+O` - Go to Symbol

### View
- `Cmd+B` - Toggle Explorer
- `Cmd+\`` - Toggle Terminal
- `Cmd++` - Zoom In
- `Cmd+-` - Zoom Out
- `Cmd+0` - Reset Zoom

### Search
- `Cmd+F` - Find in File
- `Cmd+Shift+F` - Find in Files
- `Cmd+Option+F` - Replace

### Git
- `Cmd+Shift+G` - Open Git Panel / Commit

### AI
- `Cmd+Shift+L` - Ask Tru.ai
- Select code and ask AI for explanations or fixes

## Configuration

### API Key Setup

To use AI features, you need a Tru.ai API key:

1. Go to Settings (Cmd+,)
2. Navigate to "AI Configuration"
3. Enter your API key
4. Or set environment variable: `TRU_AI_API_KEY`

### Editor Settings

Customize your editor in Settings:
- Font family and size
- Tab size (spaces)
- Word wrap
- Line endings
- Auto-save
- Theme (light/dark/auto)

### Git Settings

Configure Git integration:
- Auto-fetch interval
- Confirm before sync
- Show inline blame
- Diff view style

## Project Structure

```
TruAi/
├── TruAiIDEApp.swift          # Main app entry (standalone IDE)
├── TruAiMacApp.swift          # Alternative entry (with auth)
├── TruAiApp.swift             # iOS entry point
├── Models/                     # Data models
├── Services/                   # Business logic
├── ViewModels/                 # MVVM view models
├── Views/                      # SwiftUI views
│   ├── IDELayoutView.swift    # Main IDE layout
│   ├── ActivityBarView.swift  # Activity bar
│   ├── FileExplorerView.swift # File explorer
│   ├── CodeEditorView.swift   # Code editor
│   ├── TerminalView.swift     # Terminal
│   ├── CommandPaletteView.swift # Command palette
│   ├── GitPanelView.swift     # Git integration
│   ├── SearchPanelView.swift  # Search panel
│   └── SettingsView.swift     # Settings
├── Configuration/              # App configuration
├── Utilities/                  # Helper utilities
└── Assets.xcassets/           # App icons and colors
```

## Architecture

Built with modern Swift and SwiftUI:
- **MVVM Architecture** - Separation of concerns
- **Combine Framework** - Reactive programming
- **Async/Await** - Modern concurrency
- **ObservableObject** - State management
- **Environment Objects** - Dependency injection

## Supported File Types

- Swift (.swift)
- JavaScript/TypeScript (.js, .ts, .jsx, .tsx)
- Python (.py)
- Go (.go)
- Rust (.rs)
- HTML/CSS (.html, .css, .scss)
- JSON (.json)
- YAML (.yml, .yaml)
- Markdown (.md)
- And many more...

## Customization

### Themes

The IDE supports multiple color themes:
- Light theme
- Dark theme
- Auto (follows system)
- Custom themes (coming soon)

### Extensions

The architecture supports extensions:
- Language support
- Linters and formatters
- Custom commands
- UI themes

## Troubleshooting

### IDE won't launch
- Check macOS version (12.0+)
- Verify code signing
- Check Console.app for errors

### AI features not working
- Verify API key in Settings
- Check internet connection
- Verify API endpoint in Configuration

### Git operations failing
- Install Git command-line tools
- Configure Git user name/email
- Check repository permissions

### Performance issues
- Close unused tabs
- Disable unused panels
- Reduce syntax highlighting scope
- Check Activity Monitor for memory usage

## Development

### Building from Source

1. Requirements:
   - Xcode 14.0+
   - Swift 5.7+
   - macOS 12.0+ SDK

2. Clone and build:
```bash
git clone https://github.com/DemeWebsolutions/Tru.ai.git
cd Tru.ai
open "TruAi troubleshoot/TruAi.xcodeproj"
```

3. Select scheme and build

### Running Tests

```bash
# Unit tests
cmd+U in Xcode

# Or via command line
xcodebuild test -scheme TruAiIDE
```

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

Copyright © 2026 Tru.ai. All rights reserved.

Proprietary software by My Deme, LLC.

## Support

- Documentation: [docs.tru.ai](https://docs.tru.ai)
- Issues: [GitHub Issues](https://github.com/DemeWebsolutions/Tru.ai/issues)
- Email: support@tru.ai

## Acknowledgments

- Inspired by Cursor IDE
- Built with SwiftUI and modern Swift
- Powered by Tru.ai API

---

**Tru.ai IDE** - Code smarter, not harder. 🚀
