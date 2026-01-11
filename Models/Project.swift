//
//  Project.swift
//  TruAi
//
//  Project model for managing workspace/projects
//

import Foundation

struct Project: Identifiable, Codable {
    let id: String
    var name: String
    var rootPath: String
    var files: [FileItem]
    var createdAt: Date
    var lastOpened: Date
    var settings: ProjectSettings
    
    init(id: String = UUID().uuidString,
         name: String,
         rootPath: String,
         files: [FileItem] = [],
         createdAt: Date = Date(),
         lastOpened: Date = Date(),
         settings: ProjectSettings = ProjectSettings()) {
        self.id = id
        self.name = name
        self.rootPath = rootPath
        self.files = files
        self.createdAt = createdAt
        self.lastOpened = lastOpened
        self.settings = settings
    }
}

struct ProjectSettings: Codable {
    var indentSize: Int = 4
    var useTabs: Bool = false
    var lineEndings: LineEnding = .lf
    var encoding: String = "utf-8"
    var autoSave: Bool = true
    var wordWrap: Bool = true
    var fontSize: Int = 14
    var fontFamily: String = "SF Mono"
}

enum LineEnding: String, Codable {
    case lf = "\n"
    case crlf = "\r\n"
    case cr = "\r"
}
