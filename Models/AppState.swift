//
//  AppState.swift
//  TruAi
//
//  Global application state management
//

import Foundation
import SwiftUI

class AppState: ObservableObject {
    @Published var isAuthenticated: Bool = false
    @Published var currentUser: User?
    @Published var isLoading: Bool = false
    @Published var errorMessage: String?
    @Published var theme: AppTheme = .dark
    
    init() {
        loadUserPreferences()
    }
    
    private func loadUserPreferences() {
        // Load saved preferences
        if let themeRaw = UserDefaults.standard.string(forKey: "appTheme"),
           let theme = AppTheme(rawValue: themeRaw) {
            self.theme = theme
        }
    }
    
    func setTheme(_ theme: AppTheme) {
        self.theme = theme
        UserDefaults.standard.set(theme.rawValue, forKey: "appTheme")
    }
}

enum AppTheme: String, CaseIterable {
    case light = "light"
    case dark = "dark"
    case system = "system"
}
