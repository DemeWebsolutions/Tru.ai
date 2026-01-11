//
//  IDELayoutView.swift
//  TruAi
//
//  Main IDE layout - Cursor-like structure with activity bar, panels, and status bar
//

import SwiftUI

struct IDELayoutView: View {
    @StateObject private var fileExplorerVM = FileExplorerViewModel()
    @StateObject private var codeEditorVM = CodeEditorViewModel()
    @StateObject private var aiService = TruAiService.shared
    @StateObject private var commandPaletteVM = CommandPaletteViewModel()
    @State private var selectedFile: FileItem?
    @State private var activePanel: ActivityPanel = .explorer
    @State private var showFileExplorer: Bool = true
    @State private var showTerminal: Bool = false
    @State private var sidebarWidth: CGFloat = 250
    @State private var projectPath: String = ""
    
    var body: some View {
        GeometryReader { geometry in
            VStack(spacing: 0) {
                // Main content area
                HStack(spacing: 0) {
                    // Activity Bar (leftmost)
                    ActivityBarView(selectedPanel: $activePanel) { panel in
                        handlePanelSelection(panel)
                    }
                    
                    // Sidebar (File Explorer, Search, Git, etc.)
                    if showFileExplorer {
                        Group {
                            switch activePanel {
                            case .explorer:
                                FileExplorerView(selectedFile: $selectedFile)
                                    .onChange(of: selectedFile) { newFile in
                                        if let file = newFile, !file.isDirectory {
                                            codeEditorVM.openFile(file)
                                        }
                                    }
                            case .search:
                                SearchPanelView()
                            case .git:
                                GitPanelView()
                            case .debug:
                                Text("Run and Debug")
                                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                            case .extensions:
                                Text("Extensions")
                                    .frame(maxWidth: .infinity, maxHeight: .infinity)
                            case .ai:
                                AIPanelView()
                                    .environmentObject(aiService)
                            }
                        }
                        .frame(width: sidebarWidth)
                        
                        // Resize handle
                        Divider()
                            .frame(width: 1)
                            .background(Color(.separator))
                            .gesture(
                                DragGesture()
                                    .onChanged { value in
                                        let newWidth = sidebarWidth + value.translation.width
                                        sidebarWidth = max(150, min(400, newWidth))
                                    }
                            )
                    }
                    
                    // Main editor area
                    VStack(spacing: 0) {
                        CodeEditorView()
                            .environmentObject(codeEditorVM)
                        
                        // Bottom panel (Terminal)
                        if showTerminal {
                            Divider()
                            TerminalView()
                                .frame(height: 200)
                        }
                    }
                }
                
                // Status Bar (bottom)
                StatusBarView(codeEditorVM: codeEditorVM)
            }
        }
        .overlay {
            // Command Palette overlay
            CommandPaletteView(viewModel: commandPaletteVM)
        }
        .onAppear {
            setupKeyboardShortcuts()
        }
    }
    
    private func handlePanelSelection(_ panel: ActivityPanel) {
        activePanel = panel
        showFileExplorer = true
        
        // Special handling for AI panel
        if panel == .ai {
            // AI panel can be shown in sidebar or as overlay
        }
    }
    
    private func setupKeyboardShortcuts() {
        // Command palette: Cmd+Shift+P
        // File operations: Cmd+N, Cmd+O, Cmd+S
        // Terminal toggle: Cmd+`
        // etc.
    }
}

struct AIPanelView: View {
    @EnvironmentObject var aiService: TruAiService
    @State private var inputText: String = ""
    @StateObject private var chatVM: ChatViewModel
    
    init() {
        _chatVM = StateObject(wrappedValue: ChatViewModel(aiService: TruAiService.shared))
    }
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Text("Tru.ai Assistant")
                    .font(.headline)
                Spacer()
            }
            .padding()
            .background(Color(.systemGray6))
            
            // Chat messages
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 12) {
                    ForEach(chatVM.messages) { message in
                        MessageBubbleView(message: message)
                    }
                }
                .padding()
            }
            
            // Input area
            HStack {
                TextField("Ask Tru.ai...", text: $inputText, axis: .vertical)
                    .textFieldStyle(.roundedBorder)
                    .lineLimit(1...4)
                    .onSubmit {
                        if !inputText.trimmingCharacters(in: .whitespaces).isEmpty {
                            chatVM.sendMessage()
                            inputText = ""
                        }
                    }
                
                Button(action: {
                    if !inputText.trimmingCharacters(in: .whitespaces).isEmpty {
                        chatVM.sendMessage()
                        inputText = ""
                    }
                }) {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.system(size: 24))
                }
                .disabled(inputText.trimmingCharacters(in: .whitespaces).isEmpty)
            }
            .padding()
            .background(Color(.systemBackground))
        }
        .background(Color(.systemBackground))
        .onAppear {
            if aiService.currentConversation == nil {
                aiService.createNewConversation()
            }
        }
    }
}
