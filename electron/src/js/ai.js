/**
 * TruAi Desktop IDE - AI Integration
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_AI_INTEGRATION_V1
 */

const { ipcRenderer } = require('electron');

let chatHistory = [];

// Auto-resize textarea
function autoResizeTextarea() {
    const input = document.getElementById('chat-input');
    if (!input) return;
    
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 200) + 'px';
}

// Handle Enter key (Shift+Enter for new line, Enter to send)
function handleChatInputKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendChatMessage();
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Check if API key is configured
    if (!appState.settings.apiKey) {
        alert('Please configure your API key in Settings (Cmd+,)');
        return;
    }
    
    // Add user message to chat
    addChatMessage('user', message);
    input.value = '';
    autoResizeTextarea(); // Reset textarea height
    
    // Show loading
    const loadingId = addChatMessage('assistant', 'Thinking...');
    
    try {
        // Prepare messages for API
        const messages = chatHistory.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));
        
        messages.push({
            role: 'user',
            content: message
        });
        
        // Call AI API
        const result = await ipcRenderer.invoke(
            'ai-chat',
            messages,
            appState.settings.apiKey,
            appState.settings.model || 'gpt-4',
            appState.settings.temperature || 0.7
        );
        
        // Remove loading message
        removeChatMessage(loadingId);
        
        if (result.success) {
            addChatMessage('assistant', result.content);
        } else {
            addChatMessage('assistant', 'Error: ' + result.error);
        }
    } catch (error) {
        removeChatMessage(loadingId);
        addChatMessage('assistant', 'Error: ' + error.message);
    }
}

function addChatMessage(role, content) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageId = `msg-${Date.now()}`;
    
    const messageDiv = document.createElement('div');
    messageDiv.id = messageId;
    messageDiv.className = `chat-message ${role}`;
    messageDiv.textContent = content;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Add to history
    chatHistory.push({ id: messageId, role, content });
    
    return messageId;
}

function removeChatMessage(messageId) {
    const message = document.getElementById(messageId);
    if (message) {
        message.remove();
    }
    chatHistory = chatHistory.filter(msg => msg.id !== messageId);
}

function toggleAIPanel() {
    const overlay = document.getElementById('ai-panel-overlay');
    if (!overlay) return;
    
    if (overlay.style.display === 'none' || !overlay.style.display) {
        overlay.style.display = 'flex';
        if (window.switchPanel) {
            switchPanel('ai');
        }
        // Setup AI input listeners when panel is shown
        setTimeout(() => {
            if (window.setupAIInputListeners) {
                setupAIInputListeners();
            }
        }, 100);
    } else {
        overlay.style.display = 'none';
    }
}

// Setup event listeners
function setupAIInputListeners() {
    const input = document.getElementById('chat-input');
    if (input) {
        input.addEventListener('input', autoResizeTextarea);
        input.addEventListener('keydown', handleChatInputKeydown);
    }
    
    // Dropdown handlers
    const agentDropdown = document.getElementById('agent-dropdown');
    const autoDropdown = document.getElementById('auto-dropdown');
    
    if (agentDropdown) {
        agentDropdown.addEventListener('click', () => {
            // TODO: Show agent selection menu
            console.log('Agent dropdown clicked');
        });
    }
    
    if (autoDropdown) {
        autoDropdown.addEventListener('click', () => {
            // TODO: Show auto mode selection menu
            console.log('Auto dropdown clicked');
        });
    }
    
    // Action icon handlers
    const stopBtn = document.getElementById('ai-stop-btn');
    const contextBtn = document.getElementById('ai-context-btn');
    const imageBtn = document.getElementById('ai-image-btn');
    const micBtn = document.getElementById('ai-mic-btn');
    
    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            // TODO: Stop current AI operation
            console.log('Stop clicked');
        });
    }
    
    if (contextBtn) {
        contextBtn.addEventListener('click', () => {
            // TODO: Show context selection (@ for files, symbols, etc.)
            const input = document.getElementById('chat-input');
            if (input) {
                input.value += '@';
                input.focus();
                autoResizeTextarea();
            }
        });
    }
    
    if (imageBtn) {
        imageBtn.addEventListener('click', () => {
            // TODO: Open image picker
            console.log('Image attach clicked');
        });
    }
    
    if (micBtn) {
        micBtn.addEventListener('click', () => {
            // TODO: Start voice input
            console.log('Microphone clicked');
        });
    }
}

// Export functions
window.sendChatMessage = sendChatMessage;
window.toggleAIPanel = toggleAIPanel;
window.setupAIInputListeners = setupAIInputListeners;
window.autoResizeTextarea = autoResizeTextarea;
