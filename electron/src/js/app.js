/**
 * TruAi Desktop IDE - Main Application Logic
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_APP_LOGIC_V1_1
 */

// Use electronAPI from preload bridge
const electronAPI = window.electronAPI;

// Global state
let appState = {
    currentWorkspace: null,
    openFiles: [],
    activeFile: null,
    settings: {},
    terminalId: null
};

// Export appAPI to be called by renderer.js
window.appAPI = {
    initialize: initializeApp,
    applyTheme: applyTheme
};

// Initialize app
async function initializeApp() {
    console.log('App.js initializing...');
    await loadSettings();
    applyTheme(); // Apply theme on startup
    console.log('App.js initialization complete');
}

// Load settings
async function loadSettings() {
    try {
        const saved = localStorage.getItem('truai-settings');
        if (saved) {
            appState.settings = JSON.parse(saved);
            applySettings();
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Apply settings to UI
function applySettings() {
    const settings = appState.settings;
    // Settings are applied by individual modules
}

// Apply theme
function applyTheme() {
    const theme = appState.settings.theme || 'dark';
    document.body.setAttribute('data-theme', theme);
    
    // Update theme selector if exists
    const themeSelect = document.getElementById('theme');
    if (themeSelect) {
        themeSelect.value = theme;
    }
    
    console.log('Theme applied:', theme);
}
