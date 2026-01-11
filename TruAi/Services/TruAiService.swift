//
//  TruAiService.swift
//  TruAi
//
//  TruAi Core integration service - AI orchestration and routing
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation
import Combine

class TruAiService {
    static let shared = TruAiService()
    
    private let networkService = NetworkService.shared
    private var cancellables = Set<AnyCancellable>()
    
    private init() {}
    
    /// Send a message to TruAi Core with automatic tier selection
    func sendMessage(_ message: String, context: ConversationContext? = nil, forceTier: AITier? = nil) async throws -> ChatMessage {
        let tier = forceTier ?? selectOptimalTier(for: message, context: context)
        
        let request = AIRequest(
            message: message,
            context: context,
            tier: tier,
            riskLevel: classifyRisk(message: message)
        )
        
        let response = try await routeToAI(request: request)
        
        return ChatMessage(
            role: .assistant,
            content: response.content,
            model: response.model
        )
    }
    
    /// TruAi Core logic: Select optimal AI tier based on task complexity
    private func selectOptimalTier(for message: String, context: ConversationContext?) -> AITier {
        // Cost-efficient routing logic
        let wordCount = message.split(separator: " ").count
        let hasCodeContext = context?.activeFile != nil
        
        if wordCount < 20 && !hasCodeContext {
            return .cheap // Simple queries use cheap models
        } else if wordCount < 100 {
            return .mid // Medium complexity
        } else {
            return .copilot // Complex tasks or code generation
        }
    }
    
    /// Risk classification for approval workflow
    private func classifyRisk(message: String) -> RiskLevel {
        let keywords = ["delete", "remove", "deploy", "production", "commit"]
        let lowercaseMessage = message.lowercased()
        
        for keyword in keywords {
            if lowercaseMessage.contains(keyword) {
                return .high
            }
        }
        
        return .low
    }
    
    /// Route request to appropriate AI source
    private func routeToAI(request: AIRequest) async throws -> AIResponse {
        switch request.tier {
        case .cheap:
            return try await callChatGPT(request, model: "gpt-3.5-turbo")
        case .mid:
            return try await callChatGPT(request, model: "gpt-4")
        case .copilot:
            return try await callCopilot(request)
        case .auto:
            return try await routeToAI(request: AIRequest(
                message: request.message,
                context: request.context,
                tier: selectOptimalTier(for: request.message, context: request.context),
                riskLevel: request.riskLevel
            ))
        }
    }
    
    private func callChatGPT(_ request: AIRequest, model: String) async throws -> AIResponse {
        // Placeholder for ChatGPT API integration
        return AIResponse(content: "ChatGPT response (model: \(model))", model: model)
    }
    
    private func callCopilot(_ request: AIRequest) async throws -> AIResponse {
        // Placeholder for GitHub Copilot integration
        return AIResponse(content: "Copilot response", model: "copilot")
    }
}

struct AIRequest {
    let message: String
    let context: ConversationContext?
    let tier: AITier
    let riskLevel: RiskLevel
}

struct AIResponse {
    let content: String
    let model: String
}

enum RiskLevel {
    case low
    case high
}
