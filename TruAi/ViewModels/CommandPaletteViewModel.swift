//
//  CommandPaletteViewModel.swift
//  TruAi
//
//  View model for command palette (Cmd+Shift+P)
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation
import Combine

@MainActor
class CommandPaletteViewModel: ObservableObject {
    @Published var searchText: String = ""
    @Published var commands: [Command] = []
    @Published var isVisible: Bool = false
    
    init() {
        setupCommands()
    }
    
    var filteredCommands: [Command] {
        guard !searchText.isEmpty else { return commands }
        return commands.filter { command in
            command.title.localizedCaseInsensitiveContains(searchText) ||
            command.category.rawValue.localizedCaseInsensitiveContains(searchText)
        }
    }
    
    func executeCommand(_ command: Command) {
        command.action()
        isVisible = false
        searchText = ""
    }
    
    func toggle() {
        isVisible.toggle()
        if !isVisible {
            searchText = ""
        }
    }
    
    private func setupCommands() {
        commands = [
            // File commands
            Command(title: "New File", category: .file, shortcut: "Cmd+N") { },
            Command(title: "Open File", category: .file, shortcut: "Cmd+O") { },
            Command(title: "Save", category: .file, shortcut: "Cmd+S") { },
            Command(title: "Save All", category: .file, shortcut: "Cmd+Opt+S") { },
            Command(title: "Close Editor", category: .file, shortcut: "Cmd+W") { },
            
            // Edit commands
            Command(title: "Undo", category: .edit, shortcut: "Cmd+Z") { },
            Command(title: "Redo", category: .edit, shortcut: "Cmd+Shift+Z") { },
            Command(title: "Find", category: .edit, shortcut: "Cmd+F") { },
            Command(title: "Replace", category: .edit, shortcut: "Cmd+Opt+F") { },
            
            // View commands
            Command(title: "Toggle Sidebar", category: .view, shortcut: "Cmd+B") { },
            Command(title: "Toggle Terminal", category: .view, shortcut: "Cmd+`") { },
            Command(title: "Zoom In", category: .view, shortcut: "Cmd++") { },
            Command(title: "Zoom Out", category: .view, shortcut: "Cmd+-") { },
            
            // Git commands
            Command(title: "Git: Commit", category: .git) { },
            Command(title: "Git: Push", category: .git) { },
            Command(title: "Git: Pull", category: .git) { },
            Command(title: "Git: Create Branch", category: .git) { },
            
            // AI commands
            Command(title: "AI: Start Chat", category: .ai) { },
            Command(title: "AI: Explain Code", category: .ai) { },
            Command(title: "AI: Generate Code", category: .ai) { },
            Command(title: "AI: Optimize Code", category: .ai) { },
        ]
    }
}
