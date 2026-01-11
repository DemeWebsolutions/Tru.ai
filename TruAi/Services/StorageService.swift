//
//  StorageService.swift
//  TruAi
//
//  Local storage service for persistence
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation

class StorageService {
    static let shared = StorageService()
    
    private let defaults = UserDefaults.standard
    private let encoder = JSONEncoder()
    private let decoder = JSONDecoder()
    
    private init() {}
    
    func save<T: Codable>(_ value: T, forKey key: String) {
        do {
            let data = try encoder.encode(value)
            defaults.set(data, forKey: key)
        } catch {
            print("Failed to save \(key): \(error)")
        }
    }
    
    func load<T: Codable>(forKey key: String) -> T? {
        guard let data = defaults.data(forKey: key) else {
            return nil
        }
        
        do {
            return try decoder.decode(T.self, from: data)
        } catch {
            print("Failed to load \(key): \(error)")
            return nil
        }
    }
    
    func remove(forKey key: String) {
        defaults.removeObject(forKey: key)
    }
    
    func saveConversations(_ conversations: [Conversation]) {
        save(conversations, forKey: "conversations")
    }
    
    func loadConversations() -> [Conversation] {
        return load(forKey: "conversations") ?? []
    }
    
    func saveUser(_ user: User) {
        save(user, forKey: "currentUser")
    }
    
    func loadUser() -> User? {
        return load(forKey: "currentUser")
    }
}
