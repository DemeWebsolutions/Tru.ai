//
//  IDEConfig.swift
//  Tru.ai IDE
//
//  Configuration for standalone IDE application
//

import Foundation

struct IDEConfig {
    // App Information
    static let appName = "Tru.ai IDE"
    static let appVersion = "1.0.0"
    static let buildNumber = "2026.01"
    static let bundleIdentifier = "com.truai.ide"
    
    // Window Configuration
    static let minWindowWidth: CGFloat = 1200
    static let minWindowHeight: CGFloat = 800
    static let defaultWindowWidth: CGFloat = 1400
    static let defaultWindowHeight: CGFloat = 900
    
    // Editor Defaults
    static let defaultFontSize: Int = 14
    static let defaultFontFamily = "SF Mono"
    static let defaultTabSize: Int = 4
    static let defaultLineEnding = LineEnding.lf
    static let defaultEncoding = "UTF-8"
    static let autoSaveEnabled = true
    static let autoSaveDelay: TimeInterval = 2.0 // seconds
    
    // Sidebar Configuration
    static let defaultSidebarWidth: CGFloat = 250
    static let minSidebarWidth: CGFloat = 150
    static let maxSidebarWidth: CGFloat = 500
    
    // Terminal Configuration
    static let defaultTerminalHeight: CGFloat = 200
    static let minTerminalHeight: CGFloat = 100
    static let maxTerminalHeight: CGFloat = 600
    static let defaultShell = Shell.zsh
    static let terminalFontSize: Int = 12
    
    // AI Configuration
    static let aiEnabled = true
    static let defaultAIModel = "gpt-4"
    static let defaultTemperature: Double = 0.7
    static let defaultMaxTokens: Int = 2000
    static let aiStreamingEnabled = true
    
    // Git Configuration
    static let gitAutoFetch = false
    static let gitAutoFetchInterval: TimeInterval = 300 // 5 minutes
    static let gitShowInlineBlame = false
    static let gitConfirmBeforeSync = true
    
    // Search Configuration
    static let searchCaseSensitive = false
    static let searchWholeWord = false
    static let searchRegexEnabled = false
    static let searchMaxResults = 1000
    
    // Code Completion Configuration
    static let codeCompletionEnabled = true
    static let codeCompletionDelay: TimeInterval = 0.3
    static let codeCompletionMaxSuggestions = 10
    
    // File Explorer Configuration
    static let showHiddenFiles = false
    static let sortFilesBy = FileSortOption.name
    static let excludePatterns = [
        "node_modules",
        ".git",
        ".DS_Store",
        "*.pyc",
        "__pycache__",
        ".build",
        "DerivedData"
    ]
    
    // Theme Configuration
    static let defaultTheme = Theme.dark
    static let availableThemes: [Theme] = [.light, .dark, .auto]
    
    // Keyboard Shortcuts (documented, handled by system)
    static let shortcuts: [String: String] = [
        "New File": "Cmd+N",
        "Open": "Cmd+O",
        "Save": "Cmd+S",
        "Save All": "Cmd+Shift+S",
        "Close Tab": "Cmd+W",
        "Command Palette": "Cmd+Shift+P",
        "Quick Open": "Cmd+P",
        "Go to Line": "Cmd+G",
        "Go to Symbol": "Cmd+Shift+O",
        "Find": "Cmd+F",
        "Find in Files": "Cmd+Shift+F",
        "Replace": "Cmd+Option+F",
        "Toggle Explorer": "Cmd+B",
        "Toggle Terminal": "Cmd+`",
        "Zoom In": "Cmd++",
        "Zoom Out": "Cmd+-",
        "Reset Zoom": "Cmd+0",
        "Git Commit": "Cmd+Shift+G",
        "AI Assistant": "Cmd+Shift+L"
    ]
    
    // Performance Configuration
    static let maxOpenTabs = 50
    static let maxSearchResults = 10000
    static let syntaxHighlightingEnabled = true
    static let lineNumbersEnabled = true
    static let minimapEnabled = false
    
    // Storage Keys
    static let storageKeyPrefix = "com.truai.ide."
    static let apiKeyStorageKey = storageKeyPrefix + "apiKey"
    static let recentProjectsKey = storageKeyPrefix + "recentProjects"
    static let editorSettingsKey = storageKeyPrefix + "editorSettings"
    static let windowStateKey = storageKeyPrefix + "windowState"
}

// MARK: - Supporting Types

enum LineEnding: String, Codable, CaseIterable {
    case lf = "LF"
    case crlf = "CRLF"
    case cr = "CR"
    
    var displayName: String {
        return self.rawValue
    }
}

enum Shell: String, Codable, CaseIterable {
    case bash = "bash"
    case zsh = "zsh"
    case fish = "fish"
    case sh = "sh"
    
    var displayName: String {
        return self.rawValue
    }
}

enum Theme: String, Codable, CaseIterable {
    case light = "Light"
    case dark = "Dark"
    case auto = "Auto"
    
    var displayName: String {
        return self.rawValue
    }
}

enum FileSortOption: String, Codable, CaseIterable {
    case name = "Name"
    case dateModified = "Date Modified"
    case type = "Type"
    case size = "Size"
    
    var displayName: String {
        return self.rawValue
    }
}

// MARK: - IDE Feature Flags

struct IDEFeatureFlags {
    static let gitIntegrationEnabled = true
    static let aiIntegrationEnabled = true
    static let terminalEnabled = true
    static let searchEnabled = true
    static let codeCompletionEnabled = true
    static let debuggerEnabled = false // Coming soon
    static let extensionsEnabled = false // Coming soon
    static let collaborationEnabled = false // Coming soon
    static let cloudSyncEnabled = false // Coming soon
}

// MARK: - File Type Configuration

struct FileTypeConfig {
    static let supportedLanguages = [
        "swift", "js", "ts", "py", "go", "rs", "rb", "java",
        "cpp", "c", "h", "hpp", "cs", "php", "html", "css",
        "scss", "json", "xml", "yaml", "md", "txt", "sh"
    ]
    
    static let languageIcons: [String: String] = [
        "swift": "swift",
        "js": "doc.text",
        "ts": "doc.text",
        "py": "doc.text.fill",
        "go": "doc.text",
        "rs": "doc.text",
        "html": "chevron.left.forwardslash.chevron.right",
        "css": "paintpalette",
        "json": "curlybraces",
        "md": "doc.richtext",
        "txt": "doc"
    ]
    
    static func icon(for fileExtension: String) -> String {
        return languageIcons[fileExtension] ?? "doc"
    }
}
