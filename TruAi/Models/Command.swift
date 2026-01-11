//
//  Command.swift
//  TruAi
//
//  Command palette command model
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation

struct Command: Identifiable {
    let id: UUID
    var title: String
    var category: CommandCategory
    var shortcut: String?
    var action: () -> Void
    
    init(id: UUID = UUID(), title: String, category: CommandCategory, shortcut: String? = nil, action: @escaping () -> Void) {
        self.id = id
        self.title = title
        self.category = category
        self.shortcut = shortcut
        self.action = action
    }
}

enum CommandCategory: String, CaseIterable {
    case file = "File"
    case edit = "Edit"
    case view = "View"
    case go = "Go"
    case run = "Run"
    case terminal = "Terminal"
    case git = "Git"
    case ai = "AI"
    case help = "Help"
}
