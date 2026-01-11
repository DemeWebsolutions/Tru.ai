//
//  ActivityBarView.swift
//  TruAi
//
//  Activity bar with panel navigation
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import SwiftUI

struct ActivityBarView: View {
    @Binding var selectedPanel: PanelType
    
    var body: some View {
        VStack(spacing: 16) {
            ActivityBarButton(
                icon: "folder",
                isSelected: selectedPanel == .explorer,
                action: { selectedPanel = .explorer }
            )
            
            ActivityBarButton(
                icon: "magnifyingglass",
                isSelected: selectedPanel == .search,
                action: { selectedPanel = .search }
            )
            
            ActivityBarButton(
                icon: "arrow.triangle.branch",
                isSelected: selectedPanel == .git,
                action: { selectedPanel = .git }
            )
            
            ActivityBarButton(
                icon: "play.circle",
                isSelected: selectedPanel == .debug,
                action: { selectedPanel = .debug }
            )
            
            ActivityBarButton(
                icon: "square.grid.2x2",
                isSelected: selectedPanel == .extensions,
                action: { selectedPanel = .extensions }
            )
            
            ActivityBarButton(
                icon: "brain",
                isSelected: selectedPanel == .ai,
                action: { selectedPanel = .ai }
            )
            
            Spacer()
            
            // Settings button at bottom
            ActivityBarButton(
                icon: "gearshape",
                isSelected: false,
                action: { }
            )
        }
        .padding(.vertical, 16)
        .background(Color(UIColor.secondarySystemBackground))
    }
}

struct ActivityBarButton: View {
    let icon: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Image(systemName: icon)
                .font(.system(size: 24))
                .foregroundColor(isSelected ? .blue : .gray)
                .frame(width: 48, height: 48)
        }
        .buttonStyle(PlainButtonStyle())
    }
}
