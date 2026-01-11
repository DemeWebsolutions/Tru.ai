//
//  SearchViewModel.swift
//  TruAi
//
//  ViewModel for search functionality
//

import Foundation
import SwiftUI
import Combine

@MainActor
class SearchViewModel: ObservableObject {
    @Published var searchOptions = SearchOptions()
    @Published var results: [SearchResult] = []
    @Published var isSearching: Bool = false
    @Published var selectedResult: SearchResult?
    @Published var resultCount: Int = 0
    
    private let searchService = SearchService.shared
    private var searchTask: Task<Void, Never>?
    
    func search(in directory: String) {
        guard !searchOptions.query.isEmpty else {
            results = []
            resultCount = 0
            return
        }
        
        // Cancel previous search
        searchTask?.cancel()
        
        isSearching = true
        results = []
        
        searchTask = Task {
            do {
                let searchResults = try await searchService.searchInFiles(options: searchOptions, in: directory)
                
                if !Task.isCancelled {
                    await MainActor.run {
                        self.results = searchResults
                        self.resultCount = searchResults.count
                        self.isSearching = false
                    }
                }
            } catch {
                if !Task.isCancelled {
                    await MainActor.run {
                        self.isSearching = false
                    }
                }
            }
        }
    }
    
    func selectResult(_ result: SearchResult) {
        selectedResult = result
    }
    
    func clearResults() {
        results = []
        resultCount = 0
        searchOptions.query = ""
    }
}
