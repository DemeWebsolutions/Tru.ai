const { ipcRenderer } = require('electron');

async function loadGitPanel() {
    const sidebarContent = document.getElementById('sidebar-content');
    
    if (!appState.currentWorkspace) {
        sidebarContent.innerHTML = '<div style="padding: 16px; color: #858585;">No workspace open</div>';
        return;
    }
    
    const statusResult = await ipcRenderer.invoke('git-status', appState.currentWorkspace);
    const branchResult = await ipcRenderer.invoke('git-branch', appState.currentWorkspace);
    
    let html = '<div style="padding: 16px;">';
    
    if (branchResult.success) {
        html += `
            <div style="margin-bottom: 16px;">
                <div style="font-size: 11px; color: #858585; margin-bottom: 4px;">Current Branch</div>
                <div style="font-size: 13px; color: #cccccc;">${branchResult.current}</div>
            </div>
        `;
        document.getElementById('status-git').textContent = branchResult.current;
    }
    
    if (statusResult.success) {
        const status = statusResult.status;
        
        if (status.files.length > 0) {
            html += `
                <div style="margin-bottom: 16px;">
                    <div style="font-size: 11px; color: #858585; margin-bottom: 8px;">Changes</div>
                    <div style="max-height: 300px; overflow-y: auto;">
            `;
            
            status.files.forEach(file => {
                const statusIcon = file.working_dir === 'M' ? 'M' : file.working_dir === 'A' ? 'A' : file.working_dir === 'D' ? 'D' : '?';
                const statusColor = file.working_dir === 'M' ? '#ffa500' : file.working_dir === 'A' ? '#4ec9b0' : file.working_dir === 'D' ? '#f48771' : '#858585';
                html += `
                    <div style="padding: 4px 8px; font-size: 12px; color: ${statusColor}; cursor: pointer;" 
                         onclick="stageFile('${file.path}')">
                        <span style="margin-right: 8px;">${statusIcon}</span>
                        ${file.path}
                    </div>
                `;
            });
            
            html += '</div></div>';
        }
        
        html += `
            <div style="margin-top: 16px;">
                <button id="git-commit-btn" style="
                    width: 100%;
                    background: #007acc;
                    color: white;
                    border: none;
                    padding: 8px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-bottom: 8px;
                ">Commit</button>
                <button id="git-push-btn" style="
                    width: 100%;
                    background: #2d2d30;
                    color: #cccccc;
                    border: 1px solid #3e3e42;
                    padding: 8px;
                    border-radius: 4px;
                    cursor: pointer;
                ">Push</button>
            </div>
        `;
    } else {
        html += '<div style="color: #858585; font-size: 12px;">Not a Git repository</div>';
    }
    
    html += '</div>';
    sidebarContent.innerHTML = html;
    
    // Setup event listeners
    const commitBtn = document.getElementById('git-commit-btn');
    const pushBtn = document.getElementById('git-push-btn');
    
    if (commitBtn) {
        commitBtn.addEventListener('click', commitChanges);
    }
    
    if (pushBtn) {
        pushBtn.addEventListener('click', pushChanges);
    }
}

async function stageFile(filePath) {
    // Stage file logic would go here
    console.log('Staging file:', filePath);
}

async function commitChanges() {
    const message = prompt('Enter commit message:');
    if (!message) return;
    
    const result = await ipcRenderer.invoke('git-commit', appState.currentWorkspace, message);
    if (result.success) {
        alert('Changes committed successfully!');
        loadGitPanel();
    } else {
        alert('Failed to commit: ' + result.error);
    }
}

async function pushChanges() {
    const result = await ipcRenderer.invoke('git-push', appState.currentWorkspace);
    if (result.success) {
        alert('Changes pushed successfully!');
    } else {
        alert('Failed to push: ' + result.error);
    }
}

// Export functions
window.loadGitPanel = loadGitPanel;
