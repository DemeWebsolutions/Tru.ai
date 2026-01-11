//
//  CommandPaletteViewModel.swift
//  TruAi
//
//  ViewModel for command palette
//

import Foundation
import SwiftUI
import Combine

@MainActor
class CommandPaletteViewModel: ObservableObject {
    @Published var isVisible: Bool = false
    @Published var searchText: String = ""
    @Published var filteredCommands: [Command] = []
    @Published var selectedIndex: Int = 0
    
    private var allCommands: [Command] = []
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        setupCommands()
        
        $searchText
            .debounce(for: .milliseconds(100), scheduler: RunLoop.main)
            .sink { [weak self] searchText in
                self?.filterCommands(searchText)
            }
            .store(in: &cancellables)
    }
    
    private func setupCommands() {
        allCommands = [
            // File commands
            Command(title: "New File", category: .file, icon: "doc.badge.plus", shortcut: KeyboardShortcut(key: "N", modifiers: [.command])) {
                // Action
            },
            Command(title: "Open File...", category: .file, icon: "folder", shortcut: KeyboardShortcut(key: "O", modifiers: [.command])) {
                // Action
            },
            Command(title: "Save", category: .file, icon: "square.and.arrow.down", shortcut: KeyboardShortcut(key: "S", modifiers: [.command])) {
                // Action
            },
            Command(title: "Save All", category: .file, icon: "square.and.arrow.down.on.square", shortcut: KeyboardShortcut(key: "S", modifiers: [.command, .shift])) {
                // Action
            },
            
            // Edit commands
            Command(title: "Undo", category: .edit, icon: "arrow.uturn.backward", shortcut: KeyboardShortcut(key: "Z", modifiers: [.command])) {
                // Action
            },
            Command(title: "Redo", category: .edit, icon: "arrow.uturn.forward", shortcut: KeyboardShortcut(key: "Z", modifiers: [.command, .shift])) {
                // Action
            },
            Command(title: "Find", category: .edit, icon: "magnifyingglass", shortcut: KeyboardShortcut(key: "F", modifiers: [.command])) {
                // Action
            },
            Command(title: "Replace", category: .edit, icon: "arrow.triangle.2.circlepath", shortcut: KeyboardShortcut(key: "F", modifiers: [.command, .option])) {
                // Action
            },
            
            // View commands
            Command(title: "Toggle File Explorer", category: .view, icon: "sidebar.left", shortcut: KeyboardShortcut(key: "B", modifiers: [.command])) {
                // Action
            },
            Command(title: "Toggle Terminal", category: .view, icon: "terminal", shortcut: KeyboardShortcut(key: "`", modifiers: [.command])) {
                // Action
            },
            Command(title: "Toggle AI Panel", category: .view, icon: "brain.head.profile") {
                // Action
            },
            
            // Go commands
            Command(title: "Go to File...", category: .go, icon: "doc.text.magnifyingglass", shortcut: KeyboardShortcut(key: "P", modifiers: [.command])) {
                // Action
            },
            Command(title: "Go to Line...", category: .go, icon: "number", shortcut: KeyboardShortcut(key: "G", modifiers: [.command])) {
                // Action
            },
            Command(title: "Go to Symbol...", category: .go, icon: "list.bullet.rectangle", shortcut: KeyboardShortcut(key: "O", modifiers: [.command, .shift])) {
                // Action
            },
            
            // Git commands
            Command(title: "Git: Stage All", category: .git, icon: "plus.circle") {
                // Action
            },
            Command(title: "Git: Commit", category: .git, icon: "checkmark.circle", shortcut: KeyboardShortcut(key: "G", modifiers: [.command, .shift])) {
                // Action
            },
            Command(title: "Git: Push", category: .git, icon: "arrow.up.circle") {
                // Action
            },
            Command(title: "Git: Pull", category: .git, icon: "arrow.down.circle") {
                // Action
            },
            
            // AI commands
            Command(title: "AI: Ask Question", category: .ai, icon: "brain.head.profile", shortcut: KeyboardShortcut(key: "L", modifiers: [.command, .shift])) {
                // Action
            },
            Command(title: "AI: Explain Code", category: .ai, icon: "questionmark.circle") {
                // Action
            },
            Command(title: "AI: Generate Code", category: .ai, icon: "sparkles") {
                // Action
            }
        ]
        
        filteredCommands = allCommands
    }
    
    func show() {
        isVisible = true
        searchText = ""
        selectedIndex = 0
    }
    
    func hide() {
        isVisible = false
        searchText = ""
    }
    
    func executeSelected() {
        guard selectedIndex < filteredCommands.count else { return }
        let command = filteredCommands[selectedIndex]
        command.action()
        hide()
    }
    
    func moveSelection(direction: Int) {
        selectedIndex = max(0, min(filteredCommands.count - 1, selectedIndex + direction))
    }
    
    private func filterCommands(_ searchText: String) {
        if searchText.isEmpty {
            filteredCommands = allCommands
        } else {
            let lowerSearch = searchText.lowercased()
            filteredCommands = allCommands.filter {
                $0.title.lowercased().contains(lowerSearch) ||
                $0.category.rawValue.lowercased().contains(lowerSearch)
            }
        }
        selectedIndex = 0
    }
}
