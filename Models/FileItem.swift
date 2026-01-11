//
//  FileItem.swift
//  TruAi
//
//  File system item model for file explorer
//

import Foundation

struct FileItem: Identifiable, Hashable, Codable {
    let id: String
    let name: String
    let path: String
    let type: FileType
    let size: Int64?
    let modifiedDate: Date?
    var isExpanded: Bool
    var children: [FileItem]?
    
    init(id: String = UUID().uuidString,
         name: String,
         path: String,
         type: FileType,
         size: Int64? = nil,
         modifiedDate: Date? = nil,
         isExpanded: Bool = false,
         children: [FileItem]? = nil) {
        self.id = id
        self.name = name
        self.path = path
        self.type = type
        self.size = size
        self.modifiedDate = modifiedDate
        self.isExpanded = isExpanded
        self.children = children
    }
    
    var isDirectory: Bool {
        type == .directory
    }
    
    var icon: String {
        switch type {
        case .directory:
            return "folder.fill"
        case .swift:
            return "swift"
        case .javascript, .typescript:
            return "curlybraces"
        case .python:
            return "python"
        case .html:
            return "doc.text"
        case .css:
            return "paintbrush.fill"
        case .json:
            return "curlybraces.square"
        case .markdown:
            return "doc.richtext"
        case .image:
            return "photo.fill"
        case .text:
            return "doc.text.fill"
        default:
            return "doc"
        }
    }
}

enum FileType: String, Codable {
    case directory
    case swift
    case javascript
    case typescript
    case python
    case html
    case css
    case json
    case markdown
    case image
    case text
    case other
    
    init(from fileExtension: String) {
        switch fileExtension.lowercased() {
        case "swift":
            self = .swift
        case "js", "jsx":
            self = .javascript
        case "ts", "tsx":
            self = .typescript
        case "py":
            self = .python
        case "html", "htm":
            self = .html
        case "css":
            self = .css
        case "json":
            self = .json
        case "md", "markdown":
            self = .markdown
        case "jpg", "jpeg", "png", "gif", "svg", "webp":
            self = .image
        case "txt":
            self = .text
        default:
            self = .other
        }
    }
}
