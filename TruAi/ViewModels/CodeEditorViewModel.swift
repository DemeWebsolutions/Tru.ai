//
//  CodeEditorViewModel.swift
//  TruAi
//
//  View model for code editor
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation
import Combine

@MainActor
class CodeEditorViewModel: ObservableObject {
    @Published var tabs: [EditorTab] = []
    @Published var selectedTabIndex: Int = 0
    @Published var showLineNumbers: Bool = true
    @Published var fontSize: CGFloat = 14
    
    private let fileSystemService = FileSystemService.shared
    private var cancellables = Set<AnyCancellable>()
    
    var currentTab: EditorTab? {
        guard selectedTabIndex < tabs.count else { return nil }
        return tabs[selectedTabIndex]
    }
    
    func openFile(_ file: FileItem) {
        // Check if file is already open
        if let index = tabs.firstIndex(where: { $0.file.path == file.path }) {
            selectedTabIndex = index
            return
        }
        
        // Load file content
        let content = fileSystemService.readFile(at: file.path) ?? ""
        let tab = EditorTab(file: file, content: content)
        tabs.append(tab)
        selectedTabIndex = tabs.count - 1
    }
    
    func closeTab(at index: Int) {
        guard index < tabs.count else { return }
        
        if tabs[index].isModified {
            // TODO: Show save dialog
        }
        
        tabs.remove(at: index)
        
        if selectedTabIndex >= tabs.count {
            selectedTabIndex = max(0, tabs.count - 1)
        }
    }
    
    func saveCurrentTab() throws {
        guard let tab = currentTab else { return }
        try fileSystemService.writeFile(at: tab.file.path, content: tab.content)
        
        // Mark as not modified
        if let index = tabs.firstIndex(where: { $0.id == tab.id }) {
            tabs[index].isModified = false
        }
    }
    
    func updateContent(_ content: String) {
        guard selectedTabIndex < tabs.count else { return }
        tabs[selectedTabIndex].content = content
        tabs[selectedTabIndex].isModified = true
    }
    
    func updateCursorPosition(line: Int, column: Int) {
        guard selectedTabIndex < tabs.count else { return }
        tabs[selectedTabIndex].cursorPosition = CursorPosition(line: line, column: column)
    }
    
    func saveAllTabs() throws {
        for (index, tab) in tabs.enumerated() where tab.isModified {
            try fileSystemService.writeFile(at: tab.file.path, content: tab.content)
            tabs[index].isModified = false
        }
    }
}
