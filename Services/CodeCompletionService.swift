//
//  CodeCompletionService.swift
//  TruAi
//
//  Code completion and IntelliSense service
//

import Foundation

struct CodeCompletion: Identifiable, Hashable {
    let id: String
    let label: String
    let kind: CompletionKind
    let detail: String?
    let documentation: String?
    let insertText: String
    let sortText: String?
    
    init(id: String = UUID().uuidString,
         label: String,
         kind: CompletionKind,
         detail: String? = nil,
         documentation: String? = nil,
         insertText: String,
         sortText: String? = nil) {
        self.id = id
        self.label = label
        self.kind = kind
        self.detail = detail
        self.documentation = documentation
        self.insertText = insertText
        self.sortText = sortText
    }
}

enum CompletionKind: String {
    case method = "Method"
    case function = "Function"
    case variable = "Variable"
    case property = "Property"
    case class = "Class"
    case struct = "Struct"
    case enum = "Enum"
    case keyword = "Keyword"
    case snippet = "Snippet"
}

class CodeCompletionService {
    static let shared = CodeCompletionService()
    
    private init() {}
    
    // MARK: - Code Completion
    
    func getCompletions(at position: TextPosition, in content: String, fileType: FileType) async -> [CodeCompletion] {
        var completions: [CodeCompletion] = []
        
        // Swift-specific completions
        if fileType == .swift {
            completions.append(contentsOf: getSwiftCompletions())
        }
        
        // JavaScript/TypeScript completions
        if fileType == .javascript || fileType == .typescript {
            completions.append(contentsOf: getJavaScriptCompletions())
        }
        
        // General completions
        completions.append(contentsOf: getGeneralCompletions())
        
        return completions
    }
    
    private func getSwiftCompletions() -> [CodeCompletion] {
        return [
            CodeCompletion(
                label: "func",
                kind: .keyword,
                insertText: "func ${1:name}() {\n\t$0\n}",
                sortText: "1"
            ),
            CodeCompletion(
                label: "class",
                kind: .keyword,
                insertText: "class ${1:name} {\n\t$0\n}",
                sortText: "1"
            ),
            CodeCompletion(
                label: "struct",
                kind: .keyword,
                insertText: "struct ${1:name} {\n\t$0\n}",
                sortText: "1"
            ),
            CodeCompletion(
                label: "import SwiftUI",
                kind: .keyword,
                insertText: "import SwiftUI",
                sortText: "1"
            ),
            CodeCompletion(
                label: "@State",
                kind: .keyword,
                insertText: "@State private var ${1:name}: ${2:Type} = ${3:value}",
                sortText: "1"
            ),
            CodeCompletion(
                label: "@StateObject",
                kind: .keyword,
                insertText: "@StateObject private var ${1:name} = ${2:ViewModel}()",
                sortText: "1"
            )
        ]
    }
    
    private func getJavaScriptCompletions() -> [CodeCompletion] {
        return [
            CodeCompletion(
                label: "function",
                kind: .function,
                insertText: "function ${1:name}(${2:params}) {\n\t$0\n}",
                sortText: "1"
            ),
            CodeCompletion(
                label: "const",
                kind: .keyword,
                insertText: "const ${1:name} = ${2:value}",
                sortText: "1"
            ),
            CodeCompletion(
                label: "let",
                kind: .keyword,
                insertText: "let ${1:name} = ${2:value}",
                sortText: "1"
            )
        ]
    }
    
    private func getGeneralCompletions() -> [CodeCompletion] {
        return [
            CodeCompletion(
                label: "if",
                kind: .keyword,
                insertText: "if (${1:condition}) {\n\t$0\n}",
                sortText: "1"
            ),
            CodeCompletion(
                label: "for",
                kind: .keyword,
                insertText: "for (${1:init}; ${2:condition}; ${3:increment}) {\n\t$0\n}",
                sortText: "1"
            ),
            CodeCompletion(
                label: "while",
                kind: .keyword,
                insertText: "while (${1:condition}) {\n\t$0\n}",
                sortText: "1"
            )
        ]
    }
}
