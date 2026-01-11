//
//  SearchResult.swift
//  TruAi
//
//  Search result model for find-in-files
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation

struct SearchResult: Identifiable {
    let id: UUID
    var file: String
    var line: Int
    var column: Int
    var content: String
    var match: String
    
    init(id: UUID = UUID(), file: String, line: Int, column: Int, content: String, match: String) {
        self.id = id
        self.file = file
        self.line = line
        self.column = column
        self.content = content
        self.match = match
    }
}

struct SearchQuery {
    var text: String
    var caseSensitive: Bool
    var wholeWord: Bool
    var useRegex: Bool
    var includePaths: [String]
    var excludePaths: [String]
    
    init(text: String = "", caseSensitive: Bool = false, wholeWord: Bool = false, useRegex: Bool = false) {
        self.text = text
        self.caseSensitive = caseSensitive
        self.wholeWord = wholeWord
        self.useRegex = useRegex
        self.includePaths = []
        self.excludePaths = ["node_modules", ".git", "build"]
    }
}
