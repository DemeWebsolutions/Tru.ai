//
//  IDELayoutView.swift
//  TruAi
//
//  Main IDE layout with activity bar, sidebar, editor, and panels
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import SwiftUI

struct IDELayoutView: View {
    @EnvironmentObject var appState: AppState
    @StateObject private var fileExplorerVM = FileExplorerViewModel()
    @StateObject private var codeEditorVM = CodeEditorViewModel()
    @StateObject private var chatVM = ChatViewModel()
    @StateObject private var commandPaletteVM = CommandPaletteViewModel()
    @StateObject private var gitVM = GitViewModel()
    @StateObject private var searchVM = SearchViewModel()
    
    @State private var showSidebar = true
    @State private var showTerminal = false
    @State private var sidebarWidth: CGFloat = 250
    
    var body: some View {
        GeometryReader { geometry in
            HStack(spacing: 0) {
                // Activity Bar
                ActivityBarView(selectedPanel: $appState.activePanel)
                    .frame(width: 48)
                
                // Sidebar Panel
                if showSidebar {
                    sidebarContent
                        .frame(width: sidebarWidth)
                }
                
                // Main Editor Area
                VStack(spacing: 0) {
                    // Tab Bar
                    if !codeEditorVM.tabs.isEmpty {
                        TabBarView(
                            tabs: codeEditorVM.tabs,
                            selectedIndex: $codeEditorVM.selectedTabIndex,
                            onClose: { index in
                                codeEditorVM.closeTab(at: index)
                            }
                        )
                    }
                    
                    // Editor
                    CodeEditorView(viewModel: codeEditorVM)
                    
                    // Terminal (optional)
                    if showTerminal {
                        Divider()
                        TerminalView()
                            .frame(height: 200)
                    }
                    
                    // Status Bar
                    StatusBarView(
                        currentFile: codeEditorVM.currentTab?.file.name,
                        cursorPosition: codeEditorVM.currentTab?.cursorPosition,
                        gitBranch: gitVM.status?.currentBranch
                    )
                }
            }
            .overlay(
                // Command Palette
                commandPaletteOverlay
            )
        }
        .onAppear {
            setupKeyboardShortcuts()
        }
    }
    
    @ViewBuilder
    private var sidebarContent: some View {
        switch appState.activePanel {
        case .explorer:
            FileExplorerView(viewModel: fileExplorerVM)
                .onFileSelect { file in
                    if !file.isDirectory {
                        codeEditorVM.openFile(file)
                    }
                }
        case .search:
            SearchPanelView(viewModel: searchVM)
        case .git:
            GitPanelView(viewModel: gitVM)
        case .ai:
            AIPanelView(viewModel: chatVM)
        default:
            Text("Panel: \(String(describing: appState.activePanel))")
                .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }
    
    @ViewBuilder
    private var commandPaletteOverlay: some View {
        if commandPaletteVM.isVisible {
            CommandPaletteView(viewModel: commandPaletteVM)
        }
    }
    
    private func setupKeyboardShortcuts() {
        // Keyboard shortcuts would be handled here
        // In a real implementation, this would use UIKeyCommand or similar
    }
}
