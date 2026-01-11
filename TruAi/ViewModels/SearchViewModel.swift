//
//  SearchViewModel.swift
//  TruAi
//
//  View model for search functionality
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation
import Combine

@MainActor
class SearchViewModel: ObservableObject {
    @Published var query: SearchQuery = SearchQuery()
    @Published var results: [SearchResult] = []
    @Published var isSearching: Bool = false
    @Published var selectedResult: SearchResult?
    
    private let searchService = SearchService.shared
    private var cancellables = Set<AnyCancellable>()
    private var searchPath: String
    
    init(searchPath: String = NSHomeDirectory()) {
        self.searchPath = searchPath
    }
    
    func search() async {
        guard !query.text.isEmpty else {
            results = []
            return
        }
        
        isSearching = true
        results = await searchService.search(query: query, in: searchPath)
        isSearching = false
    }
    
    func clearResults() {
        results = []
        query.text = ""
    }
    
    func selectResult(_ result: SearchResult) {
        selectedResult = result
    }
    
    var groupedResults: [String: [SearchResult]] {
        Dictionary(grouping: results, by: { $0.file })
    }
}
