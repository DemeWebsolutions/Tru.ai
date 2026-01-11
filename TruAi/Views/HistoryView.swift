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
                            Text("\(conversation.messages.count) messages")
                                .font(.caption)
                                .foregroundColor(.gray)
                            Text(conversation.updatedAt, style: .relative)
                                .font(.caption)
                                .foregroundColor(.gray)
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
            .toolbar {
                Button(action: { viewModel.createNewConversation() }) {
                    Image(systemName: "plus")
                }
            }
        }
    }
}
