//
//  ChatMessage.swift
//  TruAi
//
//  Chat message model for Tru.ai conversations
//

import Foundation

struct ChatMessage: Identifiable, Codable, Equatable {
    let id: String
    let content: String
    let role: MessageRole
    let timestamp: Date
    var isStreaming: Bool = false
    var attachments: [Attachment] = []
    
    init(id: String = UUID().uuidString,
         content: String,
         role: MessageRole,
         timestamp: Date = Date(),
         isStreaming: Bool = false,
         attachments: [Attachment] = []) {
        self.id = id
        self.content = content
        self.role = role
        self.timestamp = timestamp
        self.isStreaming = isStreaming
        self.attachments = attachments
    }
}

enum MessageRole: String, Codable {
    case user = "user"
    case assistant = "assistant"
    case system = "system"
}

struct Attachment: Identifiable, Codable, Equatable {
    let id: String
    let type: AttachmentType
    let url: String?
    let data: Data?
    let fileName: String?
    
    init(id: String = UUID().uuidString,
         type: AttachmentType,
         url: String? = nil,
         data: Data? = nil,
         fileName: String? = nil) {
        self.id = id
        self.type = type
        self.url = url
        self.data = data
        self.fileName = fileName
    }
}

enum AttachmentType: String, Codable {
    case image = "image"
    case document = "document"
    case code = "code"
    case audio = "audio"
}
