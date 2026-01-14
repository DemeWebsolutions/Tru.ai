/**
 * Tru.ai Electron Main Process
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_ELECTRON_MAIN_V1
 */

const { app, BrowserWindow, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const { TruAiCore, RiskLevels } = require('./core/truai-core');
const simpleGit = require('simple-git');
const pty = require('node-pty');

let mainWindow;
let truaiCore;
let terminals = new Map(); // terminalId -> pty instance
let git = null;

function createWindow() {
  // Initialize TruAi Core
  truaiCore = new TruAiCore();
  truaiCore.initialize({
    adminId: 'admin-001', // TODO: Implement proper admin authentication
    offlineMode: false
  });
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: 'Tru.ai - AI-Powered IDE',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
      sandbox: true
    },
    backgroundColor: '#0f1115',
    show: false
  });

  // Load the index.html
  mainWindow.loadFile('index.html');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Handle window close
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Create application menu
  createMenu();
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New File',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-file');
          }
        },
        {
          label: 'Open File',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow.webContents.send('menu-open-file');
          }
        },
        {
          label: 'Save',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow.webContents.send('menu-save');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'AI',
      submenu: [
        {
          label: 'New Conversation',
          accelerator: 'CmdOrCtrl+Shift+N',
          click: () => {
            mainWindow.webContents.send('menu-new-conversation');
          }
        },
        {
          label: 'Open AI Panel',
          accelerator: 'CmdOrCtrl+Shift+A',
          click: () => {
            mainWindow.webContents.send('menu-toggle-ai-panel');
          }
        }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: () => {
            mainWindow.webContents.send('menu-documentation');
          }
        },
        {
          label: 'About Tru.ai',
          click: () => {
            mainWindow.webContents.send('menu-about');
          }
        }
      ]
    }
  ];

  // Add Developer menu in development mode
  if (process.env.NODE_ENV === 'development') {
    template.push({
      label: 'Developer',
      submenu: [
        { role: 'toggleDevTools' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App lifecycle events
app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  // On macOS, apps stay active until user quits explicitly
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('app:getVersion', () => {
  return app.getVersion();
});

ipcMain.handle('app:getPlatform', () => {
  return process.platform;
});

// TruAi Core IPC Handlers
ipcMain.handle('truai:getStatus', () => {
  return truaiCore.getStatus();
});

ipcMain.handle('truai:executeTask', async (event, task) => {
  return await truaiCore.executeTask(task);
});

ipcMain.handle('truai:adminOverride', (event, override) => {
  return truaiCore.adminOverride(override);
});

ipcMain.handle('truai:getAuditLog', () => {
  return truaiCore.getAuditLog();
});

ipcMain.handle('truai:verifyArtifact', (event, artifact) => {
  return truaiCore.verifyArtifact(artifact);
});

// File System IPC Handlers
ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('write-file', async (event, filePath, content) => {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('read-directory', async (event, dirPath) => {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const files = entries.map(entry => ({
      name: entry.name,
      path: path.join(dirPath, entry.name),
      isDirectory: entry.isDirectory()
    }));
    return { success: true, files };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-file', async (event, filePath, content = '') => {
  try {
    await fs.writeFile(filePath, content, 'utf-8');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('create-directory', async (event, dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('delete-file', async (event, filePath) => {
  try {
    const stats = await fs.stat(filePath);
    if (stats.isDirectory()) {
      await fs.rmdir(filePath, { recursive: true });
    } else {
      await fs.unlink(filePath);
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile']
  });
  return result;
});

ipcMain.handle('open-folder-dialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result;
});

// Terminal IPC Handlers
ipcMain.handle('create-terminal', (event, terminalId, shell) => {
  try {
    // Detect default shell if not provided
    if (!shell) {
      if (process.platform === 'win32') {
        shell = 'powershell.exe';
      } else {
        // Use SHELL environment variable or fallback to bash
        shell = process.env.SHELL || 'bash';
      }
    }
    
    const ptyProcess = pty.spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: process.env.HOME || process.cwd(),
      env: process.env
    });

    terminals.set(terminalId, ptyProcess);

    // Send output to renderer
    ptyProcess.onData((data) => {
      mainWindow.webContents.send('terminal-output', terminalId, data);
    });

    ptyProcess.onExit((code) => {
      mainWindow.webContents.send('terminal-exit', terminalId, code);
      terminals.delete(terminalId);
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('write-terminal', (event, terminalId, data) => {
  const terminal = terminals.get(terminalId);
  if (terminal) {
    terminal.write(data);
    return { success: true };
  }
  return { success: false, error: 'Terminal not found' };
});

ipcMain.handle('kill-terminal', (event, terminalId) => {
  const terminal = terminals.get(terminalId);
  if (terminal) {
    terminal.kill();
    terminals.delete(terminalId);
    return { success: true };
  }
  return { success: false, error: 'Terminal not found' };
});

// Git IPC Handlers
ipcMain.handle('git-status', async (event, repoPath) => {
  try {
    git = simpleGit(repoPath);
    const status = await git.status();
    return { success: true, status };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('git-branches', async (event, repoPath) => {
  try {
    git = simpleGit(repoPath);
    const branches = await git.branch();
    return { success: true, branches };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('git-commit', async (event, repoPath, message) => {
  try {
    git = simpleGit(repoPath);
    await git.add('./*');
    const result = await git.commit(message);
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('git-push', async (event, repoPath) => {
  try {
    git = simpleGit(repoPath);
    const result = await git.push();
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('git-pull', async (event, repoPath) => {
  try {
    git = simpleGit(repoPath);
    const result = await git.pull();
    return { success: true, result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// AI Chat IPC Handler (Enhanced with comprehensive context)
ipcMain.handle('ai-chat', async (event, message, imageData, settings, filesData = [], zipData = null, context = {}) => {
  try {
    // Route through TruAi Core for governance
    const task = {
      type: 'ai_chat',
      scope: 'user_interaction',
      isProduction: false,
      data: { message, imageData, settings, filesData, zipData, context }
    };
    
    const result = await truaiCore.executeTask(task);
    
    if (!result.approved) {
      return { success: false, error: 'Request blocked by TruAi Core governance' };
    }
    
    // Build comprehensive prompt with context
    let fullPrompt = buildPromptWithContext(message, context, filesData, zipData);
    
    // Make API call based on provider
    const { apiProvider, apiKey, model, temperature = 0.7, baseUrl } = settings;
    
    let response;
    if (apiProvider === 'openai') {
      response = await callOpenAI(fullPrompt, imageData, apiKey, model, temperature);
    } else if (apiProvider === 'anthropic') {
      response = await callAnthropic(fullPrompt, imageData, apiKey, model, temperature);
    } else if (apiProvider === 'custom') {
      response = await callCustomAPI(fullPrompt, imageData, apiKey, model, temperature, baseUrl);
    } else {
      return { success: false, error: 'Invalid API provider' };
    }
    
    // Add forensic watermark to response
    const watermarked = truaiCore.watermarkOutput(response, result.forensicId);
    
    return { success: true, content: watermarked, forensicId: result.forensicId };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Build comprehensive prompt with all context
function buildPromptWithContext(message, context, filesData, zipData) {
  let parts = [];
  
  // User message (highest priority)
  parts.push(`USER REQUEST: ${message}\n`);
  
  // Code selection context
  if (context.code_selection) {
    parts.push(`\nCODE SELECTION (${context.code_selection.language}, lines ${context.code_selection.startLine}-${context.code_selection.endLine}):\n\`\`\`${context.code_selection.language}\n${context.code_selection.content}\n\`\`\`\n`);
  } else if (context.current_file) {
    parts.push(`\nCURRENT FILE (${context.current_file.language}):\n\`\`\`${context.current_file.language}\n${context.current_file.content}\n\`\`\`\n`);
  }
  
  // Open files context
  if (context.open_files && context.open_files.length > 0) {
    parts.push(`\nOPEN FILES:\n${context.open_files.map(f => `- ${f.path} (${f.language})`).join('\n')}\n`);
  }
  
  // Project structure
  if (context.project_structure) {
    parts.push(`\nPROJECT STRUCTURE:\n${JSON.stringify(context.project_structure, null, 2)}\n`);
  }
  
  // Git context
  if (context.git_context) {
    parts.push(`\nGIT STATUS:\nBranch: ${context.git_context.branch}\nModified: ${context.git_context.modified?.length || 0} files\nStaged: ${context.git_context.staged?.length || 0} files\n`);
  }
  
  // Terminal output
  if (context.terminal_output) {
    parts.push(`\nRECENT TERMINAL OUTPUT:\n\`\`\`\n${context.terminal_output.content}\n\`\`\`\n`);
  }
  
  // Attached files (no size limit)
  if (filesData && filesData.length > 0) {
    parts.push(`\nATTACHED FILES (${filesData.length}):\n`);
    filesData.forEach(file => {
      if (file.content.encoding === 'utf-8') {
        parts.push(`\nFile: ${file.name}\n\`\`\`\n${file.content.data}\n\`\`\`\n`);
      } else {
        parts.push(`\nFile: ${file.name} (binary, ${file.size} bytes)\n`);
      }
    });
  }
  
  // ZIP contents (no size limit)
  if (zipData) {
    parts.push(`\nZIP CONTENTS (${zipData.fileCount} files from ${zipData.name}):\n`);
    zipData.files.forEach(file => {
      parts.push(`\nFile: ${file.path}\n\`\`\`\n${file.content}\n\`\`\`\n`);
    });
  }
  
  return parts.join('\n');
}

// Get project structure
ipcMain.handle('get-project-structure', async (event, workspacePath) => {
  try {
    const structure = await scanProjectStructure(workspacePath);
    return structure;
  } catch (error) {
    return { error: error.message };
  }
});

async function scanProjectStructure(dirPath, maxDepth = 3, currentDepth = 0) {
  if (currentDepth >= maxDepth) {
    return { truncated: true };
  }
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const structure = {
      folders: [],
      files: [],
      configFiles: []
    };
    
    // Config file patterns
    const configPatterns = ['package.json', 'composer.json', 'requirements.txt', 'Gemfile', 'pom.xml', 'build.gradle', 'Cargo.toml', 'go.mod', '.env'];
    
    for (const entry of entries) {
      // Skip hidden and node_modules
      if (entry.name.startsWith('.') && entry.name !== '.env') continue;
      if (entry.name === 'node_modules' || entry.name === 'vendor' || entry.name === 'dist' || entry.name === 'build') continue;
      
      const fullPath = path.join(dirPath, entry.name);
      
      if (entry.isDirectory()) {
        structure.folders.push(entry.name);
        // Recursively scan subdirectories
        if (currentDepth < maxDepth - 1) {
          const subStructure = await scanProjectStructure(fullPath, maxDepth, currentDepth + 1);
          // Merge subdirectory info
        }
      } else {
        structure.files.push(entry.name);
        
        // Check for config files
        if (configPatterns.includes(entry.name)) {
          try {
            const content = await fs.readFile(fullPath, 'utf-8');
            structure.configFiles.push({
              name: entry.name,
              content: content.substring(0, 5000) // Limit to 5KB
            });
          } catch (err) {
            // Skip if can't read
          }
        }
      }
    }
    
    return structure;
  } catch (error) {
    return { error: error.message };
  }
}

// Extract ZIP file (no size limit)
ipcMain.handle('extract-zip', async (event, zipPath) => {
  try {
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries();
    
    const files = [];
    for (const entry of zipEntries) {
      if (!entry.isDirectory) {
        try {
          const content = entry.getData().toString('utf8');
          files.push({
            path: entry.entryName,
            content: content,
            size: entry.header.size
          });
        } catch (err) {
          // Binary file or error, skip
          files.push({
            path: entry.entryName,
            content: '[Binary file]',
            size: entry.header.size
          });
        }
      }
    }
    
    return { success: true, files };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

async function callOpenAI(message, imageData, apiKey, model, temperature) {
  const https = require('https');
  const url = require('url');
  
  const messages = [{ role: 'user', content: message }];
  
  // Add image if provided and model supports vision
  if (imageData && (model === 'gpt-4' || model.includes('vision'))) {
    messages[0].content = [
      { type: 'text', text: message },
      { type: 'image_url', image_url: { url: imageData } }
    ];
  }
  
  const requestData = JSON.stringify({
    model: model,
    messages: messages,
    temperature: temperature
  });
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(requestData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error.message));
          } else {
            resolve(parsed.choices[0].message.content);
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(requestData);
    req.end();
  });
}

async function callAnthropic(message, imageData, apiKey, model, temperature) {
  const https = require('https');
  
  const messages = [{ role: 'user', content: message }];
  
  // Add image if provided
  if (imageData) {
    const base64Data = imageData.split(',')[1];
    const mediaType = imageData.split(';')[0].split(':')[1];
    messages[0].content = [
      { type: 'text', text: message },
      { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } }
    ];
  }
  
  const requestData = JSON.stringify({
    model: model,
    max_tokens: 1024,
    messages: messages,
    temperature: temperature
  });
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(requestData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error.message));
          } else {
            resolve(parsed.content[0].text);
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(requestData);
    req.end();
  });
}

async function callCustomAPI(message, imageData, apiKey, model, temperature, baseUrl) {
  // Simple custom API implementation
  // Assumes OpenAI-compatible endpoint
  const https = require('https');
  const url = require('url');
  
  const parsedUrl = new url.URL(baseUrl);
  const messages = [{ role: 'user', content: message }];
  
  const requestData = JSON.stringify({
    model: model,
    messages: messages,
    temperature: temperature
  });
  
  return new Promise((resolve, reject) => {
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(requestData)
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) {
            reject(new Error(parsed.error.message));
          } else {
            resolve(parsed.choices[0].message.content);
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(requestData);
    req.end();
  });
}
