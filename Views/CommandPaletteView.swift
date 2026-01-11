//
//  CommandPaletteView.swift
//  TruAi
//
//  Command palette view (Cmd+Shift+P)
//

import SwiftUI

struct CommandPaletteView: View {
    @ObservedObject var viewModel: CommandPaletteViewModel
    @FocusState private var isFocused: Bool
    
    var body: some View {
        if viewModel.isVisible {
            ZStack {
                Color.black.opacity(0.3)
                    .ignoresSafeArea()
                    .onTapGesture {
                        viewModel.hide()
                    }
                
                VStack {
                    Spacer()
                    
                    VStack(alignment: .leading, spacing: 0) {
                        // Search input
                        HStack {
                            Image(systemName: "magnifyingglass")
                                .foregroundColor(.secondary)
                            TextField("Type a command name...", text: $viewModel.searchText)
                                .textFieldStyle(.plain)
                                .focused($isFocused)
                                .onAppear {
                                    isFocused = true
                                }
                        }
                        .padding()
                        .background(Color(.systemBackground))
                        
                        Divider()
                        
                        // Command list
                        ScrollView {
                            VStack(alignment: .leading, spacing: 0) {
                                ForEach(Array(viewModel.filteredCommands.enumerated()), id: \.element.id) { index, command in
                                    CommandRowView(
                                        command: command,
                                        isSelected: index == viewModel.selectedIndex
                                    )
                                    .onTapGesture {
                                        viewModel.selectedIndex = index
                                        viewModel.executeSelected()
                                    }
                                }
                            }
                        }
                        .frame(maxHeight: 400)
                        .background(Color(.systemBackground))
                    }
                    .frame(width: 600)
                    .cornerRadius(8)
                    .shadow(radius: 20)
                    
                    Spacer()
                }
                .padding()
            }
            .onAppear {
                isFocused = true
            }
            .onKeyPress(.escape) {
                viewModel.hide()
                return .handled
            }
            .onKeyPress(.return) {
                viewModel.executeSelected()
                return .handled
            }
            .onKeyPress(.upArrow) {
                viewModel.moveSelection(direction: -1)
                return .handled
            }
            .onKeyPress(.downArrow) {
                viewModel.moveSelection(direction: 1)
                return .handled
            }
        }
    }
}

struct CommandRowView: View {
    let command: Command
    let isSelected: Bool
    
    var body: some View {
        HStack {
            if let icon = command.icon {
                Image(systemName: icon)
                    .frame(width: 20)
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text(command.title)
                    .font(.system(size: 14))
                Text(command.category.rawValue)
                    .font(.system(size: 11))
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            if let shortcut = command.shortcut {
                Text(shortcut.displayString)
                    .font(.system(size: 11))
                    .foregroundColor(.secondary)
                    .padding(.horizontal, 6)
                    .padding(.vertical, 2)
                    .background(Color(.systemGray5))
                    .cornerRadius(4)
            }
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
        .background(isSelected ? Color.blue.opacity(0.2) : Color.clear)
        .contentShape(Rectangle())
    }
}
