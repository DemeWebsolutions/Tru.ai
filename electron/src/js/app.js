/**
 * TruAi Desktop IDE - Main Application Logic
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_APP_LOGIC_V1
 */

const { ipcRenderer } = require('electron');
const path = require('path');

// Global state
let appState = {
    currentWorkspace: null,
    openFiles: [],
    activeFile: null,
    settings: {},
    terminalId: null
};

// Initialize app
document.addEventListener('DOMContentLoaded', async () => {
    await loadSettings();
    setupEventListeners();
    setupKeyboardShortcuts();
    initializeMonaco();
    loadContentsPanel(); // Load contents panel on startup
    
    // Setup AI input listeners when AI panel is shown
    if (window.setupAIInputListeners) {
        setupAIInputListeners();
    }
});

// Load settings
async function loadSettings() {
    const result = await ipcRenderer.invoke('get-settings');
    if (result.success) {
        appState.settings = result.settings || {};
        applySettings();
    }
}

// Apply settings to UI
function applySettings() {
    const settings = appState.settings;
    if (settings.apiKey) {
        document.getElementById('api-key-input').value = settings.apiKey;
    }
    if (settings.apiProvider) {
        document.getElementById('api-provider').value = settings.apiProvider;
    }
    if (settings.model) {
        document.getElementById('ai-model').value = settings.model;
    }
    if (settings.temperature !== undefined) {
        document.getElementById('temperature-slider').value = settings.temperature;
        document.getElementById('temperature-value').textContent = settings.temperature;
    }
    if (settings.fontSize) {
        document.getElementById('font-size').value = settings.fontSize;
    }
    if (settings.tabSize) {
        document.getElementById('tab-size').value = settings.tabSize;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Activity bar
    document.querySelectorAll('.activity-icon').forEach(icon => {
        icon.addEventListener('click', (e) => {
            const panel = e.currentTarget.dataset.panel;
            if (panel) {
                switchPanel(panel);
            }
        });
    });

    // Settings icon
    document.getElementById('settings-icon').addEventListener('click', () => {
        showSettings();
    });

    // Settings modal
    document.getElementById('close-settings').addEventListener('click', hideSettings);
    document.getElementById('save-settings-btn').addEventListener('click', saveSettings);
    document.getElementById('cancel-settings-btn').addEventListener('click', hideSettings);

    // Temperature slider
    document.getElementById('temperature-slider').addEventListener('input', (e) => {
        document.getElementById('temperature-value').textContent = e.target.value;
    });

    // AI panel
    document.getElementById('close-ai-panel').addEventListener('click', () => {
        document.getElementById('ai-panel-overlay').style.display = 'none';
    });

    // Panel tabs
    document.querySelectorAll('.panel-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.panel-tab-content').forEach(c => {
                c.classList.remove('active');
                c.style.display = 'none';
            });
            tab.classList.add('active');
            const content = document.getElementById(`${tabName}-tab`);
            if (content) {
                content.classList.add('active');
                content.style.display = 'block';
            }
        });
    });

    // Terminal
    document.getElementById('close-terminal').addEventListener('click', () => {
        document.getElementById('terminal').style.display = 'none';
    });

    // Chat input
    document.getElementById('send-chat-btn').addEventListener('click', sendChatMessage);
    document.getElementById('chat-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });

    // New file button
    document.getElementById('new-file-btn').addEventListener('click', createNewFile);
}

// Switch panel
function switchPanel(panel) {
    document.querySelectorAll('.activity-icon').forEach(icon => {
        icon.classList.remove('active');
    });
    document.querySelector(`[data-panel="${panel}"]`).classList.add('active');

    const sidebarTitle = document.getElementById('sidebar-title');
    const sidebarContent = document.getElementById('sidebar-content');

    switch(panel) {
        case 'explorer':
            sidebarTitle.textContent = 'Explorer';
            loadFileExplorer();
            break;
        case 'search':
            sidebarTitle.textContent = 'Search';
            loadSearchPanel();
            break;
        case 'git':
            sidebarTitle.textContent = 'Source Control';
            loadGitPanel();
            break;
        case 'debug':
            sidebarTitle.textContent = 'Run and Debug';
            sidebarContent.innerHTML = '<div style="padding: 16px; color: #858585;">Run and Debug panel</div>';
            break;
        case 'extensions':
            sidebarTitle.textContent = 'Extensions';
            sidebarContent.innerHTML = '<div style="padding: 16px; color: #858585;">Extensions panel</div>';
            break;
        case 'ai':
            sidebarTitle.textContent = 'Tru.ai';
            sidebarContent.innerHTML = '<div style="padding: 16px; color: #858585;">AI Assistant panel</div>';
            // Show AI panel as overlay
            const aiOverlay = document.getElementById('ai-panel-overlay');
            if (aiOverlay) {
                aiOverlay.style.display = 'flex';
                // Setup AI input listeners when panel is shown
                if (window.setupAIInputListeners) {
                    setTimeout(() => setupAIInputListeners(), 100);
                }
                // Setup agents when panel is shown
                if (window.setupAgents) {
                    setTimeout(() => setupAgents(), 100);
                }
            }
            break;
    }
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Command Palette: Cmd+Shift+P
        if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'P') {
            e.preventDefault();
            showCommandPalette();
        }

        // Toggle Terminal: Cmd+`
        if ((e.metaKey || e.ctrlKey) && e.key === '`') {
            e.preventDefault();
            toggleTerminal();
        }

        // Save: Cmd+S
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
            e.preventDefault();
            saveCurrentFile();
        }

        // New File: Cmd+N
        if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
            e.preventDefault();
            createNewFile();
        }

        // Open File: Cmd+O
        if ((e.metaKey || e.ctrlKey) && e.key === 'o') {
            e.preventDefault();
            openFile();
        }

        // Close Tab: Cmd+W
        if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
            e.preventDefault();
            closeCurrentTab();
        }
    });
}

// Settings
function showSettings() {
    document.getElementById('settings-modal').style.display = 'flex';
}

function hideSettings() {
    document.getElementById('settings-modal').style.display = 'none';
}

async function saveSettings() {
    const settings = {
        apiKey: document.getElementById('api-key-input').value,
        apiProvider: document.getElementById('api-provider').value,
        model: document.getElementById('ai-model').value,
        temperature: parseFloat(document.getElementById('temperature-slider').value),
        apiBaseUrl: document.getElementById('api-base-url').value,
        fontSize: parseInt(document.getElementById('font-size').value),
        tabSize: parseInt(document.getElementById('tab-size').value),
        wordWrap: document.getElementById('word-wrap').checked,
        minimap: document.getElementById('minimap').checked,
        terminalShell: document.getElementById('terminal-shell').value
    };

    const result = await ipcRenderer.invoke('save-settings', settings);
    if (result.success) {
        appState.settings = settings;
        applySettings();
        hideSettings();
        alert('Settings saved successfully!');
    }
}

// Command Palette
function showCommandPalette() {
    const palette = document.getElementById('command-palette');
    palette.style.display = 'block';
    document.getElementById('command-input').focus();
    loadCommands();
}

function loadCommands() {
    const commands = [
        { label: 'File: New File', shortcut: 'Cmd+N', action: () => createNewFile() },
        { label: 'File: Open File', shortcut: 'Cmd+O', action: () => openFile() },
        { label: 'File: Save', shortcut: 'Cmd+S', action: () => saveCurrentFile() },
        { label: 'View: Toggle Terminal', shortcut: 'Cmd+`', action: () => toggleTerminal() },
        { label: 'View: Toggle AI Panel', shortcut: 'Cmd+Shift+A', action: () => toggleAIPanel() },
        { label: 'Settings: Open Settings', shortcut: 'Cmd+,', action: () => showSettings() }
    ];

    const commandList = document.getElementById('command-list');
    commandList.innerHTML = '';

    commands.forEach((cmd, index) => {
        const item = document.createElement('div');
        item.className = 'command-item';
        if (index === 0) item.classList.add('selected');
        item.innerHTML = `
            <span>${cmd.label}</span>
            <span class="command-shortcut">${cmd.shortcut}</span>
        `;
        item.addEventListener('click', () => {
            cmd.action();
            document.getElementById('command-palette').style.display = 'none';
        });
        commandList.appendChild(item);
    });
}

// Export functions for other modules
window.appState = appState;
window.switchPanel = switchPanel;
window.showSettings = showSettings;
window.hideSettings = hideSettings;
