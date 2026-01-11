//
//  StatusBarView.swift
//  TruAi
//
//  Status bar showing file info, Git branch, cursor position
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import SwiftUI

struct StatusBarView: View {
    let currentFile: String?
    let cursorPosition: CursorPosition?
    let gitBranch: String?
    
    var body: some View {
        HStack(spacing: 16) {
            // Git branch
            if let branch = gitBranch {
                HStack(spacing: 4) {
                    Image(systemName: "arrow.triangle.branch")
                        .font(.system(size: 12))
                    Text(branch)
                        .font(.system(size: 12))
                }
            }
            
            // Current file
            if let file = currentFile {
                Text(file)
                    .font(.system(size: 12))
            }
            
            Spacer()
            
            // Cursor position
            if let position = cursorPosition {
                Text("Ln \(position.line), Col \(position.column)")
                    .font(.system(size: 12))
            }
            
            // Encoding
            Text("UTF-8")
                .font(.system(size: 12))
            
            // Line ending
            Text("LF")
                .font(.system(size: 12))
        }
        .padding(.horizontal)
        .padding(.vertical, 4)
        .background(Color.truAiLightBackground)
        .foregroundColor(Color.truAiText)
    }
}
