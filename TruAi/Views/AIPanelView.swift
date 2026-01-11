//
//  AIPanelView.swift
//  TruAi
//
//  AI panel for TruAi Core integration
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import SwiftUI

struct AIPanelView: View {
    @ObservedObject var viewModel: ChatViewModel
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack {
                Text("TRU.AI")
                    .font(.caption)
                    .fontWeight(.bold)
                    .foregroundColor(Color.truAiText.opacity(0.7))
                Spacer()
                Button(action: { viewModel.createNewConversation() }) {
                    Image(systemName: "plus")
                        .foregroundColor(Color.truAiText)
                }
            }
            .padding()
            .background(Color.truAiLightBackground)
            
            // Chat messages
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 12) {
                    if let conversation = viewModel.currentConversation {
                        ForEach(conversation.messages) { message in
                            MessageBubble(message: message)
                        }
                    }
                }
                .padding()
            }
            
            if viewModel.isLoading {
                ProgressView()
                    .padding()
            }
            
            // Input area
            HStack(spacing: 8) {
                TextField("Ask TruAi Core...", text: $viewModel.messageInput)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                Button(action: {
                    Task { await viewModel.sendMessage() }
                }) {
                    Image(systemName: "paperplane.fill")
                }
                .disabled(viewModel.messageInput.isEmpty || viewModel.isLoading)
            }
            .padding()
        }
        .background(Color.truAiDarkBackground)
        .foregroundColor(Color.truAiText)
    }
}

struct MessageBubble: View {
    let message: ChatMessage
    
    var body: some View {
        HStack {
            if message.role == .user {
                Spacer()
            }
            
            VStack(alignment: message.role == .user ? .trailing : .leading, spacing: 4) {
                Text(message.content)
                    .padding(12)
                    .background(message.role == .user ? Color.blue : Color.truAiMediumBackground)
                    .foregroundColor(Color.truAiText)
                    .cornerRadius(12)
                
                if let model = message.model {
                    Text(model)
                        .font(.caption2)
                        .foregroundColor(Color.truAiText.opacity(0.7))
                }
            }
            .frame(maxWidth: 300, alignment: message.role == .user ? .trailing : .leading)
            
            if message.role == .assistant {
                Spacer()
            }
        }
    }
}
