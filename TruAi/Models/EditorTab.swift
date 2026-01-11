//
//  EditorTab.swift
//  TruAi
//
//  Editor tab model for multi-tab code editing
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation

struct EditorTab: Identifiable, Hashable {
    let id: UUID
    var file: FileItem
    var content: String
    var isModified: Bool
    var cursorPosition: CursorPosition
    var scrollPosition: Double
    
    init(id: UUID = UUID(), file: FileItem, content: String = "") {
        self.id = id
        self.file = file
        self.content = content
        self.isModified = false
        self.cursorPosition = CursorPosition()
        self.scrollPosition = 0
    }
}

struct CursorPosition: Hashable {
    var line: Int = 1
    var column: Int = 1
}
