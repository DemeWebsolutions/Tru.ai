/**
 * TruAi Desktop IDE - Settings Management
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_SETTINGS_V1
 */

// Settings module - already integrated in app.js
// This file can be used for additional settings functionality

function updateEditorSettings() {
    if (!monacoEditor) return;
    
    const settings = appState.settings;
    
    monacoEditor.updateOptions({
        fontSize: settings.fontSize || 14,
        tabSize: settings.tabSize || 4,
        wordWrap: settings.wordWrap ? 'on' : 'off',
        minimap: { enabled: settings.minimap !== false }
    });
}

// Export
window.updateEditorSettings = updateEditorSettings;
