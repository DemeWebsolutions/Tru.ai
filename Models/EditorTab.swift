//
//  EditorTab.swift
//  TruAi
//
//  Editor tab model for managing open files
//

import Foundation

struct EditorTab: Identifiable, Hashable {
    let id: String
    let fileItem: FileItem
    var content: String
    var cursorPosition: TextPosition
    var isModified: Bool
    var isActive: Bool
    
    init(id: String = UUID().uuidString,
         fileItem: FileItem,
         content: String = "",
         cursorPosition: TextPosition = TextPosition(line: 1, column: 1),
         isModified: Bool = false,
         isActive: Bool = false) {
        self.id = id
        self.fileItem = fileItem
        self.content = content
        self.cursorPosition = cursorPosition
        self.isModified = isModified
        self.isActive = isActive
    }
    
    var displayName: String {
        isModified ? "\(fileItem.name) •" : fileItem.name
    }
}

struct TextPosition: Hashable, Codable {
    var line: Int
    var column: Int
    
    init(line: Int, column: Int) {
        self.line = max(1, line)
        self.column = max(1, column)
    }
}
