//
//  ContentView.swift
//  TruAi
//
//  Main content view - entry point for the app
//  © 2013 - Present My Deme, LLC. All Rights Reserved.
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        IDELayoutView()
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(AppState())
    }
}
