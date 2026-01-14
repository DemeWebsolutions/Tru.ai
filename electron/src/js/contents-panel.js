/**
 * TruAi Desktop IDE - Contents Panel
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_CONTENTS_PANEL_V1
 */

// Contents Panel - File structure and outline view

function loadContentsPanel() {
    if (!appState.currentWorkspace) {
        document.getElementById('contents-tree').innerHTML = '<div style="padding: 16px; color: #858585;">No workspace open</div>';
        return;
    }
    
    loadFileStructure();
    loadOutline();
}

async function loadFileStructure() {
    if (!appState.currentWorkspace) return;
    
    const result = await ipcRenderer.invoke('read-directory', appState.currentWorkspace);
    if (!result.success) return;
    
    const tree = buildContentsTree(result.items, appState.currentWorkspace);
    const html = renderContentsTree(tree, appState.currentWorkspace);
    document.getElementById('contents-tree').innerHTML = html;
    
    setupContentsListeners();
}

function buildContentsTree(items, basePath) {
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

function renderContentsTree(tree, basePath, level = 0) {
    let html = '';
    
    Object.keys(tree).sort().forEach(key => {
        const item = tree[key];
        const indent = level * 16;
        const icon = item.isDirectory ? '📁' : getFileIcon(item.name);
        const hasChildren = Object.keys(item.children || {}).length > 0;
        
        html += `
            <div class="tree-item" data-path="${item.path}" data-type="${item.isDirectory ? 'dir' : 'file'}" 
                 style="padding-left: ${indent + 8}px; padding: 4px ${indent + 8}px;">
                <span class="tree-icon">${icon}</span>
                <span class="tree-label" title="${item.name}">${item.name}</span>
            </div>
        `;
        
        if (item.isDirectory && hasChildren) {
            html += `<div class="tree-children" style="display: none;">`;
            html += renderContentsTree(item.children, basePath, level + 1);
            html += `</div>`;
        }
    });
    
    return html;
}

function setupContentsListeners() {
    document.querySelectorAll('#contents-tree .tree-item').forEach(item => {
        item.addEventListener('click', async (e) => {
            e.stopPropagation();
            const filePath = item.dataset.path;
            const isDirectory = item.dataset.type === 'dir';
            
            if (isDirectory) {
                const children = item.nextElementSibling;
                if (children && children.classList.contains('tree-children')) {
                    const isExpanded = children.style.display !== 'none';
                    children.style.display = isExpanded ? 'none' : 'block';
                    item.classList.toggle('expanded');
                }
            } else {
                await openFile(filePath);
            }
        });
    });
}

function loadOutline() {
    if (!monacoEditor) {
        document.getElementById('outline-view').innerHTML = '<div style="padding: 16px; color: #858585;">No file open</div>';
        return;
    }
    
    const model = monacoEditor.getModel();
    if (!model) {
        document.getElementById('outline-view').innerHTML = '<div style="padding: 16px; color: #858585;">No file open</div>';
        return;
    }
    
    // Extract outline from code (simplified - would use Monaco's document symbols API in production)
    const content = model.getValue();
    const lines = content.split('\n');
    let html = '<div style="padding: 8px;">';
    
    lines.forEach((line, index) => {
        const trimmed = line.trim();
        // Simple pattern matching for functions, classes, etc.
        if (trimmed.match(/^(func|class|struct|enum|protocol|extension)\s+\w+/)) {
            const name = trimmed.match(/(?:func|class|struct|enum|protocol|extension)\s+(\w+)/)?.[1] || 'Unknown';
            html += `
                <div class="outline-item" style="padding: 4px 8px; cursor: pointer; font-size: 12px; color: #cccccc;"
                     onclick="goToLine(${index + 1})">
                    ${name}
                </div>
            `;
        }
    });
    
    if (html === '<div style="padding: 8px;">') {
        html += '<div style="color: #858585; font-size: 12px;">No symbols found</div>';
    }
    
    html += '</div>';
    document.getElementById('outline-view').innerHTML = html;
}

// Update outline when editor content changes
if (window.monacoEditor) {
    window.monacoEditor.onDidChangeModelContent(() => {
        if (document.getElementById('outline-tab').classList.contains('active')) {
            loadOutline();
        }
    });
}

// Export functions
window.loadContentsPanel = loadContentsPanel;
window.loadFileStructure = loadFileStructure;
window.loadOutline = loadOutline;
