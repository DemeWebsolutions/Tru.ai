// Tru.ai Electron Desktop App - Main JavaScript

class TruAiApp {
  constructor() {
    this.currentFile = null;
    this.currentFolder = null;
    this.tabs = [];
    this.activeTabId = null;
    
    this.init();
  }

  init() {
    console.log('Initializing Tru.ai Desktop...');
    
    // Setup menu listeners
    this.setupMenuListeners();
    
    // Setup UI event listeners
    this.setupUIListeners();
    
    // Show welcome screen
    this.showWelcomeScreen();
    
    console.log('Tru.ai Desktop initialized');
  }

  setupMenuListeners() {
    // New File
    window.electronAPI.onMenuNewFile(() => {
      this.newFile();
    });

    // Open File
    window.electronAPI.onMenuOpenFile((filePath) => {
      this.openFile(filePath);
    });

    // Open Folder
    window.electronAPI.onMenuOpenFolder((folderPath) => {
      this.openFolder(folderPath);
    });

    // Save
    window.electronAPI.onMenuSave(() => {
      this.saveCurrentFile();
    });

    // Save All
    window.electronAPI.onMenuSaveAll(() => {
      this.saveAllFiles();
    });

    // Toggle Sidebar
    window.electronAPI.onMenuToggleSidebar(() => {
      this.toggleSidebar();
    });

    // Toggle Terminal
    window.electronAPI.onMenuToggleTerminal(() => {
      this.toggleTerminal();
    });

    // Command Palette
    window.electronAPI.onMenuCommandPalette(() => {
      this.showCommandPalette();
    });

    // Ask AI
    window.electronAPI.onMenuAskAI(() => {
      this.showAIPanel();
    });
  }

  setupUIListeners() {
    // Activity bar buttons
    document.querySelectorAll('.activity-icon').forEach(icon => {
      icon.addEventListener('click', (e) => {
        const panel = e.currentTarget.dataset.panel;
        this.showPanel(panel);
      });
    });

    // Command palette
    const commandInput = document.getElementById('command-input');
    if (commandInput) {
      commandInput.addEventListener('input', (e) => {
        this.filterCommands(e.target.value);
      });
    }
  }

  showWelcomeScreen() {
    const editorContainer = document.getElementById('editor-container');
    editorContainer.innerHTML = `
      <div class="welcome-screen">
        <h1>Welcome to Tru.ai</h1>
        <p>AI-powered IDE for modern development</p>
        <div class="welcome-actions">
          <button class="welcome-btn" onclick="app.openFolderDialog()">
            Open Folder
          </button>
          <button class="welcome-btn secondary" onclick="app.newFile()">
            New File
          </button>
        </div>
      </div>
    `;
  }

  async newFile() {
    const newTab = {
      id: 'untitled-' + Date.now(),
      name: 'Untitled',
      content: '',
      isDirty: false,
      filePath: null
    };
    
    this.tabs.push(newTab);
    this.activeTabId = newTab.id;
    this.renderTabs();
    this.showEditor(newTab);
  }

  async openFile(filePath) {
    try {
      const result = await window.electronAPI.readFile(filePath);
      
      if (result.success) {
        const fileName = filePath.split('/').pop();
        const newTab = {
          id: 'file-' + Date.now(),
          name: fileName,
          content: result.content,
          isDirty: false,
          filePath: filePath
        };
        
        this.tabs.push(newTab);
        this.activeTabId = newTab.id;
        this.currentFile = filePath;
        
        this.renderTabs();
        this.showEditor(newTab);
        this.updateStatusBar();
      } else {
        console.error('Failed to open file:', result.error);
      }
    } catch (error) {
      console.error('Error opening file:', error);
    }
  }

  async openFolder(folderPath) {
    this.currentFolder = folderPath;
    await this.loadFolderStructure(folderPath);
    this.updateStatusBar();
  }

  async loadFolderStructure(folderPath) {
    try {
      const result = await window.electronAPI.readDirectory(folderPath);
      
      if (result.success) {
        // TODO: Render file tree in sidebar
        console.log('Folder loaded:', result.items);
      }
    } catch (error) {
      console.error('Error loading folder:', error);
    }
  }

  async saveCurrentFile() {
    const activeTab = this.tabs.find(t => t.id === this.activeTabId);
    
    if (!activeTab) return;

    if (!activeTab.filePath) {
      // Show save dialog
      const result = await window.electronAPI.saveFileDialog(activeTab.name);
      if (result.canceled) return;
      activeTab.filePath = result.filePath;
    }

    try {
      const result = await window.electronAPI.writeFile(activeTab.filePath, activeTab.content);
      
      if (result.success) {
        activeTab.isDirty = false;
        this.renderTabs();
        console.log('File saved:', activeTab.filePath);
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  }

  async saveAllFiles() {
    const dirtyTabs = this.tabs.filter(t => t.isDirty && t.filePath);
    
    for (const tab of dirtyTabs) {
      try {
        await window.electronAPI.writeFile(tab.filePath, tab.content);
        tab.isDirty = false;
      } catch (error) {
        console.error('Error saving file:', tab.filePath, error);
      }
    }
    
    this.renderTabs();
  }

  showEditor(tab) {
    const editorContainer = document.getElementById('editor-container');
    
    // Simple textarea editor (in production, use Monaco Editor)
    editorContainer.innerHTML = `
      <textarea 
        id="code-editor"
        style="width: 100%; height: 100%; background: #1e1e1e; color: #d4d4d4; 
               border: none; padding: 16px; font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
               font-size: 14px; line-height: 1.5; resize: none;"
        placeholder="Start typing..."
      >${tab.content}</textarea>
    `;
    
    const editor = document.getElementById('code-editor');
    editor.addEventListener('input', (e) => {
      tab.content = e.target.value;
      tab.isDirty = true;
      this.renderTabs();
    });
  }

  renderTabs() {
    const tabBar = document.getElementById('tab-bar');
    
    if (this.tabs.length === 0) {
      tabBar.innerHTML = '';
      return;
    }
    
    tabBar.innerHTML = this.tabs.map(tab => `
      <div class="tab ${tab.id === this.activeTabId ? 'active' : ''}" 
           data-tab-id="${tab.id}"
           onclick="app.selectTab('${tab.id}')">
        <span class="tab-label">${tab.isDirty ? '• ' : ''}${tab.name}</span>
        <button class="tab-close" onclick="event.stopPropagation(); app.closeTab('${tab.id}')">×</button>
      </div>
    `).join('');
  }

  selectTab(tabId) {
    this.activeTabId = tabId;
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab) {
      this.showEditor(tab);
      this.renderTabs();
    }
  }

  closeTab(tabId) {
    const tabIndex = this.tabs.findIndex(t => t.id === tabId);
    if (tabIndex === -1) return;
    
    const tab = this.tabs[tabIndex];
    
    // TODO: Prompt to save if dirty
    if (tab.isDirty) {
      if (!confirm(`Save changes to ${tab.name}?`)) {
        // User doesn't want to save
      } else {
        this.saveCurrentFile();
      }
    }
    
    this.tabs.splice(tabIndex, 1);
    
    if (this.activeTabId === tabId) {
      if (this.tabs.length > 0) {
        this.activeTabId = this.tabs[Math.max(0, tabIndex - 1)].id;
        this.showEditor(this.tabs.find(t => t.id === this.activeTabId));
      } else {
        this.activeTabId = null;
        this.showWelcomeScreen();
      }
    }
    
    this.renderTabs();
  }

  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('hidden');
    }
  }

  toggleTerminal() {
    const terminal = document.getElementById('terminal-panel');
    if (terminal) {
      terminal.style.display = terminal.style.display === 'none' ? 'flex' : 'none';
    }
  }

  showCommandPalette() {
    const palette = document.getElementById('command-palette');
    if (palette) {
      palette.style.display = palette.style.display === 'none' ? 'flex' : 'none';
      if (palette.style.display === 'flex') {
        document.getElementById('command-input').focus();
      }
    }
  }

  showPanel(panelName) {
    // Update active state
    document.querySelectorAll('.activity-icon').forEach(icon => {
      icon.classList.remove('active');
      if (icon.dataset.panel === panelName) {
        icon.classList.add('active');
      }
    });
    
    // TODO: Show appropriate sidebar panel
    console.log('Showing panel:', panelName);
  }

  showAIPanel() {
    this.showPanel('ai');
    // TODO: Focus AI input
  }

  async openFolderDialog() {
    const result = await window.electronAPI.openFolderDialog();
    if (!result.canceled && result.filePaths.length > 0) {
      this.openFolder(result.filePaths[0]);
    }
  }

  updateStatusBar() {
    const statusFile = document.getElementById('status-file');
    if (statusFile && this.currentFile) {
      statusFile.textContent = this.currentFile.split('/').pop();
    }
  }

  filterCommands(query) {
    // TODO: Implement command filtering
    console.log('Filter commands:', query);
  }
}

// Initialize app when DOM is ready
let app;
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    app = new TruAiApp();
  });
} else {
  app = new TruAiApp();
}
