//
//  GitPanelView.swift
//  TruAi
//
//  Git/Source Control panel view
//

import SwiftUI

struct GitPanelView: View {
    @StateObject private var viewModel = GitViewModel()
    @State private var commitMessage: String = ""
    @State private var showCommitDialog: Bool = false
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Text("Source Control")
                    .font(.headline)
                Spacer()
                if let branch = viewModel.currentBranch {
                    HStack {
                        Image(systemName: "git.branch")
                        Text(branch)
                    }
                    .font(.caption)
                    .foregroundColor(.secondary)
                }
            }
            .padding()
            .background(Color(.systemGray6))
            
            if let status = viewModel.status {
                // Changes section
                if !status.modifiedFiles.isEmpty || !status.untrackedFiles.isEmpty {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Changes")
                            .font(.subheadline)
                            .fontWeight(.semibold)
                            .padding(.horizontal)
                            .padding(.top)
                        
                        // Modified files
                        ForEach(status.modifiedFiles, id: \.self) { file in
                            GitFileRow(fileName: file, status: .modified)
                        }
                        
                        // Untracked files
                        ForEach(status.untrackedFiles, id: \.self) { file in
                            GitFileRow(fileName: file, status: .untracked)
                        }
                    }
                }
                
                // Commit section
                VStack(spacing: 8) {
                    TextField("Message (Ctrl+Enter to commit)", text: $commitMessage)
                        .textFieldStyle(.roundedBorder)
                        .padding(.horizontal)
                    
                    HStack {
                        Button("Commit") {
                            if !commitMessage.isEmpty {
                                viewModel.commit(message: commitMessage)
                                commitMessage = ""
                            }
                        }
                        .buttonStyle(.borderedProminent)
                        .disabled(commitMessage.isEmpty)
                        
                        Button("Push") {
                            viewModel.push()
                        }
                        .buttonStyle(.bordered)
                        
                        Button("Pull") {
                            viewModel.pull()
                        }
                        .buttonStyle(.bordered)
                    }
                    .padding(.horizontal)
                }
                .padding(.vertical)
            } else {
                Spacer()
                Text("No Git repository found")
                    .foregroundColor(.secondary)
                Spacer()
            }
        }
    }
}

enum GitFileStatus {
    case modified
    case staged
    case untracked
}

struct GitFileRow: View {
    let fileName: String
    let status: GitFileStatus
    
    var statusIcon: String {
        switch status {
        case .modified: return "pencil"
        case .staged: return "checkmark.circle.fill"
        case .untracked: return "plus.circle"
        }
    }
    
    var statusColor: Color {
        switch status {
        case .modified: return .orange
        case .staged: return .green
        case .untracked: return .blue
        }
    }
    
    var body: some View {
        HStack {
            Image(systemName: statusIcon)
                .foregroundColor(statusColor)
                .frame(width: 20)
            Text(fileName)
                .font(.system(size: 13))
            Spacer()
        }
        .padding(.horizontal)
        .padding(.vertical, 4)
    }
}
