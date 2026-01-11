# Tru.ai iOS IDE Framework

**A comprehensive iOS IDE framework built with SwiftUI that replicates Cursor IDE functionality, featuring file management, code editing, Git integration, AI assistance, and a complete development environment for iOS devices.**

© 2013 - Present My Deme, LLC. All Rights Reserved.  
Developed by DemeWebsolutions.com

## Overview

Tru.ai is a production-ready iOS application that serves as a super-admin AI platform featuring TruAi Core - an intelligent orchestration layer that manages AI interactions, cost optimization, and self-maintenance capabilities.

## Features

### Core IDE Capabilities
- **File Explorer**: Hierarchical file tree with search and file operations
- **Code Editor**: Multi-tab editor with syntax highlighting and line numbers
- **Terminal**: Integrated shell with command execution
- **Git Integration**: Full source control (status, commit, push, pull)
- **Search**: Advanced find-in-files with regex support
- **Command Palette**: Quick command access (Cmd+Shift+P)

### AI-Powered Features (TruAi Core)
- **Intelligent AI Routing**: Automatic selection between cheap/mid/copilot tiers
- **Cost Optimization**: Efficient model selection based on task complexity
- **Multi-AI Integration**: ChatGPT, Claude Sonnet, GitHub Copilot
- **Context-Aware**: Understands project and file context
- **Risk Classification**: Automatic approval workflow for high-risk operations

### User Interface
- **Activity Bar**: Quick access to Explorer, Search, Git, AI panels
- **Status Bar**: File info, Git branch, cursor position, encoding
- **Resizable Panels**: Flexible layout
- **Dark Mode**: Native iOS dark theme support

## Architecture

**Pattern**: MVVM (Model-View-ViewModel)  
**Framework**: SwiftUI  
**Concurrency**: Async/Await  
**Reactive**: Combine framework  
**Platform**: iOS 15.0+

### Project Structure

```
TruAi/
├── TruAiApp.swift                 # Main entry point
├── Models/                         # 10 data models
│   ├── AppState.swift
│   ├── User.swift
│   ├── ChatMessage.swift
│   ├── Conversation.swift
│   ├── FileItem.swift
│   ├── EditorTab.swift
│   ├── Project.swift
│   ├── Command.swift
│   ├── GitStatus.swift
│   └── SearchResult.swift
├── Services/                       # 7 services
│   ├── TruAiService.swift         # TruAi Core orchestration
│   ├── NetworkService.swift
│   ├── StorageService.swift
│   ├── FileSystemService.swift
│   ├── GitService.swift
│   ├── SearchService.swift
│   └── CodeCompletionService.swift
├── ViewModels/                     # 6 view models
│   ├── ChatViewModel.swift
│   ├── FileExplorerViewModel.swift
│   ├── CodeEditorViewModel.swift
│   ├── CommandPaletteViewModel.swift
│   ├── GitViewModel.swift
│   └── SearchViewModel.swift
├── Views/                          # 12 views
│   ├── ContentView.swift
│   ├── IDELayoutView.swift
│   ├── FileExplorerView.swift
│   ├── CodeEditorView.swift
│   ├── TerminalView.swift
│   ├── ChatView.swift
│   ├── HistoryView.swift
│   ├── SettingsView.swift
│   ├── CommandPaletteView.swift
│   ├── ActivityBarView.swift
│   ├── GitPanelView.swift
│   ├── SearchPanelView.swift
│   └── StatusBarView.swift
├── Configuration/
│   └── AppConfig.swift
└── Utilities/
    └── Extensions.swift
```

## TruAi Core

TruAi Core is the intelligent brain of the system, providing:

1. **AI Arbitration**: Automatically selects the optimal AI model based on task complexity
2. **Cost Efficiency**: Routes simple queries to cheaper models, complex tasks to powerful ones
3. **Risk Management**: Classifies operations as low/high risk and applies appropriate approval workflows
4. **Multi-AI Support**: Integrates ChatGPT, Claude Sonnet, and GitHub Copilot
5. **Production-Ready**: Direct deployment capability with safeguards

### AI Tier Selection Logic

```swift
// TruAi Core automatically determines the best tier:
- Cheap (GPT-3.5): Simple queries, clarifications
- Mid (GPT-4): Code review, optimization
- Copilot: Complex code generation, IDE-specific tasks
- Auto: Let TruAi Core decide
```

## Getting Started

### Requirements
- Xcode 14.0+
- iOS 15.0+
- Swift 5.7+

### Installation

1. Clone the repository:
```bash
git clone https://github.com/DemeWebsolutions/Tru.ai.git
cd Tru.ai
```

2. Open the project in Xcode:
```bash
open TruAi.xcodeproj
```

3. Build and run on iOS Simulator or device

### Configuration

Set your API keys in the Settings view:
- ChatGPT API Key
- Claude API Key
- GitHub Token
- TruAi Core Key (if using hosted service)

## Usage

### File Management
- Navigate files in the Explorer panel
- Create, delete, rename files and folders
- Open multiple files in tabs

### Code Editing
- Multi-tab editing with syntax highlighting
- Line numbers and cursor position tracking
- Auto-save support

### AI Assistance
- Open the AI panel from the Activity Bar
- Type questions or paste code
- TruAi Core automatically selects the best AI model
- View responses inline or in chat

### Git Operations
- View repository status
- Stage/unstage files
- Commit with message
- Push/Pull operations
- Branch management

### Command Palette
- Press Cmd+Shift+P (or open from menu)
- Search for commands
- Execute quickly with keyboard

## Development

### Adding New Features

1. **Models**: Add data structures in `Models/`
2. **Services**: Add business logic in `Services/`
3. **ViewModels**: Add view logic in `ViewModels/`
4. **Views**: Add UI components in `Views/`

### Code Style
- Follow Swift naming conventions
- Use MVVM pattern
- Document public APIs
- Handle errors gracefully

## License

© 2013 - Present My Deme, LLC. All Rights Reserved.

This software is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.

## Credits

Developed by DemeWebsolutions.com  
For My Deme, LLC

## Support

For support, please contact: support@mydeme.com

## Version History

### 1.0.0 (Current)
- Initial release
- Complete IDE framework
- TruAi Core integration
- Full Cursor feature parity
- Production-ready implementation
