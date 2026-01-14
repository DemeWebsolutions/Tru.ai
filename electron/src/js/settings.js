/**
 * TruAi Desktop IDE - Settings Management
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_SETTINGS_V1_1
 */

// Model options per provider
const modelsByProvider = {
    openai: [
        { value: 'gpt-4', label: 'GPT-4' },
        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' }
    ],
    anthropic: [
        { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
        { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
        { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' }
    ],
    custom: [
        { value: 'custom-model', label: 'Custom Model' }
    ]
};

// Store for multiple API configurations
let apiConfigs = {};

function loadSettings() {
    // Load API configurations
    const savedConfigs = localStorage.getItem('truai-api-configs');
    if (savedConfigs) {
        try {
            apiConfigs = JSON.parse(savedConfigs);
        } catch (error) {
            console.error('Error loading API configs:', error);
            apiConfigs = {};
        }
    }
    
    // Load general settings
    const saved = localStorage.getItem('truai-settings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            
            // AI settings
            if (settings.apiProvider) {
                document.getElementById('aiProvider').value = settings.apiProvider;
                updateModelOptions(settings.apiProvider);
                
                // Load API key for current provider
                if (apiConfigs[settings.apiProvider]) {
                    document.getElementById('apiKey').value = apiConfigs[settings.apiProvider].apiKey || '';
                    document.getElementById('aiModel').value = apiConfigs[settings.apiProvider].model || modelsByProvider[settings.apiProvider][0].value;
                    document.getElementById('temperature').value = apiConfigs[settings.apiProvider].temperature || 0.7;
                    document.getElementById('temperatureValue').textContent = apiConfigs[settings.apiProvider].temperature || 0.7;
                    if (apiConfigs[settings.apiProvider].baseUrl) {
                        document.getElementById('baseUrl').value = apiConfigs[settings.apiProvider].baseUrl;
                    }
                }
            }
            
            // Editor settings
            if (settings.lineNumbers !== undefined) {
                document.getElementById('lineNumbers').checked = settings.lineNumbers;
            }
            if (settings.autoSave !== undefined) {
                document.getElementById('autoSave').checked = settings.autoSave;
            }
            
            // Theme
            if (settings.theme) {
                document.getElementById('theme').value = settings.theme;
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
}

function saveSettings() {
    const provider = document.getElementById('aiProvider').value;
    const apiKey = document.getElementById('apiKey').value;
    const model = document.getElementById('aiModel').value;
    const temperature = parseFloat(document.getElementById('temperature').value);
    const baseUrl = document.getElementById('baseUrl').value;
    
    // Validate API key
    if (!apiKey) {
        alert('Please enter an API key');
        return;
    }
    
    // Save API configuration for current provider
    apiConfigs[provider] = {
        apiKey: apiKey,
        model: model,
        temperature: temperature,
        baseUrl: baseUrl
    };
    
    localStorage.setItem('truai-api-configs', JSON.stringify(apiConfigs));
    
    // Save general settings
    const settings = {
        apiProvider: provider,
        apiKey: apiKey, // Keep for backward compatibility
        model: model,
        temperature: temperature,
        baseUrl: baseUrl,
        lineNumbers: document.getElementById('lineNumbers').checked,
        autoSave: document.getElementById('autoSave').checked,
        theme: document.getElementById('theme').value
    };
    
    localStorage.setItem('truai-settings', JSON.stringify(settings));
    
    alert(`Settings saved successfully for ${provider}!\n\nYou can now switch between providers without losing your configurations.`);
    
    // Update editor if needed
    if (window.updateEditorSettings) {
        updateEditorSettings();
    }
}

function updateModelOptions(provider) {
    const modelSelect = document.getElementById('aiModel');
    const models = modelsByProvider[provider] || [];
    
    modelSelect.innerHTML = '';
    models.forEach(model => {
        const option = document.createElement('option');
        option.value = model.value;
        option.textContent = model.label;
        modelSelect.appendChild(option);
    });
    
    // Load saved config for this provider
    if (apiConfigs[provider]) {
        document.getElementById('apiKey').value = apiConfigs[provider].apiKey || '';
        document.getElementById('aiModel').value = apiConfigs[provider].model || models[0].value;
        document.getElementById('temperature').value = apiConfigs[provider].temperature || 0.7;
        document.getElementById('temperatureValue').textContent = apiConfigs[provider].temperature || 0.7;
        if (apiConfigs[provider].baseUrl) {
            document.getElementById('baseUrl').value = apiConfigs[provider].baseUrl;
        }
    } else {
        // Clear fields for new provider
        document.getElementById('apiKey').value = '';
        document.getElementById('temperature').value = 0.7;
        document.getElementById('temperatureValue').textContent = '0.7';
        document.getElementById('baseUrl').value = '';
    }
    
    // Show/hide base URL for custom provider
    const baseUrlSetting = document.getElementById('baseUrlSetting');
    if (baseUrlSetting) {
        baseUrlSetting.style.display = provider === 'custom' ? 'block' : 'none';
    }
}

function setupSettingsListeners() {
    const saveBtn = document.getElementById('saveSettingsBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveSettings);
    }
    
    const providerSelect = document.getElementById('aiProvider');
    if (providerSelect) {
        providerSelect.addEventListener('change', (e) => {
            updateModelOptions(e.target.value);
        });
    }
    
    const temperatureSlider = document.getElementById('temperature');
    if (temperatureSlider) {
        temperatureSlider.addEventListener('input', (e) => {
            document.getElementById('temperatureValue').textContent = e.target.value;
        });
    }
    
    // Theme switcher
    const themeSelect = document.getElementById('theme');
    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            const theme = e.target.value;
            document.body.setAttribute('data-theme', theme);
            
            // Save theme immediately
            const settings = JSON.parse(localStorage.getItem('truai-settings') || '{}');
            settings.theme = theme;
            localStorage.setItem('truai-settings', JSON.stringify(settings));
            
            console.log('Theme changed to:', theme);
        });
    }
}

// Export settings API
window.settingsAPI = {
    initialize: initializeSettings,
    loadSettings: loadSettings,
    saveSettings: saveSettings
};

function initializeSettings() {
    console.log('Settings initializing...');
    setupSettingsListeners();
    loadSettings();
    console.log('Settings initialized');
}

function updateEditorSettings() {
    if (!monacoEditor) return;
    
    const settings = JSON.parse(localStorage.getItem('truai-settings') || '{}');
    
    monacoEditor.updateOptions({
        fontSize: settings.fontSize || 14,
        tabSize: settings.tabSize || 4,
        wordWrap: settings.wordWrap ? 'on' : 'off',
        minimap: { enabled: settings.minimap !== false },
        lineNumbers: settings.lineNumbers !== false ? 'on' : 'off'
    });
}

// Export
window.updateEditorSettings = updateEditorSettings;
window.loadSettings = loadSettings;
window.saveSettings = saveSettings;
