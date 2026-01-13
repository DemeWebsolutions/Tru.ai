/**
 * TruAi Desktop IDE - AI Integration
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_AI_INTEGRATION_V1
 */

const { ipcRenderer } = require('electron');

let chatHistory = [];
let attachedImage = null;

// Auto-resize textarea
function autoResizeTextarea() {
    const input = document.getElementById('aiInput');
    if (!input) return;
    
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 200) + 'px';
}

// Handle Enter key (Shift+Enter for new line, Enter to send)
function handleChatInputKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendAIMessage();
    }
}

async function sendAIMessage() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    
    if (!message && !attachedImage) return;
    
    // Check if API key is configured
    const settings = JSON.parse(localStorage.getItem('truai-settings') || '{}');
    if (!settings.apiKey) {
        alert('Please configure your API key in Settings');
        return;
    }
    
    // Add user message to chat
    addChatMessage('user', message, attachedImage);
    input.value = '';
    autoResizeTextarea();
    
    // Clear attached image
    const imageData = attachedImage;
    attachedImage = null;
    updateImagePreview();
    
    // Show loading
    const loadingId = addChatMessage('ai', 'Thinking...');
    
    try {
        // Call AI API through TruAi Core
        const result = await ipcRenderer.invoke(
            'ai-chat',
            message,
            imageData,
            settings
        );
        
        // Remove loading message
        removeChatMessage(loadingId);
        
        if (result.success) {
            addChatMessage('ai', result.content);
        } else {
            addChatMessage('ai', 'Error: ' + result.error);
        }
    } catch (error) {
        removeChatMessage(loadingId);
        addChatMessage('ai', 'Error: ' + error.message);
    }
}

function addChatMessage(role, content, imageData = null) {
    const chatContainer = document.getElementById('aiChat');
    const messageId = `msg-${Date.now()}`;
    
    const messageDiv = document.createElement('div');
    messageDiv.id = messageId;
    messageDiv.className = `chat-message ${role}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🤖';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (imageData) {
        const img = document.createElement('img');
        img.src = imageData;
        img.className = 'message-image';
        img.style.maxWidth = '200px';
        img.style.borderRadius = '8px';
        img.style.marginBottom = '8px';
        contentDiv.appendChild(img);
    }
    
    const textP = document.createElement('p');
    textP.textContent = content;
    contentDiv.appendChild(textP);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Add to history
    chatHistory.push({ id: messageId, role, content, imageData });
    
    return messageId;
}

function removeChatMessage(messageId) {
    const message = document.getElementById(messageId);
    if (message) {
        message.remove();
    }
    chatHistory = chatHistory.filter(msg => msg.id !== messageId);
}

function handleImageAttach() {
    const fileInput = document.getElementById('imageFileInput');
    fileInput.click();
}

function handleImageSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        attachedImage = e.target.result;
        updateImagePreview();
    };
    reader.readAsDataURL(file);
}

function updateImagePreview() {
    let preview = document.getElementById('imagePreview');
    
    if (attachedImage) {
        if (!preview) {
            preview = document.createElement('div');
            preview.id = 'imagePreview';
            preview.className = 'image-preview';
            
            const img = document.createElement('img');
            img.src = attachedImage;
            img.style.maxHeight = '100px';
            img.style.borderRadius = '4px';
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '×';
            removeBtn.className = 'remove-image-btn';
            removeBtn.onclick = () => {
                attachedImage = null;
                updateImagePreview();
            };
            
            preview.appendChild(img);
            preview.appendChild(removeBtn);
            
            const inputArea = document.querySelector('.ai-input-area');
            inputArea.insertBefore(preview, inputArea.firstChild);
        }
    } else if (preview) {
        preview.remove();
    }
}

function handleContextInsert() {
    const input = document.getElementById('aiInput');
    if (input) {
        input.value += '@';
        input.focus();
        autoResizeTextarea();
    }
}

// Setup event listeners
function setupAIListeners() {
    const input = document.getElementById('aiInput');
    if (input) {
        input.addEventListener('input', autoResizeTextarea);
        input.addEventListener('keydown', handleChatInputKeydown);
    }
    
    const sendBtn = document.getElementById('sendAIBtn');
    if (sendBtn) {
        sendBtn.addEventListener('click', sendAIMessage);
    }
    
    const imageBtn = document.getElementById('aiImageBtn');
    if (imageBtn) {
        imageBtn.addEventListener('click', handleImageAttach);
    }
    
    const contextBtn = document.getElementById('aiContextBtn');
    if (contextBtn) {
        contextBtn.addEventListener('click', handleContextInsert);
    }
    
    const fileInput = document.getElementById('imageFileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleImageSelect);
    }
    
    const closeBtn = document.getElementById('closeAIPanel');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            document.getElementById('aiView').style.display = 'none';
            document.getElementById('editorView').style.display = 'block';
        });
    }
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAIListeners);
} else {
    setupAIListeners();
}

// Export functions
window.sendAIMessage = sendAIMessage;
window.autoResizeTextarea = autoResizeTextarea;
window.setupAIListeners = setupAIListeners;
