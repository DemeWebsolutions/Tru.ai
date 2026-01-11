//
//  SettingsView.swift
//  TruAi
//
//  Settings and preferences view
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var appState: AppState
    @State private var apiKeys: APIKeys = APIKeys()
    @State private var preferences: UserPreferences = UserPreferences()
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("API Keys")) {
                    SecureField("ChatGPT API Key", text: Binding(
                        get: { apiKeys.chatGPTKey ?? "" },
                        set: { apiKeys.chatGPTKey = $0 }
                    ))
                    
                    SecureField("Claude API Key", text: Binding(
                        get: { apiKeys.claudeKey ?? "" },
                        set: { apiKeys.claudeKey = $0 }
                    ))
                    
                    SecureField("GitHub Token", text: Binding(
                        get: { apiKeys.githubToken ?? "" },
                        set: { apiKeys.githubToken = $0 }
                    ))
                }
                
                Section(header: Text("Editor")) {
                    Stepper("Font Size: \(preferences.fontSize)", value: $preferences.fontSize, in: 10...24)
                    Stepper("Tab Size: \(preferences.tabSize)", value: $preferences.tabSize, in: 2...8)
                    Toggle("Auto Save", isOn: $preferences.autoSave)
                }
                
                Section(header: Text("AI")) {
                    Picker("Default AI Tier", selection: $preferences.aiTierPreference) {
                        Text("Auto").tag(AITier.auto)
                        Text("Cheap").tag(AITier.cheap)
                        Text("Mid").tag(AITier.mid)
                        Text("Copilot").tag(AITier.copilot)
                    }
                    
                    Picker("Default Model", selection: $preferences.defaultModel) {
                        Text("GPT-3.5").tag("gpt-3.5-turbo")
                        Text("GPT-4").tag("gpt-4")
                        Text("Claude").tag("claude-2")
                    }
                }
                
                Section(header: Text("Appearance")) {
                    Picker("Theme", selection: $preferences.theme) {
                        Text("Dark").tag("dark")
                        Text("Light").tag("light")
                        Text("System").tag("system")
                    }
                }
                
                Section {
                    Button("Save Settings") {
                        saveSettings()
                    }
                }
            }
            .navigationTitle("Settings")
        }
    }
    
    private func saveSettings() {
        // Save settings using StorageService
    }
}
