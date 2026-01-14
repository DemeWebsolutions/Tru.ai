/**
 * Tru.ai Electron Renderer Process
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_ELECTRON_RENDERER_V1
 */

// State management
const state = {
  currentView: 'editor',
  conversations: [],
  files: [],
  riskLevel: 'SAFE'
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Tru.ai Electron App Initialized');
  
  // Get app info
  try {
    const version = await window.electronAPI.getVersion();
    const platform = await window.electronAPI.getPlatform();
    
    document.getElementById('appVersion').textContent = `v${version}`;
    document.getElementById('platform').textContent = platform;
  } catch (error) {
    console.error('Failed to get app info:', error);
  }
  
  // Set up event listeners
  setupNavigationListeners();
  setupQuickActionListeners();
  setupAIPanelListeners();
  setupMenuListeners();
  setupOnlineStatusListener(); // Add online/offline detection
  
  // Initialize TruAi Core integration
  initializeTruAiCore();
  
  // Initialize Monaco Editor
  require(['vs/editor/editor.main'], async function() {
    if (window.monacoAPI) {
      await window.monacoAPI.initialize();
      console.log('Monaco Editor ready');
    }
  });
  
  // Initialize App (theme, settings)
  if (window.appAPI) {
    await window.appAPI.initialize();
  }
  
  // Initialize File Explorer
  if (window.fileExplorerAPI) {
    window.fileExplorerAPI.initialize();
  }
  
  // Initialize Terminal
  if (window.terminalAPI) {
    window.terminalAPI.initialize();
  }
  
  // Initialize Git
  if (window.gitAPI) {
    window.gitAPI.initialize();
  }
  
  // Initialize Settings
  if (window.settingsAPI) {
    window.settingsAPI.initialize();
  }
  
  // Initialize AI
  if (window.aiAPI) {
    window.aiAPI.initialize();
  }
  
  // Setup keyboard shortcuts
  setupKeyboardShortcuts();
});

// Initialize TruAi Core integration
async function initializeTruAiCore() {
  try {
    const status = await window.truaiCore.getStatus();
    console.log('TruAi Core Status:', status);
    updateRiskIndicator(status.risk.riskLevel);
  } catch (error) {
    console.error('Failed to initialize TruAi Core:', error);
  }
}

// Update risk level indicator in UI
function updateRiskIndicator(riskLevel) {
  state.riskLevel = riskLevel;
  const riskIndicator = document.getElementById('riskIndicator');
  
  if (!riskIndicator) return;
  
  // Update indicator based on risk
  switch (riskLevel) {
    case 'SAFE':
      riskIndicator.textContent = '🟢 SAFE';
      riskIndicator.style.color = '#10b981';
      break;
    case 'ELEVATED':
      riskIndicator.textContent = '🟡 ELEVATED';
      riskIndicator.style.color = '#f59e0b';
      break;
    case 'LOCKED':
      riskIndicator.textContent = '🔴 LOCKED';
      riskIndicator.style.color = '#ef4444';
      break;
  }
}

// Navigation between views
function setupNavigationListeners() {
  const navButtons = document.querySelectorAll('.nav-btn');
  
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      switchView(view);
      
      // Update active state
      navButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

function switchView(viewName) {
  // Hide all views
  document.getElementById('editorView').style.display = 'none';
  document.getElementById('aiView').style.display = 'none';
  document.getElementById('terminalView').style.display = 'none';
  document.getElementById('settingsView').style.display = 'none';
  
  // Show selected view
  switch(viewName) {
    case 'editor':
      document.getElementById('editorView').style.display = 'flex';
      break;
    case 'ai':
      document.getElementById('aiView').style.display = 'flex';
      break;
    case 'terminal':
      document.getElementById('terminalView').style.display = 'flex';
      break;
    case 'settings':
      document.getElementById('settingsView').style.display = 'flex';
      break;
  }
  
  state.currentView = viewName;
}

// Quick action buttons
function setupQuickActionListeners() {
  const newFileBtn = document.getElementById('newFileBtn');
  const openFileBtn = document.getElementById('openFileBtn');
  const openFolderBtn = document.getElementById('openFolderBtn');
  const startAIBtn = document.getElementById('startAIBtn');
  
  if (newFileBtn) {
    newFileBtn.addEventListener('click', async () => {
      console.log('New file action');
      if (window.fileExplorerAPI && window.fileExplorerAPI.createNewFile) {
        window.fileExplorerAPI.createNewFile();
      }
    });
  }
  
  if (openFileBtn) {
    openFileBtn.addEventListener('click', async () => {
      console.log('Open file action');
      try {
        const result = await window.electronAPI.invoke('open-file-dialog');
        if (!result.canceled && result.filePaths && result.filePaths.length > 0) {
          const filePath = result.filePaths[0];
          const fileResult = await window.electronAPI.invoke('read-file', filePath);
          if (fileResult.success && window.monacoAPI) {
            window.monacoAPI.setValue(fileResult.content);
            console.log('File opened:', filePath);
          }
        }
      } catch (error) {
        console.error('Failed to open file:', error);
      }
    });
  }
  
  if (openFolderBtn) {
    openFolderBtn.addEventListener('click', () => {
      if (window.fileExplorerAPI && window.fileExplorerAPI.openWorkspaceFolder) {
        window.fileExplorerAPI.openWorkspaceFolder();
      }
    });
  }
  
  if (startAIBtn) {
    startAIBtn.addEventListener('click', () => {
      switchView('ai');
      document.querySelector('[data-view="ai"]').classList.add('active');
      document.querySelector('[data-view="editor"]').classList.remove('active');
    });
  }
}

// Setup online/offline status listener
function setupOnlineStatusListener() {
  const statusIndicator = document.querySelector('.status-indicator');
  const statusDot = document.querySelector('.status-dot');
  const statusText = statusIndicator.querySelector('span:last-child');
  
  function updateOnlineStatus() {
    if (navigator.onLine) {
      statusDot.classList.add('online');
      statusDot.classList.remove('offline');
      statusText.textContent = 'Online';
    } else {
      statusDot.classList.remove('online');
      statusDot.classList.add('offline');
      statusText.textContent = 'Offline';
    }
  }
  
  // Initial status
  updateOnlineStatus();
  
  // Listen for online/offline events
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
}

// AI Panel functionality
function setupAIPanelListeners() {
  const aiInput = document.getElementById('aiInput');
  const sendBtn = document.getElementById('sendAIBtn');
  const closeBtn = document.getElementById('closeAIPanel');
  
  sendBtn.addEventListener('click', () => {
    sendAIMessage();
  });
  
  aiInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendAIMessage();
    }
  });
  
  closeBtn.addEventListener('click', () => {
    switchView('editor');
    document.querySelector('[data-view="editor"]').classList.add('active');
    document.querySelector('[data-view="ai"]').classList.remove('active');
  });
}

function sendAIMessage() {
  const aiInput = document.getElementById('aiInput');
  const message = aiInput.value.trim();
  
  if (!message) return;
  
  // Add user message to chat
  addChatMessage('user', message);
  
  // Clear input
  aiInput.value = '';
  
  // Execute through TruAi Core
  executeTruAiTask({
    type: 'ai_chat',
    scope: 'conversation',
    target: 'ai_assistant',
    isProduction: false,
    task: message
  });
}

// Execute task through TruAi Core
async function executeTruAiTask(task) {
  try {
    const result = await window.truaiCore.executeTask(task);
    
    if (!result.success) {
      if (result.requiresApproval) {
        // Show approval dialog
        const approved = confirm(`This operation requires admin approval.\nRisk Level: ${result.riskLevel}\n\nApprove?`);
        if (approved) {
          // Re-submit with approval
          const taskWithApproval = { ...task, adminApproval: true };
          return await window.truaiCore.executeTask(taskWithApproval);
        }
        return result;
      }
      return result;
    }
    
    return result;
  } catch (error) {
    console.error('Task execution failed:', error);
    return { success: false, error: error.message };
  }
}

function addChatMessage(type, content) {
  const chatContainer = document.getElementById('aiChat');
  const messageDiv = document.createElement('div');
  messageDiv.className = `chat-message ${type}-message`;
  
  const avatar = document.createElement('div');
  avatar.className = 'message-avatar';
  avatar.textContent = type === 'ai' ? '🤖' : '👤';
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  
  const p = document.createElement('p');
  p.textContent = content;
  contentDiv.appendChild(p);
  
  messageDiv.appendChild(avatar);
  messageDiv.appendChild(contentDiv);
  chatContainer.appendChild(messageDiv);
  
  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Menu event handlers
function setupMenuListeners() {
  // Listen for menu events from main process
  if (window.electronAPI.onNewFile) {
    window.electronAPI.onNewFile(() => {
      console.log('New file menu clicked');
      if (window.fileExplorerAPI && window.fileExplorerAPI.createNewFile) {
        window.fileExplorerAPI.createNewFile();
      }
    });
  }
  
  if (window.electronAPI.onOpenFile) {
    window.electronAPI.onOpenFile(async () => {
      console.log('Open file menu clicked');
      // Trigger the open file button
      const openFileBtn = document.getElementById('openFileBtn');
      if (openFileBtn) {
        openFileBtn.click();
      }
    });
  }
  
  if (window.electronAPI.onSave) {
    window.electronAPI.onSave(() => {
      console.log('Save menu clicked');
      if (window.fileExplorerAPI && window.fileExplorerAPI.saveFile) {
        window.fileExplorerAPI.saveFile();
      }
    });
  }
  
  if (window.electronAPI.onToggleAIPanel) {
    window.electronAPI.onToggleAIPanel(() => {
      switchView('ai');
    });
  }
}
}

// Menu event listeners
function setupMenuListeners() {
  // New File
  window.electronAPI.onNewFile(() => {
    console.log('Menu: New File');
    if (window.fileExplorerAPI) {
      document.getElementById('newFileBtn')?.click();
    }
  });
  
  // Open File
  window.electronAPI.onOpenFile(() => {
    console.log('Menu: Open File');
    if (window.fileExplorerAPI) {
      document.getElementById('openFolderBtn')?.click();
    }
  });
  
  // Save
  window.electronAPI.onSave(async () => {
    console.log('Menu: Save');
    if (window.fileExplorerAPI) {
      await window.fileExplorerAPI.saveFile();
    }
  });
  
  // New Conversation
  window.electronAPI.onNewConversation(() => {
    console.log('Menu: New Conversation');
    switchView('ai');
    // Clear AI chat
    document.getElementById('aiChat').innerHTML = `
      <div class="chat-message ai-message">
        <div class="message-avatar">🤖</div>
        <div class="message-content">
          <p>Hello! I'm your Tru.ai assistant. How can I help you today?</p>
        </div>
      </div>
    `;
  });
  
  // Toggle AI Panel
  window.electronAPI.onToggleAIPanel(() => {
    if (state.currentView === 'ai') {
      switchView('editor');
    } else {
      switchView('ai');
    }
  });
  
  // Documentation
  window.electronAPI.onDocumentation(() => {
    console.log('Menu: Documentation');
    // TODO: Open documentation
  });
  
  // About
  window.electronAPI.onAbout(() => {
    console.log('Menu: About');
    alert('Tru.ai v1.0.0\nAI-Powered IDE\n© 2026 My Deme, LLC. All rights reserved.');
  });
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', async (e) => {
    // Cmd/Ctrl + S: Save file
    if ((e.metaKey || e.ctrlKey) && e.key === 's') {
      e.preventDefault();
      if (window.fileExplorerAPI) {
        await window.fileExplorerAPI.saveFile();
      }
    }
    
    // Cmd/Ctrl + W: Close tab
    if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
      e.preventDefault();
      const activeTab = document.querySelector('.editor-tab.active');
      if (activeTab && window.fileExplorerAPI) {
        window.fileExplorerAPI.closeTab(activeTab.dataset.filePath);
      }
    }
    
    // Cmd/Ctrl + F: Find
    if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
      e.preventDefault();
      if (window.monacoAPI) {
        window.monacoAPI.find();
      }
    }
    
    // Cmd/Ctrl + H: Replace
    if ((e.metaKey || e.ctrlKey) && e.key === 'h') {
      e.preventDefault();
      if (window.monacoAPI) {
        window.monacoAPI.replace();
      }
    }
    
    // Cmd/Ctrl + G: Go to line
    if ((e.metaKey || e.ctrlKey) && e.key === 'g') {
      e.preventDefault();
      if (window.monacoAPI) {
        window.monacoAPI.goToLine();
      }
    }
    
    // Cmd/Ctrl + Shift + F: Format document
    if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'f') {
      e.preventDefault();
      if (window.monacoAPI) {
        window.monacoAPI.format();
      }
    }
  });
}
