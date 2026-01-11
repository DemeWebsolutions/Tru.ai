//
//  Conversation.swift
//  TruAi
//
//  Conversation model for managing chat sessions
//

import Foundation

struct Conversation: Identifiable, Codable {
    let id: String
    var title: String
    var messages: [ChatMessage]
    var createdAt: Date
    var updatedAt: Date
    var isPinned: Bool
    var tags: [String]
    
    init(id: String = UUID().uuidString,
         title: String,
         messages: [ChatMessage] = [],
         createdAt: Date = Date(),
         updatedAt: Date = Date(),
         isPinned: Bool = false,
         tags: [String] = []) {
        self.id = id
        self.title = title
        self.messages = messages
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.isPinned = isPinned
        self.tags = tags
    }
    
    mutating func addMessage(_ message: ChatMessage) {
        messages.append(message)
        updatedAt = Date()
        if title.isEmpty || title == "New Conversation" {
            title = generateTitle(from: message.content)
        }
    }
    
    private func generateTitle(from content: String) -> String {
        let words = content.components(separatedBy: .whitespacesAndNewlines)
        let firstWords = words.prefix(5).joined(separator: " ")
        return firstWords.isEmpty ? "New Conversation" : firstWords
    }
}
