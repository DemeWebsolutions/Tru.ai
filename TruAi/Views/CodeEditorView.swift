//
//  CodeEditorView.swift
//  TruAi
//
//  Code editor view with multi-tab support
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import SwiftUI

struct CodeEditorView: View {
    @ObservedObject var viewModel: CodeEditorViewModel
    
    var body: some View {
        GeometryReader { geometry in
            if let tab = viewModel.currentTab {
                HStack(spacing: 0) {
                    // Line numbers
                    if viewModel.showLineNumbers {
                        LineNumbersView(content: tab.content)
                            .frame(width: 50)
                    }
                    
                    // Editor
                    TextEditor(text: Binding(
                        get: { tab.content },
                        set: { viewModel.updateContent($0) }
                    ))
                    .font(.system(size: viewModel.fontSize, design: .monospaced))
                    .padding(8)
                }
            } else {
                // Welcome screen
                VStack {
                    Spacer()
                    Text("Tru.ai")
                        .font(.system(size: 48, weight: .bold))
                    Text("iOS IDE Framework")
                        .font(.headline)
                        .foregroundColor(.gray)
                    Spacer()
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
    }
}

struct LineNumbersView: View {
    let content: String
    
    var body: some View {
        let lines = content.components(separatedBy: .newlines)
        
        ScrollView {
            VStack(alignment: .trailing, spacing: 0) {
                ForEach(1...max(1, lines.count), id: \.self) { lineNumber in
                    Text("\(lineNumber)")
                        .font(.system(size: 12, design: .monospaced))
                        .foregroundColor(.gray)
                        .padding(.vertical, 2)
                }
            }
            .padding(8)
        }
        .background(Color(UIColor.secondarySystemBackground))
    }
}

struct TabBarView: View {
    let tabs: [EditorTab]
    @Binding var selectedIndex: Int
    let onClose: (Int) -> Void
    
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 0) {
                ForEach(tabs.indices, id: \.self) { index in
                    TabView(
                        tab: tabs[index],
                        isSelected: index == selectedIndex,
                        onSelect: { selectedIndex = index },
                        onClose: { onClose(index) }
                    )
                }
            }
        }
        .frame(height: 40)
        .background(Color(UIColor.secondarySystemBackground))
    }
}

struct TabView: View {
    let tab: EditorTab
    let isSelected: Bool
    let onSelect: () -> Void
    let onClose: () -> Void
    
    var body: some View {
        Button(action: onSelect) {
            HStack(spacing: 4) {
                Image(systemName: tab.file.icon)
                    .font(.system(size: 12))
                Text(tab.file.name)
                    .font(.system(size: 14))
                if tab.isModified {
                    Circle()
                        .fill(Color.blue)
                        .frame(width: 6, height: 6)
                }
                Button(action: onClose) {
                    Image(systemName: "xmark")
                        .font(.system(size: 10))
                }
                .buttonStyle(PlainButtonStyle())
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 8)
            .background(isSelected ? Color(UIColor.systemBackground) : Color.clear)
        }
        .buttonStyle(PlainButtonStyle())
    }
}
