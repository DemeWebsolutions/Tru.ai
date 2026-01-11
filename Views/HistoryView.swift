//
//  HistoryView.swift
//  TruAi
//
//  Conversation history view
//

import SwiftUI

struct HistoryView: View {
    @EnvironmentObject var aiService: TruAiService
    @State private var searchText: String = ""
    
    var filteredConversations: [Conversation] {
        if searchText.isEmpty {
            return aiService.conversations
        }
        return aiService.conversations.filter {
            $0.title.localizedCaseInsensitiveContains(searchText) ||
            $0.messages.contains { $0.content.localizedCaseInsensitiveContains(searchText) }
        }
    }
    
    var body: some View {
        NavigationView {
            List {
                ForEach(filteredConversations) { conversation in
                    ConversationRowView(conversation: conversation)
                        .onTapGesture {
                            aiService.selectConversation(conversation)
                        }
                }
                .onDelete { indexSet in
                    for index in indexSet {
                        aiService.deleteConversation(filteredConversations[index])
                    }
                }
            }
            .searchable(text: $searchText, prompt: "Search conversations")
            .navigationTitle("History")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    EditButton()
                }
            }
        }
    }
}

struct ConversationRowView: View {
    let conversation: Conversation
    
    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Text(conversation.title)
                    .font(.headline)
                    .lineLimit(1)
                
                if conversation.isPinned {
                    Image(systemName: "pin.fill")
                        .font(.caption)
                        .foregroundColor(.blue)
                }
                
                Spacer()
            }
            
            if let lastMessage = conversation.messages.last {
                Text(lastMessage.content)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
                    .lineLimit(2)
            }
            
            Text(conversation.updatedAt, style: .relative)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(.vertical, 4)
    }
}
