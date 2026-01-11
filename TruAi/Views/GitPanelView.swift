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
                    .foregroundColor(Color.truAiText.opacity(0.7))
                Spacer()
                Button(action: { Task { await viewModel.loadStatus() } }) {
                    Image(systemName: "arrow.clockwise")
                        .foregroundColor(Color.truAiText)
                }
            }
            .padding()
            .background(Color.truAiLightBackground)
            
            if let status = viewModel.status {
                ScrollView {
                    VStack(alignment: .leading, spacing: 16) {
                        // Commit message input
                        VStack(alignment: .leading) {
                            Text("Message")
                                .font(.caption)
                                .foregroundColor(Color.truAiText.opacity(0.7))
                            TextEditor(text: $viewModel.commitMessage)
                                .frame(height: 100)
                                .foregroundColor(Color.truAiText)
                                .border(Color.truAiText.opacity(0.3))
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
                        .foregroundColor(Color.truAiText.opacity(0.7))
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .background(Color.truAiDarkBackground)
        .foregroundColor(Color.truAiText)
        .onAppear {
            Task { await viewModel.loadStatus() }
        }
    }
}
