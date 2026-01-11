//
//  CodeCompletionService.swift
//  TruAi
//
//  Code completion and IntelliSense service
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation

class CodeCompletionService {
    static let shared = CodeCompletionService()
    
    private init() {}
    
    func getCompletions(for text: String, language: String) -> [CodeCompletion] {
        // Language-specific completions
        switch language.lowercased() {
        case "swift":
            return getSwiftCompletions(for: text)
        case "javascript", "typescript":
            return getJavaScriptCompletions(for: text)
        case "python":
            return getPythonCompletions(for: text)
        default:
            return getGenericCompletions(for: text)
        }
    }
    
    private func getSwiftCompletions(for text: String) -> [CodeCompletion] {
        let keywords = ["func", "var", "let", "class", "struct", "enum", "if", "else", "for", "while", "return", "import"]
        return keywords.filter { $0.hasPrefix(text) }
            .map { CodeCompletion(text: $0, type: .keyword, detail: "Swift keyword") }
    }
    
    private func getJavaScriptCompletions(for text: String) -> [CodeCompletion] {
        let keywords = ["function", "const", "let", "var", "class", "if", "else", "for", "while", "return", "import", "export"]
        return keywords.filter { $0.hasPrefix(text) }
            .map { CodeCompletion(text: $0, type: .keyword, detail: "JavaScript keyword") }
    }
    
    private func getPythonCompletions(for text: String) -> [CodeCompletion] {
        let keywords = ["def", "class", "if", "else", "elif", "for", "while", "return", "import", "from", "with", "try", "except"]
        return keywords.filter { $0.hasPrefix(text) }
            .map { CodeCompletion(text: $0, type: .keyword, detail: "Python keyword") }
    }
    
    private func getGenericCompletions(for text: String) -> [CodeCompletion] {
        return []
    }
    
    func getSnippets(for language: String) -> [CodeSnippet] {
        // Return language-specific code snippets
        switch language.lowercased() {
        case "swift":
            return swiftSnippets
        case "javascript", "typescript":
            return javascriptSnippets
        default:
            return []
        }
    }
    
    private let swiftSnippets = [
        CodeSnippet(name: "func", code: "func ${1:name}(${2:params}) -> ${3:ReturnType} {\n    ${4:// code}\n}"),
        CodeSnippet(name: "class", code: "class ${1:ClassName} {\n    ${2:// properties and methods}\n}"),
    ]
    
    private let javascriptSnippets = [
        CodeSnippet(name: "function", code: "function ${1:name}(${2:params}) {\n    ${3:// code}\n}"),
        CodeSnippet(name: "arrow", code: "const ${1:name} = (${2:params}) => {\n    ${3:// code}\n}"),
    ]
}

struct CodeCompletion {
    let text: String
    let type: CompletionType
    let detail: String
}

enum CompletionType {
    case keyword
    case method
    case property
    case snippet
}

struct CodeSnippet {
    let name: String
    let code: String
}
