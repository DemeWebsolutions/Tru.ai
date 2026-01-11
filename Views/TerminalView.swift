//
//  TerminalView.swift
//  TruAi
//
//  Terminal/shell view
//

import SwiftUI

struct TerminalView: View {
    @State private var commandHistory: [String] = []
    @State private var currentCommand: String = ""
    @State private var output: [TerminalLine] = []
    @State private var currentDirectory: String = "/"
    
    var body: some View {
        VStack(spacing: 0) {
            // Terminal header
            HStack {
                Text("Terminal")
                    .font(.headline)
                Spacer()
                Button(action: clearTerminal) {
                    Image(systemName: "trash")
                        .font(.system(size: 14))
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 8)
            .background(Color(.systemGray6))
            
            // Terminal output
            ScrollView {
                VStack(alignment: .leading, spacing: 4) {
                    ForEach(output) { line in
                        TerminalLineView(line: line)
                    }
                    
                    // Command input line
                    HStack {
                        Text("$")
                            .foregroundColor(.green)
                        TextField("Enter command...", text: $currentCommand)
                            .textFieldStyle(.plain)
                            .font(.system(size: 14, design: .monospaced))
                            .onSubmit {
                                executeCommand()
                            }
                    }
                    .padding(.horizontal)
                }
                .padding(.vertical, 4)
            }
            .background(Color.black)
            .foregroundColor(.green)
            .font(.system(size: 14, design: .monospaced))
        }
    }
    
    private func executeCommand() {
        guard !currentCommand.trimmingCharacters(in: .whitespaces).isEmpty else { return }
        
        let command = currentCommand
        commandHistory.append(command)
        output.append(TerminalLine(type: .command, text: "$ \(command)"))
        
        // Simulate command execution
        let result = simulateCommand(command)
        output.append(TerminalLine(type: .output, text: result))
        
        currentCommand = ""
    }
    
    private func simulateCommand(_ command: String) -> String {
        let parts = command.components(separatedBy: .whitespaces)
        guard let cmd = parts.first else { return "" }
        
        switch cmd.lowercased() {
        case "pwd":
            return currentDirectory
        case "ls", "dir":
            return "file1.swift\nfile2.swift\nfolder1"
        case "echo":
            return parts.dropFirst().joined(separator: " ")
        case "clear":
            clearTerminal()
            return ""
        default:
            return "Command not found: \(cmd)"
        }
    }
    
    private func clearTerminal() {
        output = []
    }
}

struct TerminalLine: Identifiable {
    let id = UUID()
    let type: TerminalLineType
    let text: String
}

enum TerminalLineType {
    case command
    case output
    case error
}

struct TerminalLineView: View {
    let line: TerminalLine
    
    var body: some View {
        Text(line.text)
            .foregroundColor(colorForType(line.type))
            .padding(.horizontal)
    }
    
    private func colorForType(_ type: TerminalLineType) -> Color {
        switch type {
        case .command:
            return .green
        case .output:
            return .white
        case .error:
            return .red
        }
    }
}
