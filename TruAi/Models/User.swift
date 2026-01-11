//
//  User.swift
//  TruAi
//
//  User model for authentication and preferences
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation

struct User: Codable, Identifiable {
    let id: UUID
    var username: String
    var email: String
    var apiKeys: APIKeys
    var preferences: UserPreferences
    var createdAt: Date
    var lastLogin: Date?
    
    init(id: UUID = UUID(), username: String, email: String) {
        self.id = id
        self.username = username
        self.email = email
        self.apiKeys = APIKeys()
        self.preferences = UserPreferences()
        self.createdAt = Date()
    }
}

struct APIKeys: Codable {
    var chatGPTKey: String?
    var claudeKey: String?
    var githubToken: String?
    var truAiCoreKey: String?
}

struct UserPreferences: Codable {
    var theme: String = "dark"
    var fontSize: Int = 14
    var tabSize: Int = 4
    var autoSave: Bool = true
    var aiTierPreference: AITier = .auto
    var defaultModel: String = "gpt-4"
}

enum AITier: String, Codable {
    case cheap
    case mid
    case copilot
    case auto
}
