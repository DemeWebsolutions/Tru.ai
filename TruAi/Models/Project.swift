//
//  Project.swift
//  TruAi
//
//  Project model for workspace management
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation

struct Project: Identifiable, Codable {
    let id: UUID
    var name: String
    var path: String
    var type: ProjectType
    var lastOpened: Date
    var settings: ProjectSettings
    
    init(id: UUID = UUID(), name: String, path: String, type: ProjectType = .general) {
        self.id = id
        self.name = name
        self.path = path
        self.type = type
        self.lastOpened = Date()
        self.settings = ProjectSettings()
    }
}

enum ProjectType: String, Codable {
    case swift
    case javascript
    case python
    case web
    case general
}

struct ProjectSettings: Codable {
    var autoFormat: Bool = true
    var lintOnSave: Bool = true
    var gitEnabled: Bool = true
    var excludedPaths: [String] = ["node_modules", ".git", "build"]
}
