/**
 * TruAi Desktop IDE - Search Functionality
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_SEARCH_V1
 */

const { ipcRenderer } = require('electron');
const fs = require('fs').promises;
const path = require('path');

async function loadSearchPanel() {
    const sidebarContent = document.getElementById('sidebar-content');
    
    sidebarContent.innerHTML = `
        <div style="padding: 16px;">
            <div style="margin-bottom: 12px;">
                <input type="text" id="search-input" placeholder="Search in files..." 
                       style="width: 100%; padding: 8px; background: #2d2d30; border: 1px solid #3e3e42; 
                              color: #cccccc; border-radius: 4px; font-size: 13px;" />
            </div>
            <div style="margin-bottom: 12px;">
                <label style="display: flex; align-items: center; gap: 8px; color: #cccccc; font-size: 12px;">
                    <input type="checkbox" id="case-sensitive" />
                    Match case
                </label>
                <label style="display: flex; align-items: center; gap: 8px; color: #cccccc; font-size: 12px;">
                    <input type="checkbox" id="whole-word" />
                    Whole word
                </label>
            </div>
            <button id="search-btn" style="
                width: 100%;
                background: #007acc;
                color: white;
                border: none;
                padding: 8px;
                border-radius: 4px;
                cursor: pointer;
            ">Search</button>
            <div id="search-results" style="margin-top: 16px; max-height: 400px; overflow-y: auto;"></div>
        </div>
    `;
    
    document.getElementById('search-btn').addEventListener('click', performSearch);
    document.getElementById('search-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

async function performSearch() {
    const query = document.getElementById('search-input').value;
    if (!query) return;
    
    if (!appState.currentWorkspace) {
        alert('Please open a workspace first');
        return;
    }
    
    const caseSensitive = document.getElementById('case-sensitive').checked;
    const wholeWord = document.getElementById('whole-word').checked;
    const resultsDiv = document.getElementById('search-results');
    
    resultsDiv.innerHTML = '<div style="color: #858585; padding: 8px;">Searching...</div>';
    
    try {
        const results = await searchInDirectory(appState.currentWorkspace, query, caseSensitive, wholeWord);
        displaySearchResults(results);
    } catch (error) {
        resultsDiv.innerHTML = `<div style="color: #f48771; padding: 8px;">Error: ${error.message}</div>`;
    }
}

async function searchInDirectory(dirPath, query, caseSensitive, wholeWord) {
    const results = [];
    const files = await getAllFiles(dirPath);
    
    const flags = caseSensitive ? 'g' : 'gi';
    const pattern = wholeWord ? `\\b${query}\\b` : query;
    const regex = new RegExp(pattern, flags);
    
    for (const file of files) {
        try {
            const content = await fs.readFile(file, 'utf-8');
            const lines = content.split('\n');
            
            lines.forEach((line, index) => {
                if (regex.test(line)) {
                    results.push({
                        file,
                        line: index + 1,
                        content: line.trim(),
                        matches: line.match(regex) || []
                    });
                }
            });
        } catch (error) {
            // Skip files that can't be read
        }
    }
    
    return results;
}

async function getAllFiles(dirPath) {
    const files = [];
    
    async function traverse(currentPath) {
        const entries = await fs.readdir(currentPath, { withFileTypes: true });
        
        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            
            // Skip node_modules, .git, etc.
            if (entry.name.startsWith('.') || entry.name === 'node_modules') {
                continue;
            }
            
            if (entry.isDirectory()) {
                await traverse(fullPath);
            } else {
                files.push(fullPath);
            }
        }
    }
    
    await traverse(dirPath);
    return files;
}

function displaySearchResults(results) {
    const resultsDiv = document.getElementById('search-results');
    
    if (results.length === 0) {
        resultsDiv.innerHTML = '<div style="color: #858585; padding: 8px;">No results found</div>';
        return;
    }
    
    let html = `<div style="color: #858585; font-size: 11px; margin-bottom: 8px;">${results.length} results</div>`;
    
    // Group by file
    const byFile = {};
    results.forEach(result => {
        if (!byFile[result.file]) {
            byFile[result.file] = [];
        }
        byFile[result.file].push(result);
    });
    
    Object.keys(byFile).forEach(file => {
        const filename = path.basename(file);
        html += `
            <div style="margin-bottom: 12px;">
                <div style="color: #007acc; font-size: 12px; margin-bottom: 4px; cursor: pointer;"
                     onclick="openFile('${file}')">${filename}</div>
        `;
        
        byFile[file].forEach(result => {
            html += `
                <div style="padding: 4px 8px; font-size: 11px; color: #858585; cursor: pointer;"
                     onclick="openFileAtLine('${file}', ${result.line})">
                    ${result.line}: ${result.content}
                </div>
            `;
        });
        
        html += '</div>';
    });
    
    resultsDiv.innerHTML = html;
}

function openFileAtLine(filePath, lineNumber) {
    openFile(filePath).then(() => {
        if (monacoEditor) {
            monacoEditor.setPosition({ lineNumber, column: 1 });
                monacoEditor.revealLineInCenter(lineNumber);
        }
    });
}

// Export functions
window.loadSearchPanel = loadSearchPanel;
