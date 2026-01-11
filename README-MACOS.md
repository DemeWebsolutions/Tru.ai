# Tru.ai Desktop (macOS) Version

A native macOS desktop IDE application built with SwiftUI, featuring AI-powered code assistance similar to Cursor IDE.

## Overview

Tru.ai Desktop brings the full power of Tru.ai to macOS as a native application. Built entirely with SwiftUI, it provides a seamless, high-performance IDE experience with integrated AI assistance.

## Features

### 🖥️ Native macOS Application
- **Native Performance**: Built with SwiftUI for optimal macOS performance
- **System Integration**: Full macOS menu bar, keyboard shortcuts, and system services
- **Dark Mode**: Native dark mode support with macOS appearance integration
- **Window Management**: Resizable windows with minimum size constraints
- **Settings Panel**: Native macOS settings window (Cmd+,)

### 🎯 Cursor-Like IDE Features
- **Activity Bar**: Quick access to Explorer, Search, Git, Debug, Extensions, and AI
- **File Explorer**: Hierarchical file tree with file type icons
- **Code Editor**: Multi-tab editor with syntax awareness
- **Integrated Terminal**: Built-in terminal for command execution
- **Search**: Find in files with regex support
- **Git Integration**: Status, commit, push/pull operations
- **Command Palette**: Quick access to all commands (Cmd+Shift+P)
- **Status Bar**: File info, Git status, cursor position

### 🤖 AI Integration
- **Tru.ai Assistant**: Context-aware AI help
- **Code Generation**: AI-powered code suggestions
- **Chat Interface**: Conversational AI interaction
- **Multi-Model Support**: Support for various AI models

## System Requirements

- **macOS**: 12.0 (Monterey) or later
- **Xcode**: 14.0 or later (for building from source)
- **Swift**: 5.7 or later
- **Architecture**: Apple Silicon (M1/M2/M3) or Intel

## Installation

### Option 1: Download Pre-built Binary (Recommended)
1. Download the latest `Tru.ai.dmg` from [Releases](https://github.com/DemeWebsolutions/Tru.ai/releases)
2. Open the DMG file
3. Drag `Tru.ai.app` to your Applications folder
4. Launch Tru.ai from Applications

### Option 2: Build from Source

#### Prerequisites
```bash
# Install Xcode from the Mac App Store
# Or download from https://developer.apple.com/xcode/

# Verify installation
xcode-select --version
```

#### Building the Application

1. **Clone the Repository**
```bash
git clone https://github.com/DemeWebsolutions/Tru.ai.git
cd Tru.ai
```

2. **Open in Xcode**
```bash
# Create an Xcode project (if not already present)
# The SwiftUI files are already configured for macOS

# For a proper build, you'll need to create a macOS target in Xcode:
# - Open Xcode
# - File > New > Project
# - Choose "macOS" > "App"
# - Add existing Swift files to the project
# - Set deployment target to macOS 12.0+
```

3. **Configure the Project**
- Set bundle identifier: `ai.tru.desktop` or your preferred identifier
- Configure signing: Select your development team
- Set minimum macOS version: 12.0
- Use `Info-macOS.plist` for macOS target

4. **Build and Run**
```bash
# In Xcode:
# - Select "My Mac" as the destination
# - Press Cmd+R to build and run
# Or press Cmd+B to build only

# For command-line build (requires project setup):
xcodebuild -scheme TruAi -destination 'platform=macOS' -configuration Release build
```

5. **Create Distribution Build**
```bash
# Archive the app
xcodebuild -scheme TruAi -destination 'platform=macOS' -archivePath ./build/TruAi.xcarchive archive

# Export as macOS app
xcodebuild -exportArchive -archivePath ./build/TruAi.xcarchive -exportPath ./build -exportOptionsPlist exportOptions.plist
```

## Configuration

### First Launch Setup

1. **API Configuration**
   - Launch Tru.ai
   - Press `Cmd+,` to open Settings
   - Navigate to "AI" tab
   - Enter your Tru.ai API key
   - Configure default model and parameters

2. **Workspace Setup**
   - Use File > Open to select your project directory
   - Or drag a folder onto the Tru.ai window
   - The file explorer will show your project structure

### Environment Variables

You can also configure via environment variables:

```bash
# Set API key
export TRU_AI_API_KEY="your-api-key-here"

# Set API base URL (optional)
export TRU_AI_API_URL="https://api.tru.ai"

# Launch the app
open /Applications/Tru.ai.app
```

## Keyboard Shortcuts

### File Operations
- `Cmd+N` - New File
- `Cmd+O` - Open File/Folder
- `Cmd+S` - Save Current File
- `Cmd+Shift+S` - Save All Files
- `Cmd+W` - Close Tab

### View
- `Cmd+B` - Toggle Sidebar
- `Cmd+\`` - Toggle Terminal
- `Cmd+Shift+P` - Command Palette
- `Cmd+,` - Settings

### AI Features
- `Cmd+Shift+L` - Ask Tru.ai
- `Cmd+Option+N` - New AI Conversation

### Search
- `Cmd+F` - Find in File
- `Cmd+Shift+F` - Find in Files
- `Cmd+P` - Go to File

### Editor
- `Cmd+/` - Toggle Comment
- `Cmd+]` - Indent
- `Cmd+[` - Outdent
- `Cmd++` - Increase Font Size
- `Cmd+-` - Decrease Font Size

## Project Structure

```
Tru.ai/
├── TruAiApp.swift              # Main app entry (iOS & macOS)
├── Info-macOS.plist            # macOS-specific configuration
├── Models/                     # Data models
├── Services/                   # Business logic
│   ├── TruAiService.swift     # AI integration
│   ├── FileSystemService.swift # File operations
│   ├── GitService.swift       # Git integration
│   └── ...
├── ViewModels/                # MVVM view models
├── Views/                     # SwiftUI views
│   ├── ContentView.swift     # Main view
│   ├── IDELayoutView.swift   # IDE layout
│   ├── CodeEditorView.swift  # Editor
│   └── ...
└── README-MACOS.md           # This file
```

## Platform-Specific Features

### macOS-Only Features
- Native menu bar with standard macOS menus
- Settings window accessible via Cmd+,
- System-level keyboard shortcuts
- Hidden title bar for more screen space
- Resizable sidebar and panels
- Native file picker dialogs

### Cross-Platform Features (iOS & macOS)
- All SwiftUI views work on both platforms
- Shared services and view models
- Consistent dark mode appearance
- Same feature set and functionality

## Development

### Adding macOS-Specific Code

Use conditional compilation for platform-specific code:

```swift
#if os(macOS)
// macOS-specific code
.frame(minWidth: 1024, minHeight: 768)
#elseif os(iOS)
// iOS-specific code
.navigationBarTitle("Title")
#endif
```

### Testing

```bash
# Run tests in Xcode
Cmd+U

# Or command line
xcodebuild test -scheme TruAi -destination 'platform=macOS'
```

### Debugging

1. Set breakpoints in Xcode
2. Press `Cmd+R` to run with debugger
3. View console output in Xcode's debug area
4. Use Instruments for performance profiling

## Troubleshooting

### Common Issues

**1. "Tru.ai" can't be opened because Apple cannot check it for malicious software**
- Right-click the app and select "Open"
- Click "Open" in the dialog
- Or: System Preferences > Security & Privacy > Allow

**2. Build fails with code signing error**
- Open Xcode project settings
- Select your development team
- Or disable code signing for local development

**3. App won't launch**
- Check Console.app for crash logs
- Ensure macOS version is 12.0 or later
- Try resetting preferences: `defaults delete ai.tru.desktop`

**4. API connection issues**
- Verify API key in Settings
- Check internet connection
- Review API URL configuration

## Performance Tips

- **File System Access**: Grant Full Disk Access in System Preferences for better performance
- **Memory**: Close unused tabs to reduce memory usage
- **Terminal**: Clear terminal history periodically
- **Search**: Use specific file patterns to limit search scope

## Distribution

### Creating a DMG

```bash
# Using create-dmg (install via Homebrew)
brew install create-dmg

create-dmg \
  --volname "Tru.ai" \
  --volicon "TruAi-icon.icns" \
  --window-pos 200 120 \
  --window-size 800 400 \
  --icon-size 100 \
  --icon "Tru.ai.app" 200 190 \
  --hide-extension "Tru.ai.app" \
  --app-drop-link 600 185 \
  "Tru.ai-Installer.dmg" \
  "build/Release/"
```

### Notarization (for distribution)

```bash
# 1. Archive and export
xcodebuild archive -scheme TruAi -archivePath TruAi.xcarchive

# 2. Export for distribution
xcodebuild -exportArchive -archivePath TruAi.xcarchive -exportPath ./export -exportOptionsPlist export.plist

# 3. Create DMG
create-dmg ... (as above)

# 4. Notarize with Apple
xcrun notarytool submit Tru.ai-Installer.dmg \
  --apple-id "your-apple-id@email.com" \
  --team-id "TEAM_ID" \
  --password "app-specific-password" \
  --wait

# 5. Staple notarization
xcrun stapler staple Tru.ai-Installer.dmg
```

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

Copyright © 2026 Tru.ai. All rights reserved.
Proprietary and intellectual property of My Deme, LLC.

## Support

- **Documentation**: [https://docs.tru.ai](https://docs.tru.ai)
- **Issues**: [GitHub Issues](https://github.com/DemeWebsolutions/Tru.ai/issues)
- **Contact**: support@tru.ai

## Roadmap

### Upcoming Features
- [ ] Syntax highlighting with SwiftSyntax
- [ ] Code completion improvements
- [ ] Git diff viewer
- [ ] Split editor views
- [ ] Extension/plugin system
- [ ] Collaboration features
- [ ] Custom themes
- [ ] Performance optimizations

## Comparison with Cursor IDE

| Feature | Tru.ai Desktop | Cursor IDE |
|---------|----------------|------------|
| Native macOS | ✅ | ✅ |
| AI Integration | ✅ | ✅ |
| Code Editor | ✅ | ✅ |
| Terminal | ✅ | ✅ |
| Git Integration | ✅ | ✅ |
| File Explorer | ✅ | ✅ |
| Command Palette | ✅ | ✅ |
| Built with | SwiftUI | Electron |
| Performance | Native | Web-based |
| Platform | macOS, iOS | macOS, Windows, Linux |

Tru.ai Desktop provides native macOS performance with SwiftUI, while Cursor uses Electron for cross-platform support. Choose Tru.ai for the best native macOS experience!
