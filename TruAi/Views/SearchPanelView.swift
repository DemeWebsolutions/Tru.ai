//
//  SearchPanelView.swift
//  TruAi
//
//  Search panel for find-in-files
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import SwiftUI

struct SearchPanelView: View {
    @ObservedObject var viewModel: SearchViewModel
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Text("SEARCH")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(.gray)
                Spacer()
            }
            .padding()
            
            // Search input
            VStack(alignment: .leading, spacing: 8) {
                TextField("Search", text: $viewModel.query.text)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                // Options
                HStack {
                    Toggle("Case Sensitive", isOn: $viewModel.query.caseSensitive)
                        .font(.caption)
                    Toggle("Whole Word", isOn: $viewModel.query.wholeWord)
                        .font(.caption)
                    Toggle("Regex", isOn: $viewModel.query.useRegex)
                        .font(.caption)
                }
                
                Button("Search") {
                    Task { await viewModel.search() }
                }
                .disabled(viewModel.query.text.isEmpty)
            }
            .padding()
            
            // Results
            if viewModel.isSearching {
                ProgressView()
                    .padding()
            } else if !viewModel.results.isEmpty {
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 8) {
                        ForEach(Array(viewModel.groupedResults.keys), id: \.self) { file in
                            VStack(alignment: .leading, spacing: 4) {
                                Text(file)
                                    .font(.caption)
                                    .fontWeight(.bold)
                                
                                ForEach(viewModel.groupedResults[file]!) { result in
                                    SearchResultRow(result: result) {
                                        viewModel.selectResult(result)
                                    }
                                }
                            }
                        }
                    }
                    .padding()
                }
            } else {
                Text("No results")
                    .foregroundColor(.gray)
                    .frame(maxWidth: .infinity, maxHeight: .infinity)
            }
        }
        .background(Color(UIColor.systemBackground))
    }
}

struct SearchResultRow: View {
    let result: SearchResult
    let onSelect: () -> Void
    
    var body: some View {
        Button(action: onSelect) {
            HStack {
                Text("\(result.line):")
                    .font(.system(size: 12, design: .monospaced))
                    .foregroundColor(.gray)
                Text(result.content)
                    .font(.system(size: 12))
                    .lineLimit(1)
            }
        }
        .buttonStyle(PlainButtonStyle())
    }
}
