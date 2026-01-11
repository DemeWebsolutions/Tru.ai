//
//  SearchService.swift
//  TruAi
//
//  Search service for find-in-files functionality
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation

class SearchService {
    static let shared = SearchService()
    
    private let fileManager = FileManager.default
    
    private init() {}
    
    func search(query: SearchQuery, in path: String) async -> [SearchResult] {
        var results: [SearchResult] = []
        
        guard let enumerator = fileManager.enumerator(atPath: path) else {
            return results
        }
        
        for case let file as String in enumerator {
            let fullPath = (path as NSString).appendingPathComponent(file)
            
            // Skip excluded paths
            if query.excludePaths.contains(where: { fullPath.contains($0) }) {
                continue
            }
            
            // Only search in files, not directories
            var isDirectory: ObjCBool = false
            fileManager.fileExists(atPath: fullPath, isDirectory: &isDirectory)
            guard !isDirectory.boolValue else { continue }
            
            // Search file content
            if let matches = searchInFile(fullPath, query: query) {
                results.append(contentsOf: matches)
            }
        }
        
        return results
    }
    
    private func searchInFile(_ path: String, query: SearchQuery) -> [SearchResult]? {
        guard let content = try? String(contentsOfFile: path, encoding: .utf8) else {
            return nil
        }
        
        var results: [SearchResult] = []
        let lines = content.components(separatedBy: .newlines)
        
        for (lineIndex, line) in lines.enumerated() {
            if matchesQuery(line: line, query: query) {
                let result = SearchResult(
                    file: path,
                    line: lineIndex + 1,
                    column: 0,
                    content: line,
                    match: query.text
                )
                results.append(result)
            }
        }
        
        return results.isEmpty ? nil : results
    }
    
    private func matchesQuery(line: String, query: SearchQuery) -> Bool {
        let searchText = query.caseSensitive ? line : line.lowercased()
        let queryText = query.caseSensitive ? query.text : query.text.lowercased()
        
        if query.useRegex {
            return searchText.range(of: queryText, options: .regularExpression) != nil
        } else if query.wholeWord {
            let pattern = "\\b\(NSRegularExpression.escapedPattern(for: queryText))\\b"
            return searchText.range(of: pattern, options: .regularExpression) != nil
        } else {
            return searchText.contains(queryText)
        }
    }
}
