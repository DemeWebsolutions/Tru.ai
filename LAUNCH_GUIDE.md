# Tru.ai IDE - Setup and Launch Guide

This guide explains how to configure and launch the standalone Tru.ai IDE macOS application.

## ⚠️ Important: @main Conflict

**CRITICAL:** Only ONE file should have the `@main` attribute at a time. The repository includes:
- `TruAiIDEApp.swift` - Standalone IDE (NEW) ✅ Has @main
- `TruAiMacApp.swift` - Full app with auth (Has @main wrapped in `#if os(macOS)`)
- `TruAiApp.swift` - iOS version (Has @main)

**Solution:** Use **conditional compilation** or choose one entry point. See "Method 3" below for details.

## Overview

The repository now contains **two separate macOS applications**:

1. **TruAiMacApp.swift** - Full app with authentication flow (login → IDE)
2. **TruAiIDEApp.swift** - Standalone IDE that launches directly into the editor (NEW)

## Standalone IDE Features

The standalone IDE (`TruAiIDEApp.swift`) is a complete Cursor-like code editor with:

### Core Features
- ✅ File Explorer with hierarchical tree view
- ✅ Multi-tab Code Editor with syntax awareness
- ✅ Integrated Terminal
- ✅ Git Integration (stage, commit, push/pull, diff view)
- ✅ Search in Files (with regex support)
- ✅ Command Palette (Cmd+Shift+P)
- ✅ AI Assistant Panel (powered by Tru.ai)
- ✅ Status Bar with file info and Git status
- ✅ Resizable panels and customizable layout
- ✅ Settings and preferences
- ✅ Full keyboard shortcut support

### UI Layout
```
┌─────────────────────────────────────────────────────────┐
│  File  Edit  View  Go  Git  AI  Window  Help           │ Menu Bar
├──┬──────────────────────────────────────────────────────┤
│  │  Explorer                        │ Editor Tabs       │
│☰ │  📁 project/                     ├──────┬───────┬────┤
│🔍│    📄 main.swift                 │ main │ utils │ +  │
│⚡│    📄 utils.swift                │                    │
│🐙│    📁 Tests/                     │ 1  import SwiftUI │
│▶ │      📄 test.swift               │ 2                 │
│🧩│                                  │ 3  struct App {   │
│🤖│                                  │ 4    var body...  │
│⚙ │                                  │ 5  }              │
│  │                                  │                   │
├──┴──────────────────────────────────┴───────────────────┤
│  > Terminal                          [_][□][x]          │
│  $ swift build                                          │
│  Compiling...                                           │
├─────────────────────────────────────────────────────────┤
│  main.swift  •  main  Ln 4, Col 8  UTF-8  LF          │ Status Bar
└─────────────────────────────────────────────────────────┘
```

## Setup Instructions

### Method 1: Configure Xcode Target (Recommended)

1. **Open the Xcode Project:**
   ```bash
   cd "/path/to/Tru.ai"
   open "TruAi troubleshoot/TruAi.xcodeproj"
   ```

2. **Update the Build Target:**
   - Select the "TruAi" scheme in Xcode
   - Go to Product → Scheme → Edit Scheme...
   - Under "Run" → "Info" tab
   - Change "Executable" to use `TruAiIDEApp.swift`

3. **Build and Run:**
   - Press Cmd+R or click Run button
   - The IDE will launch directly without authentication

### Method 2: Create New Scheme

1. **Duplicate the Existing Scheme:**
   - Product → Scheme → Manage Schemes...
   - Select "TruAi" and click "Duplicate"
   - Rename to "TruAi IDE Standalone"

2. **Configure the New Scheme:**
   - Edit the new scheme
   - Under "Run" → "Info"
   - Set executable to `TruAiIDEApp`

3. **Select and Run:**
   - Choose "TruAi IDE Standalone" scheme
   - Press Cmd+R

### Method 3: Modify Project File

To permanently change the main entry point:

1. **Update project.pbxproj:**
   - Navigate to `TruAi troubleshoot/TruAi.xcodeproj/project.pbxproj`
   - Comment out or remove references to `TruAiMacApp.swift` in build phases
   - Ensure `TruAiIDEApp.swift` is in the "Compile Sources" build phase
   - Ensure it has the `@main` attribute

2. **Alternative: Use Compiler Flags:**
   - In Build Settings → Swift Compiler - Custom Flags
   - Add: `-DSTANDALONE_IDE`
   - Wrap code conditionally:
   ```swift
   #if STANDALONE_IDE
   // Use TruAiIDEApp
   #else
   // Use TruAiMacApp
   #endif
   ```

## Configuration

### API Key Setup

To use AI features:

1. **Environment Variable (Recommended):**
   ```bash
   export TRU_AI_API_KEY="your-api-key-here"
   ```
   
   Add to `~/.zshrc` or `~/.bash_profile` for persistence.

2. **In-App Settings:**
   - Launch the IDE
   - Go to Tru.ai IDE → Settings (Cmd+,)
   - Navigate to "AI Configuration"
   - Enter your API key
   - Click Save

3. **Configuration File:**
   - Edit `Configuration/AppConfig.swift`
   - Set the API key (for development only)

### Editor Preferences

Customize in Settings (Cmd+,):

- **Editor:**
  - Font family: SF Mono, Menlo, Monaco, Courier
  - Font size: 10-24 pt
  - Tab size: 2-8 spaces
  - Word wrap: On/Off
  - Auto-save: On/Off

- **Theme:**
  - Light, Dark, or Auto (follows system)

- **Terminal:**
  - Shell: zsh, bash, fish, sh
  - Font size: 10-16 pt

- **Git:**
  - Auto-fetch: On/Off
  - Confirm before sync: On/Off

## Quick Start

### Opening a Project

1. **From Menu:**
   - File → Open... (Cmd+O)
   - Select a folder
   - Browse files in the Explorer

2. **From Terminal:**
   ```bash
   # Set default project directory
   defaults write com.truai.ide defaultProjectPath "/path/to/your/project"
   ```

3. **Drag and Drop:**
   - Drag a folder onto the app icon
   - Or drag into the File Explorer panel

### Basic Workflow

1. **Open Files:**
   - Click files in Explorer to open
   - Or use Quick Open (Cmd+P)

2. **Edit Code:**
   - Type in the editor
   - Changes auto-save (or Cmd+S)
   - Switch tabs with Cmd+1, Cmd+2, etc.

3. **Use Terminal:**
   - Toggle with Cmd+`
   - Run commands: build, test, deploy

4. **Ask AI:**
   - Click AI icon in Activity Bar
   - Or press Cmd+Shift+L
   - Type questions about your code

5. **Git Operations:**
   - Click Git icon in Activity Bar
   - View changes, stage files
   - Commit with message
   - Push/pull

## Keyboard Shortcuts

### Essential Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+N` | New File |
| `Cmd+O` | Open Project |
| `Cmd+S` | Save File |
| `Cmd+P` | Quick Open File |
| `Cmd+Shift+P` | Command Palette |
| `Cmd+F` | Find in File |
| `Cmd+Shift+F` | Find in Files |
| `Cmd+B` | Toggle Explorer |
| `Cmd+\`` | Toggle Terminal |
| `Cmd+Shift+L` | AI Assistant |

See README_IDE_STANDALONE.md for complete list.

## Troubleshooting

### Build Errors

**Error: "Multiple @main entry points"**
- Solution: Only one file should have `@main`
- Remove `@main` from `TruAiMacApp.swift` or use conditional compilation

**Error: "Cannot find TruAiIDEApp in scope"**
- Solution: Ensure `TruAiIDEApp.swift` is added to target
- Check it's in "Compile Sources" build phase

### Runtime Issues

**IDE doesn't launch:**
- Check Console.app for errors
- Verify macOS version (12.0+)
- Try: Clean Build Folder (Cmd+Shift+K)

**AI features not working:**
- Verify API key is set
- Check internet connection
- View logs in Console.app

**File Explorer empty:**
- Grant file system access in System Preferences → Security & Privacy
- Try selecting a different folder

## File Structure

```
TruAi/
├── TruAiIDEApp.swift              ← NEW: Standalone IDE entry
├── TruAiMacApp.swift              ← Original: With authentication
├── TruAiApp.swift                 ← iOS version
├── Configuration/
│   ├── AppConfig.swift            ← General config
│   └── IDEConfig.swift            ← NEW: IDE-specific config
├── Models/                         ← Data models
├── Services/                       ← Business logic
├── ViewModels/                     ← MVVM view models
├── Views/
│   ├── IDELayoutView.swift        ← Main IDE interface
│   └── ...                        ← Other views
└── README_IDE_STANDALONE.md       ← NEW: IDE documentation
```

## Next Steps

1. **Launch the IDE** - Follow Method 1 or 2 above
2. **Configure Settings** - Set up API key and preferences
3. **Open a Project** - Load your code
4. **Start Coding** - Explore all features

## Support

- **Documentation**: See README_IDE_STANDALONE.md
- **Issues**: GitHub Issues
- **Questions**: support@tru.ai

---

**Happy Coding with Tru.ai IDE!** 🚀
