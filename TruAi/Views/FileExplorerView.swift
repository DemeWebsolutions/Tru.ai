//
//  FileExplorerView.swift
//  TruAi
//
//  File explorer view with hierarchical file tree
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import SwiftUI

struct FileExplorerView: View {
    @ObservedObject var viewModel: FileExplorerViewModel
    var onFileSelect: ((FileItem) -> Void)?
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Text("EXPLORER")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(.gray)
                Spacer()
                Button(action: {}) {
                    Image(systemName: "plus")
                }
                Button(action: {}) {
                    Image(systemName: "folder.badge.plus")
                }
            }
            .padding()
            
            // Search
            TextField("Search files", text: $viewModel.searchText)
                .textFieldStyle(RoundedBorderTextFieldStyle())
                .padding(.horizontal)
            
            // File Tree
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 4) {
                    ForEach(viewModel.filteredFiles) { file in
                        FileItemRow(file: file, level: 0) {
                            viewModel.selectFile(file)
                            onFileSelect?(file)
                        } onToggle: {
                            viewModel.toggleDirectory(file)
                        }
                    }
                }
                .padding()
            }
        }
        .background(Color(UIColor.systemBackground))
    }
}

struct FileItemRow: View {
    let file: FileItem
    let level: Int
    let onSelect: () -> Void
    let onToggle: () -> Void
    
    var body: some View {
        Button(action: {
            if file.isDirectory {
                onToggle()
            } else {
                onSelect()
            }
        }) {
            HStack(spacing: 4) {
                Image(systemName: file.icon)
                    .foregroundColor(file.isDirectory ? .blue : .primary)
                Text(file.name)
                    .font(.system(size: 14))
                Spacer()
            }
            .padding(.leading, CGFloat(level * 20))
            .padding(.vertical, 4)
        }
        .buttonStyle(PlainButtonStyle())
        
        if file.isDirectory && file.isExpanded, let children = file.children {
            ForEach(children) { child in
                FileItemRow(file: child, level: level + 1, onSelect: onSelect, onToggle: onToggle)
            }
        }
    }
}
