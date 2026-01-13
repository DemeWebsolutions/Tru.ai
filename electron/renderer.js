// Tru.ai Electron Renderer Process
// Copyright © 2026 My Deme, LLC. All rights reserved.

// State management
const state = {
  currentView: 'editor',
  conversations: [],
  files: []
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
});

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
  
  // Simulate AI response (replace with actual AI integration)
  setTimeout(() => {
    const response = 'This is a placeholder response. Integrate with Tru.ai Core API for actual AI functionality.';
    addChatMessage('ai', response);
  }, 1000);
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
