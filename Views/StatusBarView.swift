//
//  StatusBarView.swift
//  TruAi
//
//  Status bar at the bottom of IDE
//

import SwiftUI

struct StatusBarView: View {
    @ObservedObject var codeEditorVM: CodeEditorViewModel
    @StateObject private var gitVM = GitViewModel()
    
    var body: some View {
        HStack {
            // File info
            if let activeTab = codeEditorVM.activeTab {
                HStack(spacing: 8) {
                    Image(systemName: activeTab.fileItem.icon)
                    Text(activeTab.fileItem.name)
                    if activeTab.isModified {
                        Text("•")
                            .foregroundColor(.orange)
                    }
                }
                .font(.system(size: 12))
            }
            
            Spacer()
            
            // Git branch
            if let branch = gitVM.currentBranch {
                HStack(spacing: 4) {
                    Image(systemName: "git.branch")
                    Text(branch)
                }
                .font(.system(size: 12))
                .foregroundColor(.secondary)
            }
            
            // Cursor position
            HStack(spacing: 4) {
                Text("Ln \(codeEditorVM.cursorPosition.line), Col \(codeEditorVM.cursorPosition.column)")
            }
            .font(.system(size: 12))
            .foregroundColor(.secondary)
            
            // Encoding
            Text("UTF-8")
                .font(.system(size: 12))
                .foregroundColor(.secondary)
            
            // Line ending
            Text("LF")
                .font(.system(size: 12))
                .foregroundColor(.secondary)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 4)
        .background(Color(.systemGray6))
        .frame(height: 24)
    }
}
