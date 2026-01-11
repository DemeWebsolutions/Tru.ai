//
//  ContentView.swift
//  TruAi
//
//  Main content view - switches between IDE and simple chat mode
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var appState: AppState
    @StateObject private var aiService = TruAiService.shared
    @State private var viewMode: ViewMode = .ide
    
    var body: some View {
        NavigationView {
            Group {
                switch viewMode {
                case .ide:
                    IDELayoutView()
                        .navigationTitle("Tru.ai")
                        .environmentObject(aiService)
                case .chat:
                    ChatView()
                        .navigationTitle("Tru.ai Chat")
                        .environmentObject(aiService)
                }
            }
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Picker("View Mode", selection: $viewMode) {
                        Text("IDE").tag(ViewMode.ide)
                        Text("Chat").tag(ViewMode.chat)
                    }
                    .pickerStyle(.segmented)
                }
            }
        }
    }
}

enum ViewMode {
    case ide
    case chat
}
