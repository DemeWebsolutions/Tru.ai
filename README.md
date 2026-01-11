# Tru.ai - AI-Powered IDE

A powerful AI-assisted IDE available on iOS, macOS, Windows, and Linux. Built with SwiftUI for native performance on Apple platforms and Electron for cross-platform desktop support, similar to Cursor IDE.

## 🚀 Platform Availability

Tru.ai is available on multiple platforms:

- **📱 iOS**: Native SwiftUI app for iPhone and iPad (iOS 15.0+)
- **🖥️ macOS**: Native SwiftUI app for Mac (macOS 12.0+)
- **🪟 Windows**: Electron-based desktop app (Windows 10+)
- **🐧 Linux**: Electron-based desktop app (Ubuntu, Fedora, etc.)

### Platform-Specific Documentation

- [macOS Native Version](README-MACOS.md) - Native SwiftUI app for macOS
- [Electron Desktop Version](README-ELECTRON.md) - Cross-platform Electron app

## Overview

Tru.ai brings the power of AI-assisted development to your fingertips with a modern, intuitive interface. Whether you're on iOS, macOS, Windows, or Linux, you get a consistent, powerful IDE experience.

## Project Structure

```
TruAi/
├── TruAiApp.swift              # Main app entry point (iOS & macOS)
├── Info.plist                  # iOS configuration
├── Info-macOS.plist           # macOS configuration
├── Models/                     # Data models
│   ├── AppState.swift          # Global app state
│   ├── User.swift              # User model
│   ├── ChatMessage.swift       # Message model
│   ├── Conversation.swift      # Conversation model
│   ├── FileItem.swift          # File system items
│   ├── EditorTab.swift         # Editor tabs
│   ├── Command.swift           # Command palette
│   └── GitStatus.swift         # Git integration
├── Services/                   # Business logic layer
│   ├── TruAiService.swift      # Core AI service
│   ├── NetworkService.swift    # API communication
│   ├── StorageService.swift    # Local persistence
│   ├── FileSystemService.swift # File operations
│   ├── GitService.swift        # Git integration
│   ├── SearchService.swift     # Search functionality
│   └── CodeCompletionService.swift # Code completion
├── ViewModels/                 # MVVM view models
│   ├── ChatViewModel.swift     # Chat view model
│   ├── CodeEditorViewModel.swift # Editor state
│   ├── FileExplorerViewModel.swift # File explorer
│   ├── CommandPaletteViewModel.swift # Commands
│   ├── GitViewModel.swift      # Git state
│   └── SearchViewModel.swift   # Search state
├── Views/                      # SwiftUI views
│   ├── ContentView.swift       # Main content view
│   ├── IDELayoutView.swift     # IDE layout
│   ├── ChatView.swift          # Chat interface
│   ├── CodeEditorView.swift    # Code editor
│   ├── FileExplorerView.swift  # File explorer
│   ├── TerminalView.swift      # Terminal
│   ├── ActivityBarView.swift   # Activity bar
│   ├── CommandPaletteView.swift # Command palette
│   ├── GitPanelView.swift      # Git panel
│   ├── SearchPanelView.swift   # Search panel
│   ├── StatusBarView.swift     # Status bar
│   ├── HistoryView.swift       # Conversation history
│   └── SettingsView.swift      # Settings screen
├── Utilities/                  # Helper utilities
│   └── Extensions.swift        # Swift extensions
├── Configuration/              # App configuration
│   └── AppConfig.swift         # Configuration constants
├── electron/                   # Electron desktop app
│   ├── package.json           # Node dependencies
│   ├── main.js                # Main process
│   ├── preload.js             # Preload script
│   └── renderer/              # UI layer
└── README.md                   # This file
```

## Features

### 🎯 IDE Features (Cursor-Like)

- **Activity Bar**: Quick access to Explorer, Search, Git, Debug, Extensions, and AI
- **File Explorer**: Hierarchical file tree with file type icons and search
- **Code Editor**: Multi-tab editor with syntax awareness and line numbers
- **Integrated Terminal**: Built-in terminal for command execution
- **Search & Replace**: Find in files with regex support
- **Git Integration**: Status, commit, push/pull operations with visual diff
- **Command Palette**: Quick access to all commands (Cmd+Shift+P)
- **Status Bar**: File info, Git status, cursor position

### 🤖 AI Integration

- **Context-Aware AI**: Tru.ai assistant understands your code
- **Code Generation**: AI-powered code suggestions and completion
- **Chat Interface**: Natural language interaction with AI
- **Multi-Model Support**: Support for various AI models
- **Streaming Responses**: Real-time AI response streaming

### 🎨 User Experience

- **Modern SwiftUI Architecture**: Native performance on iOS/macOS
- **Cross-Platform**: Consistent experience on Windows and Linux via Electron
- **Dark Mode**: Built-in dark theme (optimized for coding)
- **Keyboard Shortcuts**: Full keyboard navigation and shortcuts
- **Customizable Layout**: Resizable panels and customizable workspace
- **Settings Management**: Persistent settings across sessions

## Requirements

### iOS
- iOS 15.0 or later
- iPhone or iPad
- Xcode 14.0+ (for building from source)

### macOS
- macOS 12.0 (Monterey) or later
- Apple Silicon or Intel Mac
- Xcode 14.0+ (for building from source)

### Windows
- Windows 10 or later
- Node.js 16+ (for building from source)

### Linux
- Ubuntu 20.04+, Fedora 35+, or similar
- Node.js 16+ (for building from source)

## Quick Start

### iOS / macOS (Native)

1. **Clone the Repository**
   ```bash
   git clone https://github.com/DemeWebsolutions/Tru.ai.git
   cd Tru.ai
   ```

2. **Open in Xcode**
   - Create an Xcode project for your target platform
   - Add all Swift files
   - Configure target: iOS 15+ or macOS 12+
   - Use appropriate Info.plist (Info.plist for iOS, Info-macOS.plist for macOS)

3. **Configure API Key**
   - Set your Tru.ai API key in Settings view
   - Or set environment variable: `TRU_AI_API_KEY`

4. **Build and Run**
   - Select your target device/simulator
   - Press Cmd+R to build and run

See [README-MACOS.md](README-MACOS.md) for detailed macOS build instructions.

### Windows / Linux (Electron)

1. **Clone and Setup**
   ```bash
   git clone https://github.com/DemeWebsolutions/Tru.ai.git
   cd Tru.ai/electron
   npm install
   ```

2. **Run in Development**
   ```bash
   npm start
   ```

3. **Build for Distribution**
   ```bash
   npm run build        # Current platform
   npm run build:mac    # macOS
   npm run build:win    # Windows
   npm run build:linux  # Linux
   npm run build:all    # All platforms
   ```

See [README-ELECTRON.md](README-ELECTRON.md) for detailed Electron instructions.

## Configuration

### API Configuration

Update `AppConfig.swift` or use Settings view to configure:
- API Base URL
- Default Model
- Temperature
- Max Tokens

### Environment Variables

Set the following environment variables for development:
```bash
export TRU_AI_API_KEY="your-api-key-here"
export TRU_AI_API_URL="https://api.tru.ai"  # Optional
```

## Keyboard Shortcuts

### Universal Shortcuts (All Platforms)

| Shortcut | Action |
|----------|--------|
| Cmd/Ctrl+Shift+P | Command Palette |
| Cmd/Ctrl+N | New File |
| Cmd/Ctrl+O | Open File |
| Cmd/Ctrl+S | Save |
| Cmd/Ctrl+Shift+S | Save All |
| Cmd/Ctrl+F | Find |
| Cmd/Ctrl+B | Toggle Sidebar |
| Cmd/Ctrl+\` | Toggle Terminal |
| Cmd/Ctrl+P | Go to File |
| Cmd/Ctrl+Shift+L | Ask AI |

See platform-specific documentation for complete shortcut lists.

## Platform Comparison

| Feature | iOS | macOS (Native) | Windows/Linux (Electron) |
|---------|-----|----------------|--------------------------|
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Startup Time | Fast | Fast | Moderate |
| Memory Usage | Low | Low | Moderate |
| Bundle Size | ~50MB | ~50MB | ~150MB |
| Native Feel | Excellent | Excellent | Good |
| Auto-Update | App Store | App Store | Built-in |
| Technology | Swift/SwiftUI | Swift/SwiftUI | JavaScript/Electron |

## Architecture

### MVVM Pattern

- **Models**: Data structures and business entities
- **Views**: SwiftUI views for UI (iOS/macOS) or HTML/CSS/JS (Electron)
- **ViewModels**: Business logic and state management
- **Services**: Network, storage, AI, file system, and Git services

### Key Components

1. **TruAiService**: Core service managing conversations and AI interactions
2. **NetworkService**: Handles all API communication with Tru.ai backend
3. **StorageService**: Manages local data persistence
4. **FileSystemService**: File operations for IDE functionality
5. **GitService**: Git integration for version control
6. **AppState**: Global application state management
3. **StorageService**: Manages local persistence using UserDefaults
4. **AppState**: Global application state management

## Usage

### Creating a Conversation

```swift
let aiService = TruAiService()
aiService.createNewConversation()
```

### Sending a Message

```swift
await aiService.sendMessage("Hello, Tru.ai!")
```

### Streaming Responses

```swift
let stream = networkService.sendStreamingChatRequest(messages: messages)
for try await chunk in stream {
    // Handle streaming response
}
```

## Customization

### Adding New Models

1. Create model file in `Models/` directory
2. Conform to `Codable` protocol
3. Add to appropriate service layer

### Adding New Views

1. Create SwiftUI view in `Views/` directory
2. Create corresponding ViewModel if needed
3. Add navigation/routing in `ContentView`

### Extending Services

1. Add methods to appropriate service class
2. Update ViewModels to use new functionality
3. Update Views to expose new features

## Testing

The framework is structured to support:
- Unit tests for services and ViewModels
- UI tests for SwiftUI views
- Integration tests for API communication

## License

Copyright Tru.ai | TruAi | TruAi Core | Tru.ai Core - Proprietary and intellectual property My Deme, Llc. © 2026 All rights reserved.

## Support

For issues and questions, please contact the Tru.ai development team.
