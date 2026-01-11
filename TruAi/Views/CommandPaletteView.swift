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
                TextField("Type a command", text: $viewModel.searchText)
                    .textFieldStyle(PlainTextFieldStyle())
            }
            .padding()
            .background(Color(UIColor.secondarySystemBackground))
            
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
        .background(Color(UIColor.systemBackground))
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
                    Text(command.category.rawValue)
                        .font(.system(size: 12))
                        .foregroundColor(.gray)
                }
                Spacer()
                if let shortcut = command.shortcut {
                    Text(shortcut)
                        .font(.system(size: 12))
                        .foregroundColor(.gray)
                }
            }
            .padding()
        }
        .buttonStyle(PlainButtonStyle())
    }
}
