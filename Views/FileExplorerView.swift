//
//  FileExplorerView.swift
//  TruAi
//
//  File explorer sidebar view
//

import SwiftUI

struct FileExplorerView: View {
    @StateObject private var viewModel = FileExplorerViewModel()
    @Binding var selectedFile: FileItem?
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Text("Explorer")
                    .font(.headline)
                    .padding(.horizontal)
                Spacer()
                Button(action: {
                    viewModel.refresh()
                }) {
                    Image(systemName: "arrow.clockwise")
                        .font(.system(size: 14))
                }
                .padding(.horizontal)
            }
            .padding(.vertical, 8)
            .background(Color(.systemGray6))
            
            // Search
            TextField("Search files...", text: $viewModel.searchText)
                .textFieldStyle(.roundedBorder)
                .padding(.horizontal)
                .padding(.vertical, 4)
            
            // File list
            if viewModel.isLoading {
                ProgressView()
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 0) {
                        ForEach(viewModel.filteredItems) { item in
                            FileItemRow(
                                item: item,
                                selectedItem: $viewModel.selectedItem,
                                onSelect: { selectedFile = $0 }
                            )
                        }
                    }
                }
            }
        }
        .background(Color(.systemBackground))
        .onChange(of: viewModel.selectedItem) { newValue in
            selectedFile = newValue
        }
    }
}

struct FileItemRow: View {
    let item: FileItem
    @Binding var selectedItem: FileItem?
    let onSelect: (FileItem) -> Void
    @State private var isExpanded: Bool = false
    
    var body: some View {
        HStack(spacing: 4) {
            // Expand/collapse button for directories
            if item.isDirectory {
                Button(action: {
                    isExpanded.toggle()
                }) {
                    Image(systemName: isExpanded ? "chevron.down" : "chevron.right")
                        .font(.system(size: 10))
                        .foregroundColor(.secondary)
                        .frame(width: 16)
                }
            } else {
                Spacer()
                    .frame(width: 16)
            }
            
            // File icon
            Image(systemName: item.icon)
                .font(.system(size: 14))
                .foregroundColor(colorForFileType(item.type))
                .frame(width: 20)
            
            // File name
            Text(item.name)
                .font(.system(size: 14))
                .lineLimit(1)
            
            Spacer()
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 4)
        .contentShape(Rectangle())
        .onTapGesture {
            selectedItem = item
            onSelect(item)
        }
        .background(selectedItem?.id == item.id ? Color.blue.opacity(0.2) : Color.clear)
        
        // Children (if expanded)
        if isExpanded, let children = item.children {
            ForEach(children) { child in
                FileItemRow(
                    item: child,
                    selectedItem: $selectedItem,
                    onSelect: onSelect
                )
                .padding(.leading, 20)
            }
        }
    }
    
    private func colorForFileType(_ type: FileType) -> Color {
        switch type {
        case .directory:
            return .blue
        case .swift:
            return .orange
        case .javascript, .typescript:
            return .yellow
        case .python:
            return .green
        case .html:
            return .red
        case .css:
            return .blue
        case .json:
            return .purple
        case .markdown:
            return .gray
        default:
            return .secondary
        }
    }
}
