//
//  ChatMessage.swift
//  TruAi
//
//  Chat message model for AI interactions
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation

struct ChatMessage: Identifiable, Codable {
    let id: UUID
    var role: MessageRole
    var content: String
    var timestamp: Date
    var model: String?
    var tokenCount: Int?
    var attachments: [Attachment]?
    
    init(id: UUID = UUID(), role: MessageRole, content: String, model: String? = nil) {
        self.id = id
        self.role = role
        self.content = content
        self.timestamp = Date()
        self.model = model
    }
}

enum MessageRole: String, Codable {
    case user
    case assistant
    case system
}

struct Attachment: Codable, Identifiable {
    let id: UUID
    var type: AttachmentType
    var name: String
    var content: Data?
    var url: String?
    
    init(id: UUID = UUID(), type: AttachmentType, name: String) {
        self.id = id
        self.type = type
        self.name = name
    }
}

enum AttachmentType: String, Codable {
    case file
    case image
    case url
    case code
}
