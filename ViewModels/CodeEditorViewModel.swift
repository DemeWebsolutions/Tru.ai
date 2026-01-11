//
//  CodeEditorViewModel.swift
//  TruAi
//
//  ViewModel for code editor
//

import Foundation
import SwiftUI
import Combine

@MainActor
class CodeEditorViewModel: ObservableObject {
    @Published var tabs: [EditorTab] = []
    @Published var activeTabId: String?
    @Published var content: String = ""
    @Published var cursorPosition: TextPosition = TextPosition(line: 1, column: 1)
    @Published var isModified: Bool = false
    @Published var lineNumbers: [Int] = []
    
    private let fileSystemService = FileSystemService.shared
    private var cancellables = Set<AnyCancellable>()
    
    var activeTab: EditorTab? {
        tabs.first { $0.id == activeTabId }
    }
    
    func openFile(_ fileItem: FileItem) {
        // Check if file is already open
        if let existingTab = tabs.first(where: { $0.fileItem.path == fileItem.path }) {
            activeTabId = existingTab.id
            updateActiveTabContent()
            return
        }
        
        // Load file content
        Task {
            do {
                let fileContent = try fileSystemService.readFile(at: fileItem.path)
                let newTab = EditorTab(
                    fileItem: fileItem,
                    content: fileContent,
                    isActive: true
                )
                
                await MainActor.run {
                    // Deactivate all tabs
                    tabs = tabs.map { var tab = $0; tab.isActive = false; return tab }
                    
                    // Add new tab
                    tabs.append(newTab)
                    activeTabId = newTab.id
                    content = fileContent
                    updateLineNumbers()
                }
            } catch {
                print("Error opening file: \(error)")
            }
        }
    }
    
    func closeTab(_ tab: EditorTab) {
        if tab.isModified {
            // TODO: Show save dialog
        }
        
        tabs.removeAll { $0.id == tab.id }
        
        if activeTabId == tab.id {
            activeTabId = tabs.last?.id
            updateActiveTabContent()
        }
    }
    
    func selectTab(_ tab: EditorTab) {
        tabs = tabs.map { var t = $0; t.isActive = (t.id == tab.id); return t }
        activeTabId = tab.id
        updateActiveTabContent()
    }
    
    func updateContent(_ newContent: String) {
        content = newContent
        updateLineNumbers()
        
        if var tab = activeTab {
            tab.content = newContent
            tab.isModified = true
            if let index = tabs.firstIndex(where: { $0.id == tab.id }) {
                tabs[index] = tab
            }
            isModified = true
        }
    }
    
    func saveCurrentFile() {
        guard let tab = activeTab else { return }
        
        Task {
            do {
                try fileSystemService.writeFile(at: tab.fileItem.path, content: content)
                await MainActor.run {
                    if let index = tabs.firstIndex(where: { $0.id == tab.id }) {
                        tabs[index].isModified = false
                        isModified = false
                    }
                }
            } catch {
                print("Error saving file: \(error)")
            }
        }
    }
    
    func saveAllFiles() {
        for tab in tabs where tab.isModified {
            Task {
                do {
                    try fileSystemService.writeFile(at: tab.fileItem.path, content: tab.content)
                    await MainActor.run {
                        if let index = tabs.firstIndex(where: { $0.id == tab.id }) {
                            tabs[index].isModified = false
                        }
                    }
                } catch {
                    print("Error saving file: \(error)")
                }
            }
        }
    }
    
    private func updateActiveTabContent() {
        if let tab = activeTab {
            content = tab.content
            cursorPosition = tab.cursorPosition
            isModified = tab.isModified
            updateLineNumbers()
        } else {
            content = ""
            cursorPosition = TextPosition(line: 1, column: 1)
            isModified = false
            lineNumbers = []
        }
    }
    
    private func updateLineNumbers() {
        let lineCount = content.components(separatedBy: .newlines).count
        lineNumbers = Array(1...max(1, lineCount))
    }
}
