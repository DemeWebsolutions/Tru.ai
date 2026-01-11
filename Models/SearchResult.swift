//
//  SearchResult.swift
//  TruAi
//
//  Search result model for find in files
//

import Foundation

struct SearchResult: Identifiable, Hashable {
    let id: String
    let filePath: String
    let fileName: String
    let lineNumber: Int
    let column: Int
    let matchedText: String
    let context: String
    let isSelected: Bool
    
    init(id: String = UUID().uuidString,
         filePath: String,
         fileName: String,
         lineNumber: Int,
         column: Int,
         matchedText: String,
         context: String,
         isSelected: Bool = false) {
        self.id = id
        self.filePath = filePath
        self.fileName = fileName
        self.lineNumber = lineNumber
        self.column = column
        self.matchedText = matchedText
        self.context = context
        self.isSelected = isSelected
    }
}

struct SearchOptions {
    var query: String = ""
    var caseSensitive: Bool = false
    var wholeWord: Bool = false
    var useRegex: Bool = false
    var includePatterns: String = ""
    var excludePatterns: String = ""
    var searchInSubdirectories: Bool = true
}
