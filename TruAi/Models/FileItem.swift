//
//  FileItem.swift
//  TruAi
//
//  File system item model for file explorer
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import Foundation

struct FileItem: Identifiable, Hashable {
    let id: UUID
    var name: String
    var path: String
    var isDirectory: Bool
    var children: [FileItem]?
    var size: Int64?
    var modifiedDate: Date?
    var isExpanded: Bool
    
    init(id: UUID = UUID(), name: String, path: String, isDirectory: Bool, isExpanded: Bool = false) {
        self.id = id
        self.name = name
        self.path = path
        self.isDirectory = isDirectory
        self.isExpanded = isExpanded
        
        if isDirectory {
            self.children = []
        }
    }
    
    var fileType: String {
        if isDirectory {
            return "folder"
        }
        let ext = (name as NSString).pathExtension.lowercased()
        return ext.isEmpty ? "file" : ext
    }
    
    var icon: String {
        if isDirectory {
            return isExpanded ? "folder.fill" : "folder"
        }
        
        switch fileType {
        case "swift": return "swift"
        case "js", "ts": return "doc.text"
        case "json": return "curlybraces"
        case "md": return "doc.richtext"
        case "png", "jpg", "jpeg": return "photo"
        default: return "doc"
        }
    }
}
