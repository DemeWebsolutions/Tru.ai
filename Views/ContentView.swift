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
        #if os(macOS)
        // macOS: Use direct view without NavigationView wrapper
        contentView
            .frame(maxWidth: .infinity, maxHeight: .infinity)
            .background(Color(.windowBackgroundColor))
        #else
        // iOS: Use NavigationView
        NavigationView {
            contentView
                .toolbar {
                    ToolbarItem(placement: .navigationBarLeading) {
                        viewModePicker
                    }
                }
        }
        #endif
    }
    
    @ViewBuilder
    private var contentView: some View {
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
        #if os(macOS)
        .toolbar {
            ToolbarItem(placement: .navigation) {
                viewModePicker
            }
        }
        #endif
    }
    
    private var viewModePicker: some View {
        Picker("View Mode", selection: $viewMode) {
            Text("IDE").tag(ViewMode.ide)
            Text("Chat").tag(ViewMode.chat)
        }
        .pickerStyle(.segmented)
    }
}

enum ViewMode {
    case ide
    case chat
}
