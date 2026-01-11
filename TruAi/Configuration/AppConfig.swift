//
//  AppConfig.swift
//  TruAi
//
//  Application configuration
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation

struct AppConfig {
    // App Info
    static let appName = "Tru.ai"
    static let version = "1.0.0"
    static let build = "1"
    
    // TruAi Core
    static let truAiCoreAPIEndpoint = "https://api.truai.core/v1"
    
    // AI Provider Endpoints
    static let chatGPTEndpoint = "https://api.openai.com/v1"
    static let claudeEndpoint = "https://api.anthropic.com/v1"
    static let copilotEndpoint = "https://copilot-proxy.githubusercontent.com"
    
    // Default Settings
    static let defaultFontSize: CGFloat = 14
    static let defaultTabSize = 4
    static let defaultTheme = "dark"
    
    // Limits
    static let maxConcurrentRequests = 3
    static let requestTimeout: TimeInterval = 30
    static let maxFileSizeForAI = 1_000_000 // 1MB
    
    // Features
    static let enableTruAiCore = true
    static let enableSyntaxHighlighting = true
    static let enableGitIntegration = true
    static let enableTerminal = true
}
