const { ipcRenderer } = require('electron');
const path = require('path');

let currentWorkspace = null;
let fileTree = {};

async function loadFileExplorer() {
    const sidebarContent = document.getElementById('sidebar-content');
    
    if (!currentWorkspace) {
        sidebarContent.innerHTML = `
            <div style="padding: 16px; text-align: center;">
                <p style="color: #858585; margin-bottom: 12px;">No workspace open</p>
                <button id="open-workspace-btn" style="
                    background: #007acc;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                ">Open Folder</button>
            </div>
        `;
        
        document.getElementById('open-workspace-btn').addEventListener('click', openWorkspace);
        return;
    }

    await loadDirectory(currentWorkspace);
}

async function openWorkspace() {
    const result = await ipcRenderer.invoke('open-folder-dialog');
    if (!result.canceled && result.filePaths.length > 0) {
        currentWorkspace = result.filePaths[0];
        appState.currentWorkspace = currentWorkspace;
        await loadFileExplorer();
    }
}

async function loadDirectory(dirPath) {
    const result = await ipcRenderer.invoke('read-directory', dirPath);
    if (!result.success) {
        console.error('Failed to read directory:', result.error);
        return;
    }

    const sidebarContent = document.getElementById('sidebar-content');
    const tree = buildFileTree(result.items, dirPath);
    sidebarContent.innerHTML = renderFileTree(tree, dirPath);
    
    // Add event listeners
    setupFileTreeListeners();
}

function buildFileTree(items, basePath) {
    const tree = {};
    
    items.forEach(item => {
        const relativePath = path.relative(basePath, item.path);
        const parts = relativePath.split(path.sep);
        
        let current = tree;
        parts.forEach((part, index) => {
            if (!current[part]) {
                current[part] = {
                    name: part,
                    path: path.join(basePath, ...parts.slice(0, index + 1)),
                    isDirectory: index < parts.length - 1 || item.isDirectory,
                    children: {}
                };
            }
            current = current[part].children;
        });
    });
    
    return tree;
}

function renderFileTree(tree, basePath, level = 0) {
    let html = '';
    
    Object.keys(tree).sort().forEach(key => {
        const item = tree[key];
        const indent = level * 16;
        const icon = item.isDirectory ? '📁' : getFileIcon(item.name);
        const hasChildren = Object.keys(item.children || {}).length > 0;
        
        html += `
            <div class="tree-item" data-path="${item.path}" data-type="${item.isDirectory ? 'dir' : 'file'}" style="padding-left: ${indent + 8}px;">
                <span class="tree-icon">${icon}</span>
                <span class="tree-label" title="${item.name}">${item.name}</span>
            </div>
        `;
        
        if (item.isDirectory && hasChildren) {
            html += `<div class="tree-children" style="display: none;">`;
            html += renderFileTree(item.children, basePath, level + 1);
            html += `</div>`;
        }
    });
    
    return html;
}

function getFileIcon(filename) {
    const ext = path.extname(filename).toLowerCase();
    const icons = {
        '.swift': '🔷',
        '.js': '📜',
        '.ts': '📘',
        '.html': '🌐',
        '.css': '🎨',
        '.json': '📋',
        '.md': '📝',
        '.py': '🐍',
        '.java': '☕',
        '.cpp': '⚙️',
        '.c': '⚙️',
        '.go': '🐹',
        '.rs': '🦀',
        '.php': '🐘',
        '.rb': '💎',
        '.xml': '📄',
        '.yaml': '📄',
        '.yml': '📄'
    };
    return icons[ext] || '📄';
}

function setupFileTreeListeners() {
    document.querySelectorAll('.tree-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            e.stopPropagation();
            const filePath = item.dataset.path;
            const isDirectory = item.dataset.type === 'dir';
            
            if (isDirectory) {
                // Toggle expand/collapse
                const children = item.nextElementSibling;
                if (children && children.classList.contains('tree-children')) {
                    const isExpanded = children.style.display !== 'none';
                    children.style.display = isExpanded ? 'none' : 'block';
                    item.classList.toggle('expanded');
                }
            } else {
                // Open file
                await openFile(filePath);
            }
            
            // Update selection
            document.querySelectorAll('.tree-item').forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
        });
    });
}

async function openFile(filePath) {
    const result = await ipcRenderer.invoke('read-file', filePath);
    if (!result.success) {
        alert('Failed to open file: ' + result.error);
        return;
    }

    // Add tab
    addEditorTab(filePath, result.content);
    
    // Open in editor
    const language = detectLanguage(filePath);
    openFileInEditor(filePath, result.content, language);
}

function addEditorTab(filePath, content) {
    const tabs = document.getElementById('editor-tabs');
    const filename = path.basename(filePath);
    
    // Check if tab already exists
    const existingTab = document.querySelector(`[data-file="${filePath}"]`);
    if (existingTab) {
        existingTab.click();
        return;
    }
    
    // Remove active from all tabs
    document.querySelectorAll('.editor-tab').forEach(tab => tab.classList.remove('active'));
    
    // Create new tab
    const tab = document.createElement('div');
    tab.className = 'editor-tab active';
    tab.dataset.file = filePath;
    tab.innerHTML = `
        <span>📄</span>
        <span>${filename}</span>
        <span class="tab-close">×</span>
    `;
    
    tab.addEventListener('click', () => {
        document.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        openFile(filePath);
    });
    
    tab.querySelector('.tab-close').addEventListener('click', (e) => {
        e.stopPropagation();
        closeTab(filePath);
    });
    
    tabs.appendChild(tab);
    appState.openFiles.push({ path: filePath, content });
}

function closeTab(filePath) {
    const tab = document.querySelector(`[data-file="${filePath}"]`);
    if (tab) {
        tab.remove();
        appState.openFiles = appState.openFiles.filter(f => f.path !== filePath);
        
        if (appState.activeFile === filePath) {
            appState.activeFile = null;
            if (monacoEditor) {
                monacoEditor.setValue('');
            }
        }
    }
}

function detectLanguage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const languageMap = {
        '.swift': 'swift',
        '.js': 'javascript',
        '.ts': 'typescript',
        '.html': 'html',
        '.css': 'css',
        '.json': 'json',
        '.md': 'markdown',
        '.py': 'python',
        '.java': 'java',
        '.cpp': 'cpp',
        '.c': 'c',
        '.go': 'go',
        '.rs': 'rust',
        '.php': 'php',
        '.rb': 'ruby',
        '.xml': 'xml',
        '.yaml': 'yaml',
        '.yml': 'yaml'
    };
    return languageMap[ext] || 'plaintext';
}

async function createNewFile() {
    if (!currentWorkspace) {
        alert('Please open a workspace first');
        return;
    }
    
    const filename = prompt('Enter filename:');
    if (!filename) return;
    
    const filePath = path.join(currentWorkspace, filename);
    const result = await ipcRenderer.invoke('create-file', filePath, '');
    
    if (result.success) {
        await loadFileExplorer();
        await openFile(filePath);
    } else {
        alert('Failed to create file: ' + result.error);
    }
}

async function saveCurrentFile() {
    if (!appState.activeFile) return;
    
    const content = getEditorContent();
    const result = await ipcRenderer.invoke('write-file', appState.activeFile, content);
    
    if (result.success) {
        const tab = document.querySelector(`[data-file="${appState.activeFile}"]`);
        if (tab) {
            tab.classList.remove('modified');
        }
        alert('File saved successfully!');
    } else {
        alert('Failed to save file: ' + result.error);
    }
}

function closeCurrentTab() {
    if (appState.activeFile) {
        closeTab(appState.activeFile);
    }
}

// Export functions
window.loadFileExplorer = loadFileExplorer;
window.openWorkspace = openWorkspace;
window.createNewFile = createNewFile;
window.saveCurrentFile = saveCurrentFile;
window.closeCurrentTab = closeCurrentTab;
window.openFile = openFile;
