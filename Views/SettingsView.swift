//
//  SettingsView.swift
//  TruAi
//
//  Settings and preferences view - Cursor-like settings
//

import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var aiService: TruAiService
    @State private var apiKey: String = ""
    @State private var selectedModel: String = "gpt-4"
    @State private var temperature: Double = 0.7
    @State private var fontSize: Int = 14
    @State private var fontFamily: String = "SF Mono"
    @State private var tabSize: Int = 4
    @State private var wordWrap: Bool = true
    @State private var minimapEnabled: Bool = true
    @State private var showSettings: Bool = false
    
    var body: some View {
        NavigationView {
            Form {
                // Editor Settings
                Section(header: Text("Editor")) {
                    Stepper("Font Size: \(fontSize)", value: $fontSize, in: 10...24)
                    
                    Picker("Font Family", selection: $fontFamily) {
                        Text("SF Mono").tag("SF Mono")
                        Text("Menlo").tag("Menlo")
                        Text("Monaco").tag("Monaco")
                        Text("Courier").tag("Courier")
                    }
                    
                    Stepper("Tab Size: \(tabSize)", value: $tabSize, in: 2...8)
                    
                    Toggle("Word Wrap", isOn: $wordWrap)
                    Toggle("Minimap", isOn: $minimapEnabled)
                }
                
                // AI Configuration
                Section(header: Text("AI Configuration")) {
                    SecureField("API Key", text: $apiKey)
                        .onAppear {
                            apiKey = UserDefaults.standard.string(forKey: "tru_ai_api_key") ?? ""
                        }
                        .onChange(of: apiKey) { newValue in
                            UserDefaults.standard.set(newValue, forKey: "tru_ai_api_key")
                        }
                    
                    Picker("Model", selection: $selectedModel) {
                        Text("GPT-4").tag("gpt-4")
                        Text("GPT-3.5 Turbo").tag("gpt-3.5-turbo")
                        Text("Claude").tag("claude")
                    }
                    
                    VStack(alignment: .leading) {
                        Text("Temperature: \(temperature, specifier: "%.1f")")
                        Slider(value: $temperature, in: 0...1, step: 0.1)
                    }
                }
                
                // Appearance
                Section(header: Text("Appearance")) {
                    Picker("Theme", selection: Binding(
                        get: { appState.theme },
                        set: { appState.setTheme($0) }
                    )) {
                        ForEach(AppTheme.allCases, id: \.self) { theme in
                            Text(theme.rawValue.capitalized).tag(theme)
                        }
                    }
                }
                
                // Git Settings
                Section(header: Text("Git")) {
                    Toggle("Auto Fetch", isOn: .constant(false))
                    Toggle("Confirm Sync", isOn: .constant(true))
                }
                
                // Terminal Settings
                Section(header: Text("Terminal")) {
                    Picker("Shell", selection: .constant("zsh")) {
                        Text("zsh").tag("zsh")
                        Text("bash").tag("bash")
                        Text("fish").tag("fish")
                    }
                }
                
                // Data
                Section(header: Text("Data")) {
                    Button("Clear All Conversations") {
                        aiService.conversations.removeAll()
                    }
                    .foregroundColor(.red)
                }
                
                // About
                Section(header: Text("About")) {
                    HStack {
                        Text("Version")
                        Spacer()
                        Text("1.0.0")
                            .foregroundColor(.secondary)
                    }
                    
                    Link("Privacy Policy", destination: URL(string: "https://tru.ai/privacy")!)
                    Link("Terms of Service", destination: URL(string: "https://tru.ai/terms")!)
                }
            }
            .navigationTitle("Settings")
        }
    }
}
