//
//  AppState.swift
//  TruAi
//
//  Tru.ai iOS IDE Framework - Core Application State
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import SwiftUI
import Combine

/// Central application state management
class AppState: ObservableObject {
    // User
    @Published var currentUser: User?
    @Published var isAuthenticated: Bool = false
    
    // UI State
    @Published var selectedTab: Int = 0
    @Published var showCommandPalette: Bool = false
    @Published var showSettings: Bool = false
    @Published var activePanel: PanelType = .explorer
    
    // IDE State
    @Published var currentProject: Project?
    @Published var openTabs: [EditorTab] = []
    @Published var selectedTabIndex: Int = 0
    
    // AI State
    @Published var conversations: [Conversation] = []
    @Published var currentConversation: Conversation?
    
    // File System
    @Published var rootFiles: [FileItem] = []
    @Published var selectedFile: FileItem?
    
    // Git State
    @Published var gitStatus: GitStatus?
    
    // Theme
    @Published var isDarkMode: Bool = true
    
    init() {
        loadState()
    }
    
    func loadState() {
        // Load persisted state from StorageService
        // This would integrate with StorageService
    }
    
    func saveState() {
        // Save current state to storage
    }
}

enum PanelType {
    case explorer
    case search
    case git
    case debug
    case extensions
    case ai
}
