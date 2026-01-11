//
//  CommandPaletteView.swift
//  TruAi
//
//  Command palette (Cmd+Shift+P) view
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import SwiftUI

struct CommandPaletteView: View {
    @ObservedObject var viewModel: CommandPaletteViewModel
    
    var body: some View {
        VStack(spacing: 0) {
            // Search input
            HStack {
                Image(systemName: "magnifyingglass")
                    .foregroundColor(Color.truAiText)
                TextField("Type a command", text: $viewModel.searchText)
                    .textFieldStyle(PlainTextFieldStyle())
                    .foregroundColor(Color.truAiText)
            }
            .padding()
            .background(Color.truAiLightBackground)
            
            // Command list
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 0) {
                    ForEach(viewModel.filteredCommands) { command in
                        CommandRow(command: command) {
                            viewModel.executeCommand(command)
                        }
                    }
                }
            }
            .frame(maxHeight: 400)
        }
        .frame(width: 600)
        .background(Color.truAiDarkBackground)
        .cornerRadius(8)
        .shadow(radius: 20)
        .padding()
    }
}

struct CommandRow: View {
    let command: Command
    let onExecute: () -> Void
    
    var body: some View {
        Button(action: onExecute) {
            HStack {
                VStack(alignment: .leading) {
                    Text(command.title)
                        .font(.system(size: 14))
                        .foregroundColor(Color.truAiText)
                    Text(command.category.rawValue)
                        .font(.system(size: 12))
                        .foregroundColor(Color.truAiText.opacity(0.7))
                }
                Spacer()
                if let shortcut = command.shortcut {
                    Text(shortcut)
                        .font(.system(size: 12))
                        .foregroundColor(Color.truAiText.opacity(0.7))
                }
            }
            .padding()
        }
        .buttonStyle(PlainButtonStyle())
    }
}
