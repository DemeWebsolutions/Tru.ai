/**
 * Tru.ai Electron Preload Script
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_ELECTRON_PRELOAD_V1
 * 
 * This script runs in a secure context with access to Node.js APIs
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // App information
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  getPlatform: () => ipcRenderer.invoke('app:getPlatform'),
  
  // Generic invoke method for all IPC calls
  invoke: (channel, ...args) => ipcRenderer.invoke(channel, ...args),
  
  // Menu event listeners
  onNewFile: (callback) => ipcRenderer.on('menu-new-file', callback),
  onOpenFile: (callback) => ipcRenderer.on('menu-open-file', callback),
  onSave: (callback) => ipcRenderer.on('menu-save', callback),
  onNewConversation: (callback) => ipcRenderer.on('menu-new-conversation', callback),
  onToggleAIPanel: (callback) => ipcRenderer.on('menu-toggle-ai-panel', callback),
  onDocumentation: (callback) => ipcRenderer.on('menu-documentation', callback),
  onAbout: (callback) => ipcRenderer.on('menu-about', callback),
  
  // Terminal event listeners
  onTerminalOutput: (callback) => ipcRenderer.on('terminal-output', (event, terminalId, data) => callback(terminalId, data)),
  onTerminalExit: (callback) => ipcRenderer.on('terminal-exit', (event, terminalId, code) => callback(terminalId, code))
});

// Expose TruAi Core API to renderer process
contextBridge.exposeInMainWorld('truaiCore', {
  getStatus: () => ipcRenderer.invoke('truai:getStatus'),
  executeTask: (task) => ipcRenderer.invoke('truai:executeTask', task),
  adminOverride: (override) => ipcRenderer.invoke('truai:adminOverride', override),
  getAuditLog: () => ipcRenderer.invoke('truai:getAuditLog'),
  verifyArtifact: (artifact) => ipcRenderer.invoke('truai:verifyArtifact', artifact)
});

// Log preload script loaded (for debugging)
console.log('Tru.ai preload script loaded');
