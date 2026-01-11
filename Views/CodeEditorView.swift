//
//  CodeEditorView.swift
//  TruAi
//
//  Code editor view with syntax highlighting
//

import SwiftUI

struct CodeEditorView: View {
    @StateObject private var viewModel = CodeEditorViewModel()
    @State private var editorText: String = ""
    
    var body: some View {
        VStack(spacing: 0) {
            // Tab bar
            if !viewModel.tabs.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 0) {
                        ForEach(viewModel.tabs) { tab in
                            EditorTabView(
                                tab: tab,
                                isActive: tab.id == viewModel.activeTabId,
                                onSelect: { viewModel.selectTab(tab) },
                                onClose: { viewModel.closeTab(tab) }
                            )
                        }
                    }
                }
                .background(Color(.systemGray6))
                .frame(height: 40)
            }
            
            // Editor area
            if viewModel.activeTab != nil {
                HStack(spacing: 0) {
                    // Line numbers
                    ScrollView {
                        VStack(alignment: .trailing, spacing: 0) {
                            ForEach(viewModel.lineNumbers, id: \.self) { lineNumber in
                                Text("\(lineNumber)")
                                    .font(.system(size: 12, design: .monospaced))
                                    .foregroundColor(.secondary)
                                    .frame(height: 20)
                                    .padding(.horizontal, 8)
                            }
                        }
                        .padding(.vertical, 4)
                    }
                    .frame(width: 50)
                    .background(Color(.systemGray6))
                    
                    // Code editor
                    ZStack(alignment: .topLeading) {
                        TextEditor(text: $editorText)
                            .font(.system(size: 14, design: .monospaced))
                            .scrollContentBackground(.hidden)
                            .background(Color(.systemBackground))
                            .onChange(of: editorText) { newValue in
                                viewModel.updateContent(newValue)
                            }
                        
                        // Placeholder
                        if editorText.isEmpty {
                            Text("Start typing...")
                                .foregroundColor(.secondary)
                                .padding(.leading, 4)
                                .padding(.top, 8)
                                .allowsHitTesting(false)
                        }
                    }
                }
            } else {
                // Empty state
                VStack {
                    Image(systemName: "doc.text")
                        .font(.system(size: 48))
                        .foregroundColor(.secondary)
                    Text("No file open")
                        .font(.headline)
                        .foregroundColor(.secondary)
                    Text("Select a file from the explorer to start editing")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .onAppear {
            editorText = viewModel.content
        }
        .onChange(of: viewModel.content) { newValue in
            if editorText != newValue {
                editorText = newValue
            }
        }
    }
}

struct EditorTabView: View {
    let tab: EditorTab
    let isActive: Bool
    let onSelect: () -> Void
    let onClose: () -> Void
    
    var body: some View {
        HStack(spacing: 6) {
            Image(systemName: tab.fileItem.icon)
                .font(.system(size: 12))
            
            Text(tab.displayName)
                .font(.system(size: 13))
                .lineLimit(1)
            
            Button(action: onClose) {
                Image(systemName: "xmark")
                    .font(.system(size: 10))
                    .foregroundColor(.secondary)
            }
            .buttonStyle(.plain)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(isActive ? Color(.systemBackground) : Color.clear)
        .contentShape(Rectangle())
        .onTapGesture {
            onSelect()
        }
    }
}
