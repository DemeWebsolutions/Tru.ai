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
let attachedFiles = []; // For regular file attachments
let attachedZipContents = null; // For extracted ZIP contents
let contextData = {}; // Stores code selection, open files, project structure, etc.

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
    
    if (!message && !attachedImage && attachedFiles.length === 0 && !attachedZipContents) return;
    
    // Check if API key is configured
    const settings = JSON.parse(localStorage.getItem('truai-settings') || '{}');
    if (!settings.apiKey) {
        alert('Please configure your API key in Settings');
        return;
    }
    
    // Gather comprehensive context
    await gatherContext();
    
    // Add user message to chat
    addChatMessage('user', message, attachedImage, attachedFiles, attachedZipContents);
    input.value = '';
    autoResizeTextarea();
    
    // Prepare payload with all context
    const imageData = attachedImage;
    const filesData = [...attachedFiles];
    const zipData = attachedZipContents;
    const context = { ...contextData };
    
    // Clear attachments
    attachedImage = null;
    attachedFiles = [];
    attachedZipContents = null;
    contextData = {};
    updateImagePreview();
    updateFilePreview();
    updateZipPreview();
    
    // Show loading
    const loadingId = addChatMessage('ai', 'Thinking...');
    
    try {
        // Call AI API through TruAi Core with full context
        const result = await ipcRenderer.invoke(
            'ai-chat',
            message,
            imageData,
            settings,
            filesData,
            zipData,
            context
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

// Gather comprehensive context before sending
async function gatherContext() {
    contextData = {};
    
    // 1. Code selection from Monaco Editor
    if (window.monacoEditor) {
        const selection = window.monacoEditor.getSelection();
        const model = window.monacoEditor.getModel();
        if (selection && !selection.isEmpty() && model) {
            contextData.code_selection = {
                content: model.getValueInRange(selection),
                startLine: selection.startLineNumber,
                endLine: selection.endLineNumber,
                language: model.getLanguageId(),
                tag: 'code_context'
            };
        } else if (model) {
            // Current file content
            contextData.current_file = {
                content: model.getValue(),
                language: model.getLanguageId(),
                tag: 'code_context'
            };
        }
    }
    
    // 2. Open files context
    if (window.openFiles && window.openFiles.size > 0) {
        contextData.open_files = [];
        for (const [path, content] of window.openFiles.entries()) {
            contextData.open_files.push({
                path: path,
                language: detectLanguage(path),
                tag: 'related_files'
            });
        }
    }
    
    // 3. Project structure (if workspace is open)
    if (window.currentWorkspace) {
        try {
            const structure = await ipcRenderer.invoke('get-project-structure', window.currentWorkspace);
            contextData.project_structure = {
                ...structure,
                tag: 'project_metadata'
            };
        } catch (error) {
            console.error('Failed to get project structure:', error);
        }
    }
    
    // 4. Git context (if in git repo)
    if (window.currentWorkspace) {
        try {
            const gitStatus = await ipcRenderer.invoke('git-status', window.currentWorkspace);
            if (gitStatus.success) {
                contextData.git_context = {
                    branch: gitStatus.branch,
                    modified: gitStatus.modified,
                    staged: gitStatus.staged,
                    tag: 'git_context'
                };
            }
        } catch (error) {
            // Not a git repo or error, skip
        }
    }
    
    // 5. Terminal output (last 50 lines if available)
    const terminalOutput = document.getElementById('terminalOutput');
    if (terminalOutput && terminalOutput.textContent) {
        const lines = terminalOutput.textContent.split('\n').slice(-50);
        if (lines.length > 0) {
            contextData.terminal_output = {
                content: lines.join('\n'),
                tag: 'runtime_output'
            };
        }
    }
}

function detectLanguage(filepath) {
    const ext = filepath.split('.').pop().toLowerCase();
    const langMap = {
        'js': 'javascript',
        'ts': 'typescript',
        'jsx': 'javascript',
        'tsx': 'typescript',
        'py': 'python',
        'java': 'java',
        'c': 'c',
        'cpp': 'cpp',
        'cs': 'csharp',
        'go': 'go',
        'rs': 'rust',
        'php': 'php',
        'rb': 'ruby',
        'swift': 'swift',
        'kt': 'kotlin',
        'html': 'html',
        'css': 'css',
        'json': 'json',
        'xml': 'xml',
        'md': 'markdown'
    };
    return langMap[ext] || 'plaintext';
}

function addChatMessage(role, content, imageData = null, filesData = [], zipData = null) {
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
    
    // Show attached files
    if (filesData && filesData.length > 0) {
        const filesList = document.createElement('div');
        filesList.style.marginBottom = '8px';
        filesList.style.fontSize = '12px';
        filesList.style.color = '#888';
        filesList.textContent = `📎 ${filesData.length} file(s) attached`;
        contentDiv.appendChild(filesList);
    }
    
    // Show ZIP contents
    if (zipData) {
        const zipInfo = document.createElement('div');
        zipInfo.style.marginBottom = '8px';
        zipInfo.style.fontSize = '12px';
        zipInfo.style.color = '#888';
        zipInfo.textContent = `📦 ZIP: ${zipData.fileCount} file(s) extracted`;
        contentDiv.appendChild(zipInfo);
    }
    
    const textP = document.createElement('p');
    textP.textContent = content;
    contentDiv.appendChild(textP);
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    // Add to history
    chatHistory.push({ id: messageId, role, content, imageData, filesData, zipData });
    
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

// Handle file attachment (no size limit)
function handleFileAttach() {
    const fileInput = document.getElementById('fileAttachInput');
    if (!fileInput) {
        // Create file input if it doesn't exist
        const input = document.createElement('input');
        input.type = 'file';
        input.id = 'fileAttachInput';
        input.multiple = true; // Allow multiple files
        input.style.display = 'none';
        input.addEventListener('change', handleFileSelect);
        document.body.appendChild(input);
        input.click();
    } else {
        fileInput.click();
    }
}

async function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    
    for (const file of files) {
        try {
            const content = await readFileContent(file);
            attachedFiles.push({
                name: file.name,
                size: file.size,
                type: file.type,
                content: content,
                tag: 'file_payload'
            });
        } catch (error) {
            console.error('Error reading file:', file.name, error);
            alert(`Error reading file: ${file.name}`);
        }
    }
    
    updateFilePreview();
}

function readFileContent(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            // Check if binary file
            if (file.type && !file.type.startsWith('text/') && !isTextFile(file.name)) {
                // For binary files, use base64
                resolve({
                    encoding: 'base64',
                    data: e.target.result.split(',')[1]
                });
            } else {
                // For text files, read as text
                resolve({
                    encoding: 'utf-8',
                    data: e.target.result
                });
            }
        };
        reader.onerror = reject;
        
        // Read as text first, or base64 for binary
        if (file.type && !file.type.startsWith('text/') && !isTextFile(file.name)) {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file);
        }
    });
}

function isTextFile(filename) {
    const textExtensions = [
        'txt', 'md', 'json', 'xml', 'yaml', 'yml', 'toml', 'ini', 'conf', 'config',
        'js', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp', 'h', 'hpp', 'cs', 'go',
        'rs', 'php', 'rb', 'swift', 'kt', 'scala', 'sh', 'bash', 'zsh', 'fish',
        'html', 'css', 'scss', 'sass', 'less', 'vue', 'svelte',
        'sql', 'graphql', 'proto', 'dockerfile', 'makefile'
    ];
    const ext = filename.split('.').pop().toLowerCase();
    return textExtensions.includes(ext);
}

function updateFilePreview() {
    let preview = document.getElementById('filePreview');
    
    if (attachedFiles.length > 0) {
        if (!preview) {
            preview = document.createElement('div');
            preview.id = 'filePreview';
            preview.className = 'file-preview';
            preview.style.display = 'flex';
            preview.style.flexWrap = 'wrap';
            preview.style.gap = '8px';
            preview.style.padding = '8px';
            preview.style.backgroundColor = '#2a2a2a';
            preview.style.borderRadius = '4px';
            preview.style.marginBottom = '8px';
            
            const inputArea = document.querySelector('.ai-input-area');
            inputArea.insertBefore(preview, inputArea.firstChild);
        }
        
        // Clear and rebuild
        preview.innerHTML = '';
        attachedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.style.display = 'flex';
            fileItem.style.alignItems = 'center';
            fileItem.style.gap = '4px';
            fileItem.style.padding = '4px 8px';
            fileItem.style.backgroundColor = '#3a3a3a';
            fileItem.style.borderRadius = '4px';
            fileItem.style.fontSize = '12px';
            
            const fileIcon = document.createElement('span');
            fileIcon.textContent = '📎';
            
            const fileName = document.createElement('span');
            fileName.textContent = file.name;
            fileName.style.maxWidth = '150px';
            fileName.style.overflow = 'hidden';
            fileName.style.textOverflow = 'ellipsis';
            fileName.style.whiteSpace = 'nowrap';
            
            const removeBtn = document.createElement('button');
            removeBtn.textContent = '×';
            removeBtn.style.background = 'none';
            removeBtn.style.border = 'none';
            removeBtn.style.color = '#ff4444';
            removeBtn.style.cursor = 'pointer';
            removeBtn.style.fontSize = '16px';
            removeBtn.style.padding = '0 4px';
            removeBtn.onclick = () => {
                attachedFiles.splice(index, 1);
                updateFilePreview();
            };
            
            fileItem.appendChild(fileIcon);
            fileItem.appendChild(fileName);
            fileItem.appendChild(removeBtn);
            preview.appendChild(fileItem);
        });
    } else if (preview) {
        preview.remove();
    }
}

// Handle ZIP file loading and extraction
function handleZipAttach() {
    const zipInput = document.getElementById('zipFileInput');
    if (!zipInput) {
        const input = document.createElement('input');
        input.type = 'file';
        input.id = 'zipFileInput';
        input.accept = '.zip';
        input.style.display = 'none';
        input.addEventListener('change', handleZipSelect);
        document.body.appendChild(input);
        input.click();
    } else {
        zipInput.click();
    }
}

async function handleZipSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        // Send to main process for extraction (no size limit)
        const result = await ipcRenderer.invoke('extract-zip', file.path);
        
        if (result.success) {
            attachedZipContents = {
                name: file.name,
                fileCount: result.files.length,
                files: result.files,
                tag: 'zip_contents'
            };
            updateZipPreview();
        } else {
            alert('Error extracting ZIP: ' + result.error);
        }
    } catch (error) {
        console.error('Error handling ZIP file:', error);
        alert('Error handling ZIP file: ' + error.message);
    }
}

function updateZipPreview() {
    let preview = document.getElementById('zipPreview');
    
    if (attachedZipContents) {
        if (!preview) {
            preview = document.createElement('div');
            preview.id = 'zipPreview';
            preview.className = 'zip-preview';
            preview.style.padding = '8px';
            preview.style.backgroundColor = '#2a2a2a';
            preview.style.borderRadius = '4px';
            preview.style.marginBottom = '8px';
            preview.style.fontSize = '12px';
            
            const inputArea = document.querySelector('.ai-input-area');
            inputArea.insertBefore(preview, inputArea.firstChild);
        }
        
        preview.innerHTML = '';
        
        const zipIcon = document.createElement('span');
        zipIcon.textContent = '📦 ';
        
        const zipName = document.createElement('span');
        zipName.textContent = `${attachedZipContents.name} (${attachedZipContents.fileCount} files)`;
        zipName.style.fontWeight = 'bold';
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.style.background = 'none';
        removeBtn.style.border = 'none';
        removeBtn.style.color = '#ff4444';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.fontSize = '16px';
        removeBtn.style.marginLeft = '8px';
        removeBtn.style.padding = '0 4px';
        removeBtn.onclick = () => {
            attachedZipContents = null;
            updateZipPreview();
        };
        
        preview.appendChild(zipIcon);
        preview.appendChild(zipName);
        preview.appendChild(removeBtn);
    } else if (preview) {
        preview.remove();
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
    
    const fileBtn = document.getElementById('aiFileBtn');
    if (fileBtn) {
        fileBtn.addEventListener('click', handleFileAttach);
    }
    
    const zipBtn = document.getElementById('aiZipBtn');
    if (zipBtn) {
        zipBtn.addEventListener('click', handleZipAttach);
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
