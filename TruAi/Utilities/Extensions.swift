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
    // Custom Tru.ai Color Scheme
    static let truAiText = Color(hex: "#ffffff")
    static let truAiLightBackground = Color(hex: "#737373") // Primary, header, footer
    static let truAiDarkBackground = Color(hex: "#000000")
    static let truAiMediumBackground = Color(hex: "#3A3A3A")
    
    // Legacy mappings for compatibility
    static let editorBackground = Color.truAiDarkBackground
    static let editorText = Color.truAiText
    static let editorLineNumbers = Color.truAiText.opacity(0.6)
    
    // Hex color initializer
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
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
