//
//  TerminalView.swift
//  TruAi
//
//  Terminal view for command execution
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import SwiftUI

struct TerminalView: View {
    @State private var commandInput: String = ""
    @State private var output: [String] = ["Tru.ai Terminal v1.0", "Type 'help' for available commands"]
    
    var body: some View {
        VStack(spacing: 0) {
            // Terminal output
            ScrollView {
                VStack(alignment: .leading, spacing: 4) {
                    ForEach(output.indices, id: \.self) { index in
                        Text(output[index])
                            .font(.system(size: 12, design: .monospaced))
                            .foregroundColor(Color.truAiText)
                    }
                }
                .padding()
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .background(Color.truAiDarkBackground)
            
            // Command input
            HStack {
                Text("$")
                    .font(.system(size: 12, design: .monospaced))
                    .foregroundColor(Color.truAiText)
                TextField("Enter command", text: $commandInput, onCommit: executeCommand)
                    .font(.system(size: 12, design: .monospaced))
                    .foregroundColor(Color.truAiText)
                    .textFieldStyle(PlainTextFieldStyle())
            }
            .padding()
            .background(Color.truAiDarkBackground)
        }
    }
    
    private func executeCommand() {
        guard !commandInput.isEmpty else { return }
        
        output.append("$ \(commandInput)")
        
        // Simulate command execution
        switch commandInput.lowercased() {
        case "help":
            output.append("Available commands: help, clear, ls, pwd")
        case "clear":
            output = []
        case "ls":
            output.append("file1.swift  file2.swift  README.md")
        case "pwd":
            output.append(NSHomeDirectory())
        default:
            output.append("Command not found: \(commandInput)")
        }
        
        commandInput = ""
    }
}
