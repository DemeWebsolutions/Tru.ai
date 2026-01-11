//
//  User.swift
//  TruAi
//
//  User model for Tru.ai application
//

import Foundation

struct User: Codable, Identifiable {
    let id: String
    var name: String
    var email: String
    var avatarURL: String?
    var preferences: UserPreferences
    var createdAt: Date
    var lastActiveAt: Date
    
    init(id: String = UUID().uuidString,
         name: String,
         email: String,
         avatarURL: String? = nil,
         preferences: UserPreferences = UserPreferences(),
         createdAt: Date = Date(),
         lastActiveAt: Date = Date()) {
        self.id = id
        self.name = name
        self.email = email
        self.avatarURL = avatarURL
        self.preferences = preferences
        self.createdAt = createdAt
        self.lastActiveAt = lastActiveAt
    }
}

struct UserPreferences: Codable {
    var language: String = "en"
    var notificationsEnabled: Bool = true
    var autoSaveConversations: Bool = true
    var defaultModel: String = "gpt-4"
    var temperature: Double = 0.7
    var maxTokens: Int = 2000
}
