//
//  SearchPanelView.swift
//  TruAi
//
//  Search panel for find in files
//

import SwiftUI

struct SearchPanelView: View {
    @StateObject private var viewModel = SearchViewModel()
    @State private var searchDirectory: String = ""
    
    var body: some View {
        VStack(spacing: 0) {
            // Search input
            VStack(spacing: 8) {
                HStack {
                    Image(systemName: "magnifyingglass")
                    TextField("Search", text: $viewModel.searchOptions.query)
                        .textFieldStyle(.roundedBorder)
                        .onSubmit {
                            if !searchDirectory.isEmpty {
                                viewModel.search(in: searchDirectory)
                            }
                        }
                    
                    Button("Search") {
                        if !searchDirectory.isEmpty {
                            viewModel.search(in: searchDirectory)
                        }
                    }
                    .buttonStyle(.borderedProminent)
                    .disabled(viewModel.searchOptions.query.isEmpty)
                }
                
                // Search options
                HStack {
                    Toggle("Match Case", isOn: $viewModel.searchOptions.caseSensitive)
                    Toggle("Whole Word", isOn: $viewModel.searchOptions.wholeWord)
                    Toggle("Regex", isOn: $viewModel.searchOptions.useRegex)
                }
                .font(.caption)
            }
            .padding()
            .background(Color(.systemGray6))
            
            // Results
            if viewModel.isSearching {
                ProgressView()
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else if !viewModel.results.isEmpty {
                VStack(alignment: .leading, spacing: 0) {
                    Text("\(viewModel.resultCount) results")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .padding(.horizontal)
                        .padding(.vertical, 4)
                    
                    Divider()
                    
                    ScrollView {
                        LazyVStack(alignment: .leading, spacing: 0) {
                            ForEach(viewModel.results) { result in
                                SearchResultRow(result: result)
                                    .onTapGesture {
                                        viewModel.selectResult(result)
                                    }
                            }
                        }
                    }
                }
            } else if !viewModel.searchOptions.query.isEmpty {
                Spacer()
                Text("No results found")
                    .foregroundColor(.secondary)
                    .frame(maxWidth: .infinity)
                Spacer()
            }
        }
    }
}

struct SearchResultRow: View {
    let result: SearchResult
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(result.fileName)
                    .font(.system(size: 13, weight: .semibold))
                Text("\(result.lineNumber):\(result.column)")
                    .font(.system(size: 11))
                    .foregroundColor(.secondary)
                Spacer()
            }
            
            Text(result.context)
                .font(.system(size: 12, design: .monospaced))
                .foregroundColor(.secondary)
                .lineLimit(3)
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(result.isSelected ? Color.blue.opacity(0.2) : Color.clear)
    }
}
