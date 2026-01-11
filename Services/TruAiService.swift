//
//  TruAiService.swift
//  TruAi
//
//  Core AI service for Tru.ai - handles all AI interactions
//

import Foundation
import Combine

class TruAiService: ObservableObject {
    static let shared = TruAiService()
    
    @Published var conversations: [Conversation] = []
    @Published var currentConversation: Conversation?
    @Published var isProcessing: Bool = false
    @Published var error: Error?
    
    private let networkService: NetworkService
    private let storageService: StorageService
    private var cancellables = Set<AnyCancellable>()
    
    init(networkService: NetworkService = NetworkService.shared,
         storageService: StorageService = StorageService.shared) {
        self.networkService = networkService
        self.storageService = storageService
        loadConversations()
    }
    
    // MARK: - Conversation Management
    
    func createNewConversation() {
        let newConversation = Conversation(title: "New Conversation")
        currentConversation = newConversation
        conversations.insert(newConversation, at: 0)
        saveConversations()
    }
    
    func selectConversation(_ conversation: Conversation) {
        currentConversation = conversation
    }
    
    func deleteConversation(_ conversation: Conversation) {
        conversations.removeAll { $0.id == conversation.id }
        if currentConversation?.id == conversation.id {
            currentConversation = nil
        }
        saveConversations()
    }
    
    // MARK: - Message Handling
    
    func sendMessage(_ content: String, attachments: [Attachment] = []) async {
        guard var conversation = currentConversation else {
            createNewConversation()
            guard var conversation = currentConversation else { return }
            await sendMessageToConversation(&conversation, content: content, attachments: attachments)
            return
        }
        
        await sendMessageToConversation(&conversation, content: content, attachments: attachments)
    }
    
    private func sendMessageToConversation(_ conversation: inout Conversation, content: String, attachments: [Attachment]) async {
        isProcessing = true
        
        // Create user message
        let userMessage = ChatMessage(
            content: content,
            role: .user,
            attachments: attachments
        )
        conversation.addMessage(userMessage)
        updateConversation(conversation)
        
        do {
            // Send to AI service
            let response = try await networkService.sendChatRequest(
                messages: conversation.messages,
                model: "gpt-4",
                temperature: 0.7
            )
            
            // Create assistant message
            let assistantMessage = ChatMessage(
                content: response,
                role: .assistant
            )
            conversation.addMessage(assistantMessage)
            updateConversation(conversation)
            
            isProcessing = false
            saveConversations()
        } catch {
            self.error = error
            isProcessing = false
        }
    }
    
    private func updateConversation(_ conversation: Conversation) {
        if let index = conversations.firstIndex(where: { $0.id == conversation.id }) {
            conversations[index] = conversation
        }
        currentConversation = conversation
    }
    
    // MARK: - Persistence
    
    private func loadConversations() {
        if let loaded = storageService.loadConversations() {
            conversations = loaded
            currentConversation = conversations.first
        }
    }
    
    private func saveConversations() {
        storageService.saveConversations(conversations)
    }
}
