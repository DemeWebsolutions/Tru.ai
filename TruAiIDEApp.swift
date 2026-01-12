//
//  TruAiIDEApp.swift
//  Tru.ai IDE
//
//  Standalone macOS Cursor-like IDE application
//

import SwiftUI

#if os(macOS)
@main
struct TruAiIDEApp: App {
    @StateObject private var appState = AppState()
    @StateObject private var aiService = TruAiService.shared
    
    var body: some Scene {
        // Main IDE Window
        WindowGroup("Tru.ai IDE") {
            IDELayoutView()
                .environmentObject(appState)
                .environmentObject(aiService)
                .frame(minWidth: 1200, minHeight: 800)
        }
        .commands {
            // File Menu
            CommandGroup(replacing: .newItem) {
                Button("New File") {
                    NSApp.sendAction(#selector(NSResponder.newDocument(_:)), to: nil, from: nil)
                }
                .keyboardShortcut("n", modifiers: .command)
                
                Button("Open...") {
                    NSApp.sendAction(#selector(NSResponder.openDocument(_:)), to: nil, from: nil)
                }
                .keyboardShortcut("o", modifiers: .command)
                
                Divider()
                
                Button("Save") {
                    NSApp.sendAction(#selector(NSResponder.saveDocument(_:)), to: nil, from: nil)
                }
                .keyboardShortcut("s", modifiers: .command)
                
                Button("Save All") {
                    // Save all open files
                }
                .keyboardShortcut("s", modifiers: [.command, .shift])
            }
            
            // Edit Menu
            CommandGroup(after: .pasteboard) {
                Divider()
                
                Button("Find...") {
                    // Open find panel
                }
                .keyboardShortcut("f", modifiers: .command)
                
                Button("Find in Files...") {
                    // Open search panel
                }
                .keyboardShortcut("f", modifiers: [.command, .shift])
                
                Button("Replace...") {
                    // Open replace panel
                }
                .keyboardShortcut("f", modifiers: [.command, .option])
            }
            
            // View Menu
            CommandMenu("View") {
                Button("Command Palette...") {
                    // Open command palette
                }
                .keyboardShortcut("p", modifiers: [.command, .shift])
                
                Divider()
                
                Button("Toggle Explorer") {
                    // Toggle file explorer
                }
                .keyboardShortcut("b", modifiers: .command)
                
                Button("Toggle Terminal") {
                    // Toggle terminal
                }
                .keyboardShortcut("`", modifiers: .command)
                
                Divider()
                
                Button("Zoom In") {
                    // Increase font size
                }
                .keyboardShortcut("+", modifiers: .command)
                
                Button("Zoom Out") {
                    // Decrease font size
                }
                .keyboardShortcut("-", modifiers: .command)
                
                Button("Reset Zoom") {
                    // Reset font size
                }
                .keyboardShortcut("0", modifiers: .command)
            }
            
            // Go Menu
            CommandMenu("Go") {
                Button("Go to File...") {
                    // Quick open file
                }
                .keyboardShortcut("p", modifiers: .command)
                
                Button("Go to Line...") {
                    // Go to line number
                }
                .keyboardShortcut("g", modifiers: .command)
                
                Button("Go to Symbol...") {
                    // Go to symbol
                }
                .keyboardShortcut("o", modifiers: [.command, .shift])
            }
            
            // Git Menu
            CommandMenu("Git") {
                Button("Commit...") {
                    // Open git commit
                }
                .keyboardShortcut("g", modifiers: [.command, .shift])
                
                Button("Push") {
                    // Git push
                }
                
                Button("Pull") {
                    // Git pull
                }
                
                Divider()
                
                Button("View Changes") {
                    // Show git panel
                }
            }
            
            // AI Menu
            CommandMenu("AI") {
                Button("Ask Tru.ai...") {
                    // Open AI panel
                }
                .keyboardShortcut("l", modifiers: [.command, .shift])
                
                Button("Explain Code") {
                    // Explain selected code
                }
                
                Button("Generate Code") {
                    // Generate code from prompt
                }
                
                Button("Fix Issues") {
                    // Fix code issues
                }
            }
        }
        
        // Settings Window
        Settings {
            SettingsView()
                .environmentObject(appState)
                .environmentObject(aiService)
                .frame(width: 700, height: 500)
        }
        
        // About Window
        #if os(macOS)
        Window("About Tru.ai IDE", id: "about") {
            AboutView()
                .frame(width: 400, height: 300)
        }
        .windowResizability(.contentSize)
        #endif
    }
}

// About View
struct AboutView: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "brain.head.profile")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .frame(width: 80, height: 80)
                .foregroundColor(.blue)
            
            Text("Tru.ai IDE")
                .font(.system(size: 32, weight: .bold, design: .rounded))
            
            Text("A Cursor-like Code Editor with AI")
                .font(.subheadline)
                .foregroundColor(.secondary)
            
            VStack(alignment: .leading, spacing: 8) {
                InfoRow(label: "Version", value: "1.0.0")
                InfoRow(label: "Build", value: "2026.01")
                InfoRow(label: "Platform", value: "macOS 12.0+")
            }
            .padding()
            .background(Color(.systemGray6))
            .cornerRadius(8)
            
            Spacer()
            
            Text("© 2026 Tru.ai. All rights reserved.")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .padding(30)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

struct InfoRow: View {
    let label: String
    let value: String
    
    var body: some View {
        HStack {
            Text(label + ":")
                .foregroundColor(.secondary)
            Spacer()
            Text(value)
                .fontWeight(.medium)
        }
        .font(.system(.body, design: .monospaced))
    }
}
#endif
