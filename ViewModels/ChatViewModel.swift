//
//  ChatViewModel.swift
//  TruAi
//
//  ViewModel for chat interface
//

import Foundation
import SwiftUI
import Combine

@MainActor
class ChatViewModel: ObservableObject {
    @Published var messages: [ChatMessage] = []
    @Published var inputText: String = ""
    @Published var isSending: Bool = false
    @Published var errorMessage: String?
    
    var aiService: TruAiService
    private var cancellables = Set<AnyCancellable>()
    
    init(aiService: TruAiService) {
        self.aiService = aiService
        
        // Observe current conversation changes
        aiService.$currentConversation
            .compactMap { $0 }
            .map { $0.messages }
            .assign(to: &$messages)
    }
    
    func updateService(_ service: TruAiService) {
        // Cancel previous subscriptions
        cancellables.removeAll()
        
        self.aiService = service
        // Re-observe with new service
        service.$currentConversation
            .compactMap { $0 }
            .map { $0.messages }
            .sink { [weak self] messages in
                self?.messages = messages
            }
            .store(in: &cancellables)
    }
    
    func sendMessage() {
        guard !inputText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }
        
        let messageText = inputText
        inputText = ""
        isSending = true
        errorMessage = nil
        
        Task {
            await aiService.sendMessage(messageText)
            isSending = false
        }
    }
    
    func clearChat() {
        aiService.createNewConversation()
    }
}
