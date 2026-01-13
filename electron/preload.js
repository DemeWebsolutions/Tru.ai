// Tru.ai Electron Preload Script
// Copyright © 2026 My Deme, LLC. All rights reserved.
// This script runs in a secure context with access to Node.js APIs

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // App information
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
  
  // Menu event listeners
  onNewFile: (callback) => ipcRenderer.on('menu-new-file', callback),
  onOpenFile: (callback) => ipcRenderer.on('menu-open-file', callback),
  onSave: (callback) => ipcRenderer.on('menu-save', callback),
  onNewConversation: (callback) => ipcRenderer.on('menu-new-conversation', callback),
  onToggleAIPanel: (callback) => ipcRenderer.on('menu-toggle-ai-panel', callback),
  onDocumentation: (callback) => ipcRenderer.on('menu-documentation', callback),
  onAbout: (callback) => ipcRenderer.on('menu-about', callback)
});

// Log preload script loaded (for debugging)
console.log('Tru.ai preload script loaded');
