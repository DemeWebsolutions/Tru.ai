//
//  StorageService.swift
//  TruAi
//
//  Local storage service for persistence
//

import Foundation

class StorageService {
    static let shared = StorageService()
    
    private let conversationsKey = "tru_ai_conversations"
    private let userPreferencesKey = "tru_ai_user_preferences"
    
    private init() {}
    
    // MARK: - Conversations
    
    func saveConversations(_ conversations: [Conversation]) {
        if let encoded = try? JSONEncoder().encode(conversations) {
            UserDefaults.standard.set(encoded, forKey: conversationsKey)
        }
    }
    
    func loadConversations() -> [Conversation]? {
        guard let data = UserDefaults.standard.data(forKey: conversationsKey),
              let conversations = try? JSONDecoder().decode([Conversation].self, from: data) else {
            return nil
        }
        return conversations
    }
    
    func deleteConversations() {
        UserDefaults.standard.removeObject(forKey: conversationsKey)
    }
    
    // MARK: - User Preferences
    
    func saveUserPreferences(_ preferences: UserPreferences) {
        if let encoded = try? JSONEncoder().encode(preferences) {
            UserDefaults.standard.set(encoded, forKey: userPreferencesKey)
        }
    }
    
    func loadUserPreferences() -> UserPreferences? {
        guard let data = UserDefaults.standard.data(forKey: userPreferencesKey),
              let preferences = try? JSONDecoder().decode(UserPreferences.self, from: data) else {
            return nil
        }
        return preferences
    }
}
