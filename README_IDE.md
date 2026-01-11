# Tru.ai iOS IDE Framework

A complete Cursor-like IDE framework for iOS with file explorer, code editor, terminal, and AI integration.

## Complete Feature Set

### 🗂️ File Explorer
- **Hierarchical file tree** with expand/collapse
- **File type icons** with color coding
- **Search functionality** to find files quickly
- **File operations** (read, write, create, delete)
- **Directory navigation** with proper path handling

### 📝 Code Editor
- **Multi-tab support** for multiple open files
- **Line numbers** for easy navigation
- **Syntax-aware editing** with file type detection
- **Modified file indicators** (• marker)
- **Auto-save** and manual save options
- **Monospaced font** for code readability
- **Cursor position tracking**

### 💻 Terminal
- **Command execution** simulation
- **Command history** tracking
- **Output display** with color coding
- **Clear terminal** functionality
- **Current directory** tracking

### 🤖 AI Integration
- **Side panel** for AI chat
- **Context-aware** assistance
- **Code suggestions** and explanations
- **Integrated with file explorer** and editor

### 🎨 IDE Layout
- **Resizable sidebars** with drag handles
- **Split view** between file explorer and editor
- **Toggleable panels** (file explorer, terminal, AI)
- **Tab management** for multiple files
- **Responsive layout** adapting to screen size

## Architecture

### Models
- **FileItem**: Represents files and directories
- **EditorTab**: Manages open file tabs
- **Project**: Project/workspace management
- **TextPosition**: Cursor position tracking

### Services
- **FileSystemService**: All file operations
- **TruAiService**: AI integration (from base framework)
- **NetworkService**: API communication
- **StorageService**: Local persistence

### ViewModels
- **FileExplorerViewModel**: File tree state management
- **CodeEditorViewModel**: Editor state and tab management
- **ChatViewModel**: AI chat interface

### Views
- **IDELayoutView**: Main IDE layout with panels
- **FileExplorerView**: File tree sidebar
- **CodeEditorView**: Code editing interface
- **TerminalView**: Terminal/shell interface
- **AIPanelView**: AI chat panel

## Usage

### Opening Files
1. Browse files in the File Explorer
2. Tap a file to open it in the editor
3. Files open in new tabs automatically

### Editing Code
1. Type in the code editor
2. Modified files show a • indicator
3. Use toolbar to save files
4. Multiple tabs for multiple files

### Using Terminal
1. Toggle terminal from toolbar
2. Type commands and press Enter
3. View output in terminal
4. Clear with trash button

### AI Assistance
1. Toggle AI panel from toolbar
2. Ask questions about your code
3. Get code suggestions
4. Context-aware responses

## File Operations

### Supported Operations
- ✅ Read files
- ✅ Write/save files
- ✅ Create files
- ✅ Delete files
- ✅ Create directories
- ✅ List directory contents
- ✅ Move/copy files

### File Types Supported
- Swift (.swift)
- JavaScript/TypeScript (.js, .ts, .jsx, .tsx)
- Python (.py)
- HTML/CSS (.html, .css)
- JSON (.json)
- Markdown (.md)
- Text files (.txt)
- Images (jpg, png, gif, svg, etc.)
- And more...

## Project Structure

```
TruAi/
├── Models/
│   ├── FileItem.swift          # File system items
│   ├── EditorTab.swift         # Editor tabs
│   └── Project.swift           # Project management
├── Services/
│   └── FileSystemService.swift # File operations
├── ViewModels/
│   ├── FileExplorerViewModel.swift
│   └── CodeEditorViewModel.swift
├── Views/
│   ├── IDELayoutView.swift     # Main IDE layout
│   ├── FileExplorerView.swift  # File sidebar
│   ├── CodeEditorView.swift    # Code editor
│   ├── TerminalView.swift      # Terminal
│   └── AIPanelView.swift       # AI chat panel
└── ContentView.swift           # Main view switcher
```

## Customization

### Editor Settings
- Font size
- Font family
- Tab size
- Line endings
- Word wrap
- Auto-save

### Layout Customization
- Resize sidebars
- Toggle panels
- Arrange views
- Full-screen editor

## Integration with Base Framework

The IDE framework integrates seamlessly with the base Tru.ai framework:
- Uses `TruAiService` for AI functionality
- Shares `AppState` for global settings
- Uses `StorageService` for persistence
- Extends `NetworkService` for file operations

## Future Enhancements

Potential additions:
- Syntax highlighting (using SwiftSyntax)
- Code completion
- Git integration
- Find/replace
- Code folding
- Split editor views
- Themes and color schemes
- Extensions/plugins
- Remote file access
- Collaboration features

## Requirements

- iOS 15.0+
- Xcode 14.0+
- Swift 5.7+

## Getting Started

1. Open the project in Xcode
2. Build and run
3. The IDE will open with file explorer
4. Navigate to your project directory
5. Start coding!

The framework is production-ready and follows iOS development best practices with proper error handling, state management, and user experience considerations.
