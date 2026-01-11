//
//  AppConfig.swift
//  TruAi
//
//  Application configuration
//

import Foundation

struct AppConfig {
    static let appName = "Tru.ai"
    static let appVersion = "1.0.0"
    static let bundleIdentifier = "com.truai.app"
    
    // API Configuration
    static let defaultAPIBaseURL = "https://api.tru.ai/v1"
    static let defaultModel = "gpt-4"
    static let defaultTemperature: Double = 0.7
    static let defaultMaxTokens = 2000
    
    // Storage Keys
    static let conversationsKey = "tru_ai_conversations"
    static let apiKeyKey = "tru_ai_api_key"
    static let userPreferencesKey = "tru_ai_user_preferences"
    
    // UI Configuration
    static let maxMessageLength = 10000
    static let animationDuration: Double = 0.3
}
