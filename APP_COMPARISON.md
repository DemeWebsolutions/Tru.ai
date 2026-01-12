# Tru.ai Application Comparison

## Two macOS Applications Available

### 1. TruAiMacApp.swift - Full Application with Authentication

**Flow:**
```
Launch App → Login Screen → IDE Interface
```

**Features:**
- User authentication required
- Login/Signup interface
- User session management
- Full IDE after authentication
- Settings accessible after login

**Use Case:**
- Multi-user environments
- Secure access control
- User-specific settings
- Cloud sync (future)

**Entry Point:**
```swift
@main
struct TruAiMacApp: App {
    @StateObject private var authService = AuthenticationService()
    
    var body: some Scene {
        WindowGroup {
            if authService.isAuthenticated {
                IDELayoutView()  // Show IDE
            } else {
                LoginView()      // Show login first
            }
        }
    }
}
```

---

### 2. TruAiIDEApp.swift - Standalone IDE (NEW) ⭐

**Flow:**
```
Launch App → IDE Interface (Direct)
```

**Features:**
- No authentication required
- Direct launch to editor
- All IDE features enabled
- Simplified workflow
- Offline-first approach

**Use Case:**
- Personal development
- Quick code editing
- Offline work
- Education/learning
- Single-user workstations

**Entry Point:**
```swift
@main
struct TruAiIDEApp: App {
    @StateObject private var appState = AppState()
    
    var body: some Scene {
        WindowGroup("Tru.ai IDE") {
            IDELayoutView()  // Direct to IDE
                .frame(minWidth: 1200, minHeight: 800)
        }
    }
}
```

---

## Feature Comparison

| Feature | TruAiMacApp | TruAiIDEApp |
|---------|-------------|-------------|
| **Authentication** | ✅ Required | ❌ Not required |
| **File Explorer** | ✅ | ✅ |
| **Code Editor** | ✅ | ✅ |
| **Terminal** | ✅ | ✅ |
| **Git Integration** | ✅ | ✅ |
| **Search in Files** | ✅ | ✅ |
| **Command Palette** | ✅ | ✅ |
| **AI Assistant** | ✅ | ✅ |
| **Settings** | ✅ | ✅ |
| **User Management** | ✅ | ❌ |
| **Session Tracking** | ✅ | ❌ |
| **Startup Speed** | Slower (login) | ⚡ Faster (direct) |
| **Target Users** | Teams | Individuals |

---

## Visual Comparison

### TruAiMacApp (With Authentication)

```
┌─────────────────────────────────────┐
│         Tru.ai Application          │
│                                     │
│   ╔═══════════════════════════╗   │
│   ║       LOGIN SCREEN         ║   │
│   ║                           ║   │
│   ║   Email: [___________]    ║   │
│   ║   Password: [_______]     ║   │
│   ║                           ║   │
│   ║      [  Login  ]          ║   │
│   ║                           ║   │
│   ║   Don't have account?     ║   │
│   ║      Sign Up              ║   │
│   ╚═══════════════════════════╝   │
│                                     │
└─────────────────────────────────────┘
              ↓
         (After Login)
              ↓
┌─────────────────────────────────────┐
│  File Edit View Git AI    [User▾]  │
├──┬──────────────────────────────────┤
│☰ │ Explorer    │ Editor            │
│🔍│ Files       │ Code here...      │
│⚡│             │                   │
│🐙│             │                   │
└──┴──────────────────────────────────┘
```

### TruAiIDEApp (Direct Launch) ⭐

```
┌─────────────────────────────────────┐
│  File Edit View Git AI              │ ← Launches directly!
├──┬──────────────────────────────────┤
│☰ │ Explorer    │ Editor            │
│🔍│ 📁 project  │ 1 import SwiftUI  │
│⚡│   📄 main   │ 2                 │
│🐙│   📄 utils  │ 3 struct App {    │
│▶ │ 📁 Tests    │ 4   var body...   │
│🧩│             │ 5 }               │
│🤖│             │                   │
├──┴──────────────────────────────────┤
│ > Terminal                          │
│ $ swift build                       │
├─────────────────────────────────────┤
│ main.swift  Ln 3, Col 8  UTF-8     │
└─────────────────────────────────────┘
```

---

## Shared Components

Both applications use the **same underlying IDE infrastructure**:

```
Common Components (Shared):
├── Models/
│   ├── FileItem.swift
│   ├── EditorTab.swift
│   ├── ChatMessage.swift
│   └── ... (all models)
├── Services/
│   ├── FileSystemService.swift
│   ├── GitService.swift
│   ├── TruAiService.swift
│   └── ... (all services)
├── ViewModels/
│   ├── CodeEditorViewModel.swift
│   ├── FileExplorerViewModel.swift
│   └── ... (all view models)
└── Views/
    ├── IDELayoutView.swift      ← Core IDE interface
    ├── ActivityBarView.swift
    ├── FileExplorerView.swift
    ├── CodeEditorView.swift
    ├── TerminalView.swift
    ├── GitPanelView.swift
    └── ... (all views)
```

---

## How to Choose

### Choose TruAiMacApp if you need:
- User authentication
- Team collaboration (future)
- Cloud sync (future)
- User profiles and settings per user
- Access control

### Choose TruAiIDEApp if you want:
- ⚡ Fastest startup
- 🔓 No login required
- 🏠 Personal projects
- 📚 Learning and education
- ✈️ Offline development
- 🎯 Focus on coding only

---

## Configuration

### To Use TruAiMacApp (Current Default):
```bash
# In Xcode:
1. Open project
2. Select "TruAi" scheme
3. Build and run
# App will show login screen first
```

### To Use TruAiIDEApp (Standalone):
```bash
# Method 1: Edit Scheme
1. Product → Scheme → Edit Scheme
2. Run → Info → Executable: "Tru.ai IDE"
3. Build and run

# Method 2: Create New Scheme
1. Duplicate existing scheme
2. Name it "TruAi IDE Standalone"
3. Configure to use TruAiIDEApp
4. Select and run
```

See **LAUNCH_GUIDE.md** for detailed setup instructions.

---

## Summary

| Aspect | TruAiMacApp | TruAiIDEApp |
|--------|-------------|-------------|
| **Purpose** | Full-featured app | Code editor focus |
| **Launch** | Login → IDE | IDE directly |
| **Speed** | ~3-5s startup | ⚡ ~1-2s startup |
| **Complexity** | Higher | Lower |
| **Best For** | Teams | Individuals |

Both apps share the same powerful IDE engine - choose based on your needs!

---

**Recommendation:** Start with **TruAiIDEApp** for personal projects and quick editing, switch to **TruAiMacApp** when you need authentication and team features.
