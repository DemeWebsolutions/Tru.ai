const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File system operations
  readFile: (filePath) => ipcRenderer.invoke('file:read', filePath),
  writeFile: (filePath, content) => ipcRenderer.invoke('file:write', filePath, content),
  readDirectory: (dirPath) => ipcRenderer.invoke('file:readdir', dirPath),

  // Dialogs
  openFileDialog: () => ipcRenderer.invoke('dialog:openFile'),
  openFolderDialog: () => ipcRenderer.invoke('dialog:openFolder'),
  saveFileDialog: (defaultPath) => ipcRenderer.invoke('dialog:saveFile', defaultPath),

  // Store (persistent settings)
  getStoreValue: (key) => ipcRenderer.invoke('store:get', key),
  setStoreValue: (key, value) => ipcRenderer.invoke('store:set', key, value),

  // Menu event listeners
  onMenuNewFile: (callback) => ipcRenderer.on('menu-new-file', callback),
  onMenuOpenFile: (callback) => ipcRenderer.on('menu-open-file', (event, filePath) => callback(filePath)),
  onMenuOpenFolder: (callback) => ipcRenderer.on('menu-open-folder', (event, folderPath) => callback(folderPath)),
  onMenuSave: (callback) => ipcRenderer.on('menu-save', callback),
  onMenuSaveAll: (callback) => ipcRenderer.on('menu-save-all', callback),
  onMenuFind: (callback) => ipcRenderer.on('menu-find', callback),
  onMenuReplace: (callback) => ipcRenderer.on('menu-replace', callback),
  onMenuCommandPalette: (callback) => ipcRenderer.on('menu-command-palette', callback),
  onMenuToggleSidebar: (callback) => ipcRenderer.on('menu-toggle-sidebar', callback),
  onMenuToggleTerminal: (callback) => ipcRenderer.on('menu-toggle-terminal', callback),
  onMenuAskAI: (callback) => ipcRenderer.on('menu-ask-ai', callback),
  onMenuNewConversation: (callback) => ipcRenderer.on('menu-new-conversation', callback),
  onMenuAISettings: (callback) => ipcRenderer.on('menu-ai-settings', callback),

  // Platform info
  platform: process.platform,
  versions: process.versions
});
