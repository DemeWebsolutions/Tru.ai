//
//  AuthenticationService.swift
//  TruAi
//
//  Authentication service for user login and session management
//

import Foundation
import Combine

class AuthenticationService: ObservableObject {
    static let shared = AuthenticationService()
    
    @Published var currentUser: User?
    @Published var isAuthenticated: Bool = false
    @Published var isLoading: Bool = false
    @Published var error: Error?
    
    private let networkService: NetworkService
    private let storageService: StorageService
    private let tokenKey = "auth_token"
    private let userKey = "current_user"
    
    init(networkService: NetworkService = NetworkService.shared,
         storageService: StorageService = StorageService.shared) {
        self.networkService = networkService
        self.storageService = storageService
        loadStoredUser()
    }
    
    // MARK: - Authentication
    
    func login(email: String, password: String) async throws {
        isLoading = true
        error = nil
        
        do {
            // Simulate authentication - replace with actual API call
            try await Task.sleep(nanoseconds: 1_000_000_000)
            
            // Create user object
            let user = User(
                name: email.components(separatedBy: "@").first ?? "User",
                email: email
            )
            
            currentUser = user
            isAuthenticated = true
            saveUser(user)
            
            isLoading = false
        } catch {
            self.error = error
            isLoading = false
            throw error
        }
    }
    
    func signUp(name: String, email: String, password: String) async throws {
        isLoading = true
        error = nil
        
        do {
            // Simulate sign up - replace with actual API call
            try await Task.sleep(nanoseconds: 1_000_000_000)
            
            let user = User(name: name, email: email)
            currentUser = user
            isAuthenticated = true
            saveUser(user)
            
            isLoading = false
        } catch {
            self.error = error
            isLoading = false
            throw error
        }
    }
    
    func logout() {
        currentUser = nil
        isAuthenticated = false
        clearStoredUser()
    }
    
    func validateSession() async -> Bool {
        // Validate current session token
        guard let token = loadToken() else {
            return false
        }
        
        // Simulate token validation - replace with actual API call
        return !token.isEmpty
    }
    
    // MARK: - Persistence
    
    private func saveUser(_ user: User) {
        if let encoded = try? JSONEncoder().encode(user) {
            UserDefaults.standard.set(encoded, forKey: userKey)
        }
    }
    
    private func loadStoredUser() {
        if let data = UserDefaults.standard.data(forKey: userKey),
           let user = try? JSONDecoder().decode(User.self, from: data) {
            currentUser = user
            isAuthenticated = true
        }
    }
    
    private func clearStoredUser() {
        UserDefaults.standard.removeObject(forKey: userKey)
        UserDefaults.standard.removeObject(forKey: tokenKey)
    }
    
    private func saveToken(_ token: String) {
        UserDefaults.standard.set(token, forKey: tokenKey)
    }
    
    private func loadToken() -> String? {
        return UserDefaults.standard.string(forKey: tokenKey)
    }
}

// MARK: - Error Types

enum AuthenticationError: LocalizedError {
    case invalidCredentials
    case networkError
    case userNotFound
    case tokenExpired
    case unknown
    
    var errorDescription: String? {
        switch self {
        case .invalidCredentials:
            return "Invalid email or password"
        case .networkError:
            return "Network connection error"
        case .userNotFound:
            return "User not found"
        case .tokenExpired:
            return "Session expired. Please login again"
        case .unknown:
            return "An unknown error occurred"
        }
    }
}
