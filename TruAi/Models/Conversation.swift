//
//  Conversation.swift
//  TruAi
//
//  Conversation model for managing AI chat sessions
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation

struct Conversation: Identifiable, Codable {
    let id: UUID
    var title: String
    var messages: [ChatMessage]
    var createdAt: Date
    var updatedAt: Date
    var context: ConversationContext?
    
    init(id: UUID = UUID(), title: String = "New Conversation") {
        self.id = id
        self.title = title
        self.messages = []
        self.createdAt = Date()
        self.updatedAt = Date()
    }
    
    mutating func addMessage(_ message: ChatMessage) {
        messages.append(message)
        updatedAt = Date()
    }
}

struct ConversationContext: Codable {
    var projectPath: String?
    var files: [String]
    var activeFile: String?
    
    init(projectPath: String? = nil, files: [String] = [], activeFile: String? = nil) {
        self.projectPath = projectPath
        self.files = files
        self.activeFile = activeFile
    }
}
