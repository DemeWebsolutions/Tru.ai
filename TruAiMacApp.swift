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
    // AuthenticationService: Instantiated per app for isolated state management
    @StateObject private var authService = AuthenticationService()
    // TruAiService: Uses shared instance for centralized conversation management
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
        
        Settings {
            SettingsView()
                .environmentObject(appState)
                .environmentObject(aiService)
                .frame(width: 600, height: 400)
        }
    }
}
#endif
