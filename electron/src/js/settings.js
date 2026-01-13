/**
 * TruAi Desktop IDE - Settings Management
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_SETTINGS_V1
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

function loadSettings() {
    const saved = localStorage.getItem('truai-settings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            
            // AI settings
            if (settings.apiProvider) {
                document.getElementById('aiProvider').value = settings.apiProvider;
                updateModelOptions(settings.apiProvider);
            }
            if (settings.apiKey) {
                document.getElementById('apiKey').value = settings.apiKey;
            }
            if (settings.model) {
                document.getElementById('aiModel').value = settings.model;
            }
            if (settings.temperature !== undefined) {
                document.getElementById('temperature').value = settings.temperature;
                document.getElementById('temperatureValue').textContent = settings.temperature;
            }
            if (settings.baseUrl) {
                document.getElementById('baseUrl').value = settings.baseUrl;
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
    const settings = {
        apiProvider: document.getElementById('aiProvider').value,
        apiKey: document.getElementById('apiKey').value,
        model: document.getElementById('aiModel').value,
        temperature: parseFloat(document.getElementById('temperature').value),
        baseUrl: document.getElementById('baseUrl').value,
        lineNumbers: document.getElementById('lineNumbers').checked,
        autoSave: document.getElementById('autoSave').checked,
        theme: document.getElementById('theme').value
    };
    
    // Validate API key
    if (!settings.apiKey) {
        alert('Please enter an API key');
        return;
    }
    
    localStorage.setItem('truai-settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
    
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
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setupSettingsListeners();
        loadSettings();
    });
} else {
    setupSettingsListeners();
    loadSettings();
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
