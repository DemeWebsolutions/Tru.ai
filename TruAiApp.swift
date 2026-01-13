//
//  TruAiApp.swift
//  TruAi
//
//  Created on [Date]
//  Copyright © 2024 Tru.ai. All rights reserved.
//

import SwiftUI

@main
struct TruAiApp: App {
    @StateObject private var appState = AppState()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .preferredColorScheme(.dark)
                #if os(macOS)
                .frame(minWidth: 1024, minHeight: 768)
                #endif
        }
        #if os(macOS)
        .windowStyle(.hiddenTitleBar)
        .windowToolbarStyle(.unified)
        .commands {
            CommandGroup(replacing: .newItem) {
                Button("New File") {
                    NotificationCenter.default.post(name: .newFile, object: nil)
                }
                .keyboardShortcut("n", modifiers: .command)
            }
            
            CommandGroup(after: .newItem) {
                Button("Open File") {
                    NotificationCenter.default.post(name: .openFile, object: nil)
                }
                .keyboardShortcut("o", modifiers: .command)
                
                Divider()
                
                Button("Save") {
                    NotificationCenter.default.post(name: .saveFile, object: nil)
                }
                .keyboardShortcut("s", modifiers: .command)
                
                Button("Save All") {
                    NotificationCenter.default.post(name: .saveAllFiles, object: nil)
                }
                .keyboardShortcut("s", modifiers: [.command, .shift])
            }
            
            CommandGroup(replacing: .sidebar) {
                Button("Toggle Sidebar") {
                    NotificationCenter.default.post(name: .toggleSidebar, object: nil)
                }
                .keyboardShortcut("b", modifiers: .command)
            }
            
            CommandMenu("View") {
                Button("Toggle Terminal") {
                    NotificationCenter.default.post(name: .toggleTerminal, object: nil)
                }
                .keyboardShortcut("`", modifiers: .command)
                
                Button("Command Palette") {
                    NotificationCenter.default.post(name: .showCommandPalette, object: nil)
                }
                .keyboardShortcut("p", modifiers: [.command, .shift])
            }
            
            CommandMenu("AI") {
                Button("Ask Tru.ai") {
                    NotificationCenter.default.post(name: .askAI, object: nil)
                }
                .keyboardShortcut("l", modifiers: [.command, .shift])
                
                Button("New Conversation") {
                    NotificationCenter.default.post(name: .newConversation, object: nil)
                }
                .keyboardShortcut("n", modifiers: [.command, .option])
            }
        }
        
        Settings {
            SettingsView()
                .environmentObject(appState)
                .frame(width: 600, height: 500)
        }
        #endif
    }
}

// Notification names for cross-platform command handling
extension Notification.Name {
    static let newFile = Notification.Name("newFile")
    static let openFile = Notification.Name("openFile")
    static let saveFile = Notification.Name("saveFile")
    static let saveAllFiles = Notification.Name("saveAllFiles")
    static let toggleSidebar = Notification.Name("toggleSidebar")
    static let toggleTerminal = Notification.Name("toggleTerminal")
    static let showCommandPalette = Notification.Name("showCommandPalette")
    static let askAI = Notification.Name("askAI")
    static let newConversation = Notification.Name("newConversation")
}
