//
//  SearchService.swift
//  TruAi
//
//  Search service for find in files
//

import Foundation

class SearchService {
    static let shared = SearchService()
    
    private let fileSystemService = FileSystemService.shared
    
    private init() {}
    
    // MARK: - Search in Files
    
    func searchInFiles(options: SearchOptions, in directory: String) async throws -> [SearchResult] {
        var results: [SearchResult] = []
        
        let files = try await getAllFiles(in: directory, includePatterns: options.includePatterns, excludePatterns: options.excludePatterns)
        
        for filePath in files {
            let fileResults = try await searchInFile(filePath: filePath, options: options)
            results.append(contentsOf: fileResults)
        }
        
        return results
    }
    
    private func searchInFile(filePath: String, options: SearchOptions) async throws -> [SearchResult] {
        let content = try fileSystemService.readFile(at: filePath)
        let lines = content.components(separatedBy: .newlines)
        var results: [SearchResult] = []
        
        let searchQuery = options.caseSensitive ? options.query : options.query.lowercased()
        
        for (index, line) in lines.enumerated() {
            let searchLine = options.caseSensitive ? line : line.lowercased()
            
            if let range = searchLine.range(of: searchQuery) {
                let lineNumber = index + 1
                let column = searchLine.distance(from: searchLine.startIndex, to: range.lowerBound) + 1
                let matchedText = String(line[range])
                
                // Get context (previous and next lines)
                let contextStart = max(0, index - 1)
                let contextEnd = min(lines.count - 1, index + 1)
                let context = lines[contextStart...contextEnd].joined(separator: "\n")
                
                let result = SearchResult(
                    filePath: filePath,
                    fileName: URL(fileURLWithPath: filePath).lastPathComponent,
                    lineNumber: lineNumber,
                    column: column,
                    matchedText: matchedText,
                    context: context
                )
                results.append(result)
            }
        }
        
        return results
    }
    
    private func getAllFiles(in directory: String, includePatterns: String, excludePatterns: String) async throws -> [String] {
        var files: [String] = []
        let fileManager = FileManager.default
        
        guard let enumerator = fileManager.enumerator(at: URL(fileURLWithPath: directory), includingPropertiesForKeys: [.isRegularFileKey]) else {
            return files
        }
        
        for case let fileURL as URL in enumerator {
            if fileURL.hasDirectoryPath {
                continue
            }
            
            let filePath = fileURL.path
            let fileName = fileURL.lastPathComponent
            
            // Apply include/exclude patterns
            if shouldIncludeFile(fileName: fileName, includePatterns: includePatterns, excludePatterns: excludePatterns) {
                files.append(filePath)
            }
        }
        
        return files
    }
    
    private func shouldIncludeFile(fileName: String, includePatterns: String, excludePatterns: String) -> Bool {
        // Simple pattern matching - can be enhanced with regex
        if !excludePatterns.isEmpty {
            let excludeList = excludePatterns.components(separatedBy: ",")
            for pattern in excludeList {
                if fileName.contains(pattern.trimmingCharacters(in: .whitespaces)) {
                    return false
                }
            }
        }
        
        if !includePatterns.isEmpty {
            let includeList = includePatterns.components(separatedBy: ",")
            for pattern in includeList {
                if fileName.contains(pattern.trimmingCharacters(in: .whitespaces)) {
                    return true
                }
            }
            return false
        }
        
        return true
    }
}
