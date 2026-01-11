//
//  ActivityBarView.swift
//  TruAi
//
//  Activity bar (left side) with icons for different panels
//

import SwiftUI

enum ActivityPanel: String, CaseIterable {
    case explorer = "Explorer"
    case search = "Search"
    case git = "Source Control"
    case debug = "Run and Debug"
    case extensions = "Extensions"
    case ai = "Tru.ai"
    
    var icon: String {
        switch self {
        case .explorer: return "folder.fill"
        case .search: return "magnifyingglass"
        case .git: return "square.stack.3d.up.fill"
        case .debug: return "play.fill"
        case .extensions: return "puzzlepiece.extension.fill"
        case .ai: return "brain.head.profile"
        }
    }
}

struct ActivityBarView: View {
    @Binding var selectedPanel: ActivityPanel
    let onPanelSelected: (ActivityPanel) -> Void
    
    var body: some View {
        VStack(spacing: 0) {
            ForEach(ActivityPanel.allCases, id: \.self) { panel in
                Button(action: {
                    selectedPanel = panel
                    onPanelSelected(panel)
                }) {
                    Image(systemName: panel.icon)
                        .font(.system(size: 20))
                        .foregroundColor(selectedPanel == panel ? .white : .secondary)
                        .frame(width: 48, height: 48)
                        .background(selectedPanel == panel ? Color.blue : Color.clear)
                        .cornerRadius(4)
                }
                .buttonStyle(.plain)
            }
            
            Spacer()
            
            // Settings button at bottom
            Button(action: {
                // Open settings
            }) {
                Image(systemName: "gearshape.fill")
                    .font(.system(size: 20))
                    .foregroundColor(.secondary)
                    .frame(width: 48, height: 48)
            }
            .buttonStyle(.plain)
        }
        .frame(width: 48)
        .background(Color(.systemGray6))
    }
}
