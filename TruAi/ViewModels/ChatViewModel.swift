//
//  ChatViewModel.swift
//  TruAi
//
//  View model for AI chat functionality
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation
import Combine

@MainActor
class ChatViewModel: ObservableObject {
    @Published var conversations: [Conversation] = []
    @Published var currentConversation: Conversation?
    @Published var messageInput: String = ""
    @Published var isLoading: Bool = false
    @Published var error: String?
    
    private let truAiService = TruAiService.shared
    private let storageService = StorageService.shared
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        loadConversations()
    }
    
    func loadConversations() {
        conversations = storageService.loadConversations()
        if let first = conversations.first {
            currentConversation = first
        }
    }
    
    func createNewConversation() {
        let conversation = Conversation(title: "New Chat")
        conversations.insert(conversation, at: 0)
        currentConversation = conversation
        saveConversations()
    }
    
    func sendMessage(_ text: String? = nil, context: ConversationContext? = nil) async {
        let messageText = text ?? messageInput
        guard !messageText.isEmpty else { return }
        
        // Create user message
        let userMessage = ChatMessage(role: .user, content: messageText)
        
        // Add to conversation
        if currentConversation == nil {
            createNewConversation()
        }
        
        currentConversation?.addMessage(userMessage)
        messageInput = ""
        isLoading = true
        error = nil
        
        do {
            // Send to TruAi Core for processing
            let response = try await truAiService.sendMessage(messageText, context: context)
            currentConversation?.addMessage(response)
            
            // Update conversation title if first message
            if currentConversation?.messages.count == 2 {
                currentConversation?.title = String(messageText.prefix(50))
            }
            
            saveConversations()
        } catch {
            self.error = error.localizedDescription
        }
        
        isLoading = false
    }
    
    func deleteConversation(_ conversation: Conversation) {
        conversations.removeAll { $0.id == conversation.id }
        if currentConversation?.id == conversation.id {
            currentConversation = conversations.first
        }
        saveConversations()
    }
    
    private func saveConversations() {
        if let current = currentConversation,
           let index = conversations.firstIndex(where: { $0.id == current.id }) {
            conversations[index] = current
        }
        storageService.saveConversations(conversations)
    }
}
