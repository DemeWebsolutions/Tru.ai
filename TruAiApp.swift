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
        }
    }
}
