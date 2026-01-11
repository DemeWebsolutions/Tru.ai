//
//  Extensions.swift
//  TruAi
//
//  Utility extensions
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import SwiftUI

// MARK: - String Extensions
extension String {
    var fileExtension: String {
        return (self as NSString).pathExtension
    }
    
    var fileName: String {
        return (self as NSString).lastPathComponent
    }
    
    var directoryPath: String {
        return (self as NSString).deletingLastPathComponent
    }
    
    func lineCount() -> Int {
        return self.components(separatedBy: .newlines).count
    }
}

// MARK: - Color Extensions
extension Color {
    static let editorBackground = Color(UIColor.systemBackground)
    static let editorText = Color(UIColor.label)
    static let editorLineNumbers = Color(UIColor.secondaryLabel)
}

// MARK: - View Extensions
extension View {
    func cornerRadius(_ radius: CGFloat, corners: UIRectCorner) -> some View {
        clipShape(RoundedCorner(radius: radius, corners: corners))
    }
}

struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners
    
    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(
            roundedRect: rect,
            byRoundingCorners: corners,
            cornerRadii: CGSize(width: radius, height: radius)
        )
        return Path(path.cgPath)
    }
}

// MARK: - FileItem Extensions
extension FileItem {
    static func mockFiles() -> [FileItem] {
        return [
            FileItem(name: "TruAi", path: "/TruAi", isDirectory: true, isExpanded: true),
            FileItem(name: "Models", path: "/TruAi/Models", isDirectory: true),
            FileItem(name: "Services", path: "/TruAi/Services", isDirectory: true),
            FileItem(name: "Views", path: "/TruAi/Views", isDirectory: true),
            FileItem(name: "README.md", path: "/TruAi/README.md", isDirectory: false),
        ]
    }
}
