//
//  TruAiMacApp.swift
//  TruAi
//
//  macOS-specific app entry point
//

import SwiftUI

#if os(macOS)
@main
struct TruAiMacApp: App {
    @StateObject private var appState = AppState()
    @StateObject private var authService = AuthenticationService.shared
    @StateObject private var aiService = TruAiService.shared
    
    var body: some Scene {
        WindowGroup {
            if authService.isAuthenticated {
                IDELayoutView()
                    .environmentObject(appState)
                    .environmentObject(authService)
                    .environmentObject(aiService)
                    .frame(minWidth: 800, minHeight: 600)
            } else {
                LoginView()
                    .environmentObject(authService)
                    .frame(width: 500, height: 600)
            }
        }
        .commands {
            // File menu
            CommandGroup(replacing: .newItem) {
                Button("New File") {
                    // Handle new file
                }
                .keyboardShortcut("n", modifiers: .command)
                
                Button("Open File") {
                    // Handle open file
                }
                .keyboardShortcut("o", modifiers: .command)
            }
            
            // View menu
            CommandMenu("View") {
                Button("Toggle Explorer") {
                    // Handle toggle explorer
                }
                .keyboardShortcut("b", modifiers: .command)
                
                Button("Toggle Terminal") {
                    // Handle toggle terminal
                }
                .keyboardShortcut("`", modifiers: .command)
            }
        }
        
        Settings {
            SettingsView()
                .environmentObject(appState)
                .environmentObject(aiService)
                .frame(width: 600, height: 400)
        }
    }
}
#endif
