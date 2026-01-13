/**
 * File Explorer Module
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_FILE_EXPLORER_V1
 */

let currentWorkspace = null;
let openFiles = new Map(); // filename -> content

/**
 * Initialize file explorer
 */
function initializeFileExplorer() {
  // Add open folder button listener
  const openFolderBtn = document.getElementById('openFolderBtn');
  if (openFolderBtn) {
    openFolderBtn.addEventListener('click', openWorkspaceFolder);
  }

  // Add new file button listener
  const newFileBtn = document.getElementById('newFileBtn');
  if (newFileBtn) {
    newFileBtn.addEventListener('click', createNewFile);
  }

  console.log('File Explorer initialized');
}

/**
 * Open workspace folder
 */
async function openWorkspaceFolder() {
  try {
    const result = await window.electronAPI.invoke('open-folder-dialog');
    
    if (result.canceled || !result.filePaths || result.filePaths.length === 0) {
      return;
    }

    const folderPath = result.filePaths[0];
    currentWorkspace = folderPath;

    // Load directory tree
    await loadDirectoryTree(folderPath);
    
    // Set Git repo path
    if (window.gitAPI) {
      window.gitAPI.setRepoPath(folderPath);
    }

    console.log('Opened workspace:', folderPath);
  } catch (error) {
    console.error('Failed to open workspace:', error);
  }
}

/**
 * Load directory tree
 */
async function loadDirectoryTree(dirPath) {
  try {
    const result = await window.electronAPI.invoke('read-directory', dirPath);
    
    if (!result.success) {
      console.error('Failed to read directory:', result.error);
      return;
    }

    // Render file tree
    renderFileTree(result.files, dirPath);
  } catch (error) {
    console.error('Failed to load directory tree:', error);
  }
}

/**
 * Render file tree
 */
function renderFileTree(files, basePath) {
  const fileTreeContainer = document.getElementById('fileTree');
  if (!fileTreeContainer) return;

  fileTreeContainer.innerHTML = '';

  files.forEach(file => {
    const fileItem = createFileTreeItem(file, basePath);
    fileTreeContainer.appendChild(fileItem);
  });
}

/**
 * Create file tree item
 */
function createFileTreeItem(file, basePath) {
  const item = document.createElement('div');
  item.className = 'file-item';
  
  const icon = document.createElement('span');
  icon.className = 'file-icon';
  icon.textContent = file.isDirectory ? '📁' : getFileIcon(file.name);
  
  const name = document.createElement('span');
  name.textContent = file.name;
  
  item.appendChild(icon);
  item.appendChild(name);

  // Add click handler
  if (!file.isDirectory) {
    item.addEventListener('click', () => openFile(file.path));
  } else {
    item.addEventListener('click', () => toggleDirectory(item, file.path));
  }

  return item;
}

/**
 * Get file icon based on extension
 */
function getFileIcon(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  
  const iconMap = {
    'js': '📄',
    'ts': '📘',
    'json': '📋',
    'html': '🌐',
    'css': '🎨',
    'md': '📝',
    'py': '🐍',
    'rb': '💎',
    'go': '🔵',
    'rs': '🦀',
    'java': '☕',
    'cpp': '⚙️',
    'c': '⚙️',
    'sh': '🐚'
  };

  return iconMap[ext] || '📄';
}

/**
 * Toggle directory
 */
async function toggleDirectory(element, dirPath) {
  // TODO: Implement directory expansion/collapse
  console.log('Toggle directory:', dirPath);
}

/**
 * Open file
 */
async function openFile(filePath) {
  try {
    // Check if file is already open
    if (openFiles.has(filePath)) {
      // Switch to existing tab
      switchToTab(filePath);
      return;
    }

    // Read file content
    const result = await window.electronAPI.invoke('read-file', filePath);
    
    if (!result.success) {
      console.error('Failed to read file:', result.error);
      return;
    }

    // Store file content
    openFiles.set(filePath, result.content);

    // Load into Monaco Editor
    const filename = filePath.split('/').pop();
    if (window.monacoAPI) {
      window.monacoAPI.loadFile(filePath, result.content);
    }

    // Create tab
    createEditorTab(filePath, filename);

    // Update recent files
    addToRecentFiles(filePath);

    console.log('Opened file:', filePath);
  } catch (error) {
    console.error('Failed to open file:', error);
  }
}

/**
 * Create new file
 */
async function createNewFile() {
  if (!currentWorkspace) {
    alert('Please open a workspace folder first');
    return;
  }

  const filename = prompt('Enter filename:');
  if (!filename) return;

  try {
    const filePath = `${currentWorkspace}/${filename}`;
    const result = await window.electronAPI.invoke('create-file', filePath, '');

    if (result.success) {
      // Reload directory tree
      await loadDirectoryTree(currentWorkspace);
      
      // Open the new file
      await openFile(filePath);
    } else {
      alert('Failed to create file: ' + result.error);
    }
  } catch (error) {
    console.error('Failed to create file:', error);
  }
}

/**
 * Save current file
 */
async function saveCurrentFile() {
  const currentTab = document.querySelector('.editor-tab.active');
  if (!currentTab) return;

  const filePath = currentTab.dataset.filePath;
  if (!filePath) return;

  try {
    const content = window.monacoAPI ? window.monacoAPI.getContent() : '';
    const result = await window.electronAPI.invoke('write-file', filePath, content);

    if (result.success) {
      openFiles.set(filePath, content);
      console.log('File saved:', filePath);
    } else {
      alert('Failed to save file: ' + result.error);
    }
  } catch (error) {
    console.error('Failed to save file:', error);
  }
}

/**
 * Create editor tab
 */
function createEditorTab(filePath, filename) {
  const tabsContainer = document.getElementById('editorTabs');
  if (!tabsContainer) return;

  // Deactivate all tabs
  tabsContainer.querySelectorAll('.editor-tab').forEach(tab => {
    tab.classList.remove('active');
  });

  // Create new tab
  const tab = document.createElement('div');
  tab.className = 'editor-tab active';
  tab.dataset.filePath = filePath;

  const tabName = document.createElement('span');
  tabName.className = 'tab-name';
  tabName.textContent = filename;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'tab-close';
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeTab(filePath);
  });

  tab.appendChild(tabName);
  tab.appendChild(closeBtn);

  tab.addEventListener('click', () => switchToTab(filePath));

  tabsContainer.appendChild(tab);
}

/**
 * Switch to tab
 */
function switchToTab(filePath) {
  const tabs = document.querySelectorAll('.editor-tab');
  tabs.forEach(tab => {
    if (tab.dataset.filePath === filePath) {
      tab.classList.add('active');
      
      // Load content into editor
      const content = openFiles.get(filePath);
      if (content && window.monacoAPI) {
        const filename = filePath.split('/').pop();
        window.monacoAPI.loadFile(filePath, content);
      }
    } else {
      tab.classList.remove('active');
    }
  });
}

/**
 * Close tab
 */
function closeTab(filePath) {
  // Remove from open files
  openFiles.delete(filePath);

  // Remove tab element using data attribute matching
  const tabs = document.querySelectorAll('.editor-tab');
  let tabToRemove = null;
  
  tabs.forEach(tab => {
    if (tab.dataset.filePath === filePath) {
      tabToRemove = tab;
    }
  });
  
  if (tabToRemove) {
    tabToRemove.remove();
  }

  // If no tabs left, clear editor
  const remainingTabs = document.querySelectorAll('.editor-tab');
  if (remainingTabs.length === 0 && window.monacoAPI) {
    window.monacoAPI.loadFile('untitled', '// No files open\n', 'javascript');
  } else if (remainingTabs.length > 0) {
    // Switch to last tab
    const lastTab = remainingTabs[remainingTabs.length - 1];
    switchToTab(lastTab.dataset.filePath);
  }
}

/**
 * Add to recent files
 */
function addToRecentFiles(filePath) {
  const recentList = document.getElementById('recentList');
  if (!recentList) return;

  const filename = filePath.split('/').pop();
  const item = document.createElement('div');
  item.className = 'recent-item';
  item.textContent = filename;
  item.addEventListener('click', () => openFile(filePath));

  // Add to top of list
  if (recentList.firstChild) {
    recentList.insertBefore(item, recentList.firstChild);
  } else {
    recentList.appendChild(item);
  }

  // Limit to 10 recent files
  while (recentList.children.length > 10) {
    recentList.removeChild(recentList.lastChild);
  }
}

// Export functions
window.fileExplorerAPI = {
  initialize: initializeFileExplorer,
  openFile: openFile,
  saveFile: saveCurrentFile,
  closeTab: closeTab
};
