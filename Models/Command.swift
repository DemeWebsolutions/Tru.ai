//
//  Command.swift
//  TruAi
//
//  Command palette command model
//

import Foundation

struct Command: Identifiable, Hashable {
    let id: String
    let title: String
    let category: CommandCategory
    let icon: String?
    let shortcut: KeyboardShortcut?
    let action: () -> Void
    
    init(id: String = UUID().uuidString,
         title: String,
         category: CommandCategory,
         icon: String? = nil,
         shortcut: KeyboardShortcut? = nil,
         action: @escaping () -> Void) {
        self.id = id
        self.title = title
        self.category = category
        self.icon = icon
        self.shortcut = shortcut
        self.action = action
    }
    
    func hash(into hasher: inout Hasher) {
        hasher.combine(id)
    }
    
    static func == (lhs: Command, rhs: Command) -> Bool {
        lhs.id == rhs.id
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
    case help = "Help"
    case ai = "AI"
}

struct KeyboardShortcut: Hashable {
    let key: String
    let modifiers: [KeyModifier]
    
    var displayString: String {
        let mods = modifiers.map { $0.displayString }.joined()
        return "\(mods)\(key)"
    }
}

enum KeyModifier: String {
    case command = "⌘"
    case shift = "⇧"
    case option = "⌥"
    case control = "⌃"
    
    var displayString: String {
        return self.rawValue
    }
}
