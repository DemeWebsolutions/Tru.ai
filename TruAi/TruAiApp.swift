//
//  TruAiApp.swift
//  TruAi
//
//  Tru.ai iOS IDE Framework
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//  Developed by DemeWebsolutions.com
//

import SwiftUI

@main
struct TruAiApp: App {
    @StateObject private var appState = AppState()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
        }
    }
}
