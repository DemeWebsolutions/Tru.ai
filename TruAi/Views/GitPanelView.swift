//
//  GitPanelView.swift
//  TruAi
//
//  Git panel for version control operations
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import SwiftUI

struct GitPanelView: View {
    @ObservedObject var viewModel: GitViewModel
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Text("SOURCE CONTROL")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(.gray)
                Spacer()
                Button(action: { Task { await viewModel.loadStatus() } }) {
                    Image(systemName: "arrow.clockwise")
                }
            }
            .padding()
            
            if let status = viewModel.status {
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        // Commit message input
                        VStack(alignment: .leading) {
                            Text("Message")
                                .font(.caption)
                                .foregroundColor(.gray)
                            TextEditor(text: $viewModel.commitMessage)
                                .frame(height: 100)
                                .border(Color.gray.opacity(0.3))
                        }
                        
                        // Commit button
                        HStack {
                            Button("Commit") {
                                Task { await viewModel.commit() }
                            }
                            .disabled(viewModel.commitMessage.isEmpty)
                            
                            Button("Push") {
                                Task { await viewModel.push() }
                            }
                            
                            Button("Pull") {
                                Task { await viewModel.pull() }
                            }
                        }
                        
                        // Changed files
                        if !status.modifiedFiles.isEmpty {
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Changes")
                                    .font(.caption)
                                    .fontWeight(.bold)
                                ForEach(status.modifiedFiles, id: \.self) { file in
                                    HStack {
                                        Image(systemName: "M")
                                            .foregroundColor(.orange)
                                        Text(file)
                                            .font(.system(size: 12))
                                    }
                                }
                            }
                        }
                        
                        // Staged files
                        if !status.stagedFiles.isEmpty {
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Staged Changes")
                                    .font(.caption)
                                    .fontWeight(.bold)
                                ForEach(status.stagedFiles, id: \.self) { file in
                                    HStack {
                                        Image(systemName: "checkmark")
                                            .foregroundColor(.green)
                                        Text(file)
                                            .font(.system(size: 12))
                                    }
                                }
                            }
                        }
                    }
                    .padding()
                }
            } else {
                VStack {
                    Text("No Git repository")
                        .foregroundColor(.gray)
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .background(Color(UIColor.systemBackground))
        .onAppear {
            Task { await viewModel.loadStatus() }
        }
    }
}
