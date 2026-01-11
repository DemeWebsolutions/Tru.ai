//
//  ChatView.swift
//  TruAi
//
//  Full-screen chat view
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import SwiftUI

struct ChatView: View {
    @ObservedObject var viewModel: ChatViewModel
    
    var body: some View {
        NavigationView {
            VStack(spacing: 0) {
                // Messages
                ScrollView {
                    LazyVStack(alignment: .leading, spacing: 16) {
                        if let conversation = viewModel.currentConversation {
                            ForEach(conversation.messages) { message in
                                MessageBubble(message: message)
                            }
                        }
                    }
                    .padding()
                }
                
                // Input
                HStack {
                    TextField("Message", text: $viewModel.messageInput)
                        .textFieldStyle(RoundedBorderTextFieldStyle())
                    
                    Button("Send") {
                        Task { await viewModel.sendMessage() }
                    }
                    .disabled(viewModel.messageInput.isEmpty)
                }
                .padding()
            }
            .navigationTitle("Chat with TruAi")
        }
    }
}
