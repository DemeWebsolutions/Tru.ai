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
  setupTerminalListeners();
  
  // Initialize TruAi Core integration
  initializeTruAiCore();
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
  const statusDot = document.querySelector('.status-dot');
  
  if (!statusDot) return;
  
  // Update indicator color based on risk
  statusDot.classList.remove('online');
  
  switch (riskLevel) {
    case 'SAFE':
      statusDot.style.backgroundColor = '#10b981'; // Green
      break;
    case 'ELEVATED':
      statusDot.style.backgroundColor = '#f59e0b'; // Amber
      break;
    case 'LOCKED':
      statusDot.style.backgroundColor = '#ef4444'; // Red
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
  document.getElementById('newFileBtn').addEventListener('click', () => {
    console.log('New file action');
    // TODO: Implement new file functionality
  });
  
  document.getElementById('openFileBtn').addEventListener('click', () => {
    console.log('Open file action');
    // TODO: Implement open file functionality
  });
  
  document.getElementById('startAIBtn').addEventListener('click', () => {
    switchView('ai');
    document.querySelector('[data-view="ai"]').classList.add('active');
    document.querySelector('[data-view="editor"]').classList.remove('active');
  });
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

// Terminal functionality
function setupTerminalListeners() {
  const terminalInput = document.getElementById('terminalInput');
  
  terminalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const command = terminalInput.value.trim();
      if (command) {
        executeTerminalCommand(command);
        terminalInput.value = '';
      }
    }
  });
}

function executeTerminalCommand(command) {
  const terminalOutput = document.getElementById('terminalOutput');
  
  // Add command to output
  const cmdLine = document.createElement('div');
  cmdLine.className = 'terminal-line';
  cmdLine.textContent = `$ ${command}`;
  terminalOutput.appendChild(cmdLine);
  
  // Process command
  let response = '';
  
  if (command === 'help') {
    response = 'Available commands:\n  help - Show this help\n  clear - Clear terminal\n  version - Show version';
  } else if (command === 'clear') {
    terminalOutput.innerHTML = '';
    return;
  } else if (command === 'version') {
    response = 'Tru.ai Terminal v1.0.0';
  } else {
    response = `Command not found: ${command}`;
  }
  
  // Add response to output
  const responseLine = document.createElement('div');
  responseLine.className = 'terminal-line';
  responseLine.textContent = response;
  terminalOutput.appendChild(responseLine);
  
  // Scroll to bottom
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// Menu event listeners
function setupMenuListeners() {
  // New File
  window.electronAPI.onNewFile(() => {
    console.log('Menu: New File');
    // TODO: Implement new file
  });
  
  // Open File
  window.electronAPI.onOpenFile(() => {
    console.log('Menu: Open File');
    // TODO: Implement open file
  });
  
  // Save
  window.electronAPI.onSave(() => {
    console.log('Menu: Save');
    // TODO: Implement save
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
