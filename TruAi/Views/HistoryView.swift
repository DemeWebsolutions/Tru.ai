//
//  HistoryView.swift
//  TruAi
//
//  Conversation history view
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import SwiftUI

struct HistoryView: View {
    @ObservedObject var viewModel: ChatViewModel
    
    var body: some View {
        NavigationView {
            List {
                ForEach(viewModel.conversations) { conversation in
                    Button(action: {
                        viewModel.currentConversation = conversation
                    }) {
                        VStack(alignment: .leading) {
                            Text(conversation.title)
                                .font(.headline)
                                .foregroundColor(Color.truAiText)
                            Text("\(conversation.messages.count) messages")
                                .font(.caption)
                                .foregroundColor(Color.truAiText.opacity(0.7))
                            Text(conversation.updatedAt, style: .relative)
                                .font(.caption)
                                .foregroundColor(Color.truAiText.opacity(0.7))
                        }
                    }
                }
                .onDelete { indexSet in
                    indexSet.forEach { index in
                        viewModel.deleteConversation(viewModel.conversations[index])
                    }
                }
            }
            .navigationTitle("History")
            .background(Color.truAiDarkBackground)
            .toolbar {
                Button(action: { viewModel.createNewConversation() }) {
                    Image(systemName: "plus")
                        .foregroundColor(Color.truAiText)
                }
            }
        }
    }
}
