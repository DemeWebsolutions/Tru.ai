/**
 * TruAi Dashboard - IDE Layout
 * 
 * Main IDE interface matching the Electron app exactly
 * Activity Bar → Sidebar → Editor → Terminal → Status Bar
 * 
 * @package TruAi
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    const api = new TruAiAPI();
    
    // Render IDE layout
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="ide-container">
            <!-- Activity Bar (leftmost) -->
            <div class="activity-bar">
                <div class="activity-icons">
                    <button class="activity-icon active" data-panel="explorer" title="Explorer">
                        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>
                    </button>
                    <button class="activity-icon" data-panel="search" title="Search">
                        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                    </button>
                    <button class="activity-icon" data-panel="git" title="Source Control">
                        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.7 7.3l-10-10c-.4-.4-1-.4-1.4 0l-10 10c-.4.4-.4 1 0 1.4l10 10c.4.4 1 .4 1.4 0l10-10c.4-.4.4-1 0-1.4zM12 18.6L5.4 12 12 5.4 18.6 12 12 18.6z"/></svg>
                    </button>
                    <button class="activity-icon" data-panel="ai" title="Tru.ai">
                        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M13 3C8.03 3 4 7.03 4 12s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-7.5 9c-.83 0-1.5-.67-1.5-1.5S4.67 9 5.5 9 7 9.67 7 10.5 6.33 12 5.5 12zm3-4C7.67 8 7 7.33 7 6.5S7.67 5 8.5 5s1.5.67 1.5 1.5S9.33 8 8.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S12.67 5 13.5 5s1.5.67 1.5 1.5S14.33 8 13.5 8zm4.5 4c-.83 0-1.5-.67-1.5-1.5S17.17 9 18 9s1.5.67 1.5 1.5S18.83 12 18 12z"/></svg>
                    </button>
                </div>
                <div class="activity-icons-bottom">
                    <button class="activity-icon" id="settingsBtn" title="Settings">
                        <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22l-1.91 3.32c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>
                    </button>
                </div>
            </div>

            <!-- Sidebar (file explorer, search, git, AI panels) -->
            <div class="sidebar" id="sidebar">
                <div class="sidebar-header">
                    <span id="sidebarTitle">EXPLORER</span>
                    <button class="sidebar-action" id="refreshBtn" title="Refresh">
                        <svg width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>
                    </button>
                </div>
                <div class="sidebar-content" id="sidebarContent">
                    <!-- Content will be dynamically loaded based on active panel -->
                </div>
            </div>

            <!-- Main Content Area (editor + terminal) -->
            <div class="main-area">
                <!-- Editor Area -->
                <div class="editor-area">
                    <div class="editor-tabs" id="editorTabs">
                        <div class="no-tabs">No file open</div>
                    </div>
                    <div class="editor-content" id="editorContent">
                        <div class="editor-welcome">
                            <h1>Tru.ai</h1>
                            <p>Super Admin AI Platform</p>
                            <div class="welcome-actions">
                                <button class="welcome-btn" id="openFolderBtn">
                                    📁 Open Folder
                                </button>
                                <button class="welcome-btn" id="newFileBtn">
                                    📄 New File
                                </button>
                                <button class="welcome-btn" id="askAiBtn">
                                    🤖 Ask Tru.ai
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Terminal Panel (toggleable) -->
                <div class="terminal-panel hidden" id="terminalPanel">
                    <div class="terminal-header">
                        <div class="terminal-tabs">
                            <div class="terminal-tab active">Terminal</div>
                            <div class="terminal-tab">Output</div>
                            <div class="terminal-tab">Problems</div>
                        </div>
                        <button class="terminal-close" id="closeTerminalBtn">×</button>
                    </div>
                    <div class="terminal-content" id="terminalContent">
                        <div class="terminal-line">$ Welcome to Tru.ai Terminal</div>
                        <div class="terminal-line">$ Type 'help' for available commands</div>
                        <div class="terminal-input-line">
                            <span class="terminal-prompt">$</span>
                            <input type="text" class="terminal-input" id="terminalInput" />
                        </div>
                    </div>
                </div>
            </div>

            <!-- Status Bar (bottom) -->
            <div class="status-bar">
                <div class="status-left">
                    <span class="status-item" id="statusFile">No file open</span>
                    <span class="status-item status-modified hidden" id="statusModified">●</span>
                </div>
                <div class="status-right">
                    <span class="status-item" id="statusBranch">📍 main</span>
                    <span class="status-item" id="statusPosition">Ln 1, Col 1</span>
                    <span class="status-item">UTF-8</span>
                    <span class="status-item">LF</span>
                    <span class="status-item" id="statusUser">👤 ${window.TRUAI_CONFIG.USERNAME || 'Guest'}</span>
                </div>
            </div>
        </div>
    `;

    // State
    let activePanel = 'explorer';
    let openTabs = [];
    let activeTabId = null;
    let terminalVisible = false;

    // Event Listeners
    
    // Activity bar clicks
    document.querySelectorAll('.activity-icon[data-panel]').forEach(icon => {
        icon.addEventListener('click', function() {
            const panel = this.dataset.panel;
            switchPanel(panel);
        });
    });

    // Welcome actions
    document.getElementById('openFolderBtn')?.addEventListener('click', () => {
        alert('Open Folder: In production, this would open a folder picker');
    });

    document.getElementById('newFileBtn')?.addEventListener('click', createNewFile);
    document.getElementById('askAiBtn')?.addEventListener('click', () => switchPanel('ai'));

    // Settings
    document.getElementById('settingsBtn')?.addEventListener('click', () => {
        alert('Settings: User preferences, AI configuration, etc.');
    });

    // Terminal close
    document.getElementById('closeTerminalBtn')?.addEventListener('click', () => {
        toggleTerminal(false);
    });

    // Functions

    function switchPanel(panel) {
        activePanel = panel;
        
        // Update activity bar
        document.querySelectorAll('.activity-icon').forEach(icon => {
            icon.classList.toggle('active', icon.dataset.panel === panel);
        });

        // Update sidebar title
        const titles = {
            explorer: 'EXPLORER',
            search: 'SEARCH',
            git: 'SOURCE CONTROL',
            ai: 'TRU.AI ASSISTANT'
        };
        document.getElementById('sidebarTitle').textContent = titles[panel] || panel.toUpperCase();

        // Load panel content
        loadPanelContent(panel);
    }

    function loadPanelContent(panel) {
        const content = document.getElementById('sidebarContent');
        
        switch(panel) {
            case 'explorer':
                content.innerHTML = `
                    <div class="panel-content">
                        <div class="explorer-section">
                            <div class="section-title">WORKSPACE</div>
                            <div class="file-tree">
                                <div class="file-item">
                                    <span class="file-icon">📁</span>
                                    <span>src/</span>
                                </div>
                                <div class="file-item">
                                    <span class="file-icon">📁</span>
                                    <span>tests/</span>
                                </div>
                                <div class="file-item">
                                    <span class="file-icon">📄</span>
                                    <span>README.md</span>
                                </div>
                                <div class="file-item">
                                    <span class="file-icon">📄</span>
                                    <span>package.json</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;

            case 'search':
                content.innerHTML = `
                    <div class="panel-content">
                        <input type="text" class="search-input" placeholder="Search..." />
                        <div class="search-results">
                            <div class="search-empty">No results</div>
                        </div>
                    </div>
                `;
                break;

            case 'git':
                content.innerHTML = `
                    <div class="panel-content">
                        <div class="git-section">
                            <div class="section-title">SOURCE CONTROL</div>
                            <div class="git-status">
                                <div class="git-item">● main</div>
                                <div class="git-item">No changes</div>
                            </div>
                        </div>
                    </div>
                `;
                break;

            case 'ai':
                content.innerHTML = `
                    <div class="panel-content ai-panel">
                        <div class="ai-header">
                            <h3>Tru.ai Assistant</h3>
                            <p class="ai-subtitle">Your Super Admin AI</p>
                        </div>
                        
                        <div class="ai-chat" id="aiChat">
                            <div class="ai-message assistant">
                                <div class="message-content">
                                    Hello! I'm Tru.ai, your Super Admin AI assistant. I can help you with:
                                    <ul>
                                        <li>Code generation and refactoring</li>
                                        <li>System architecture and design</li>
                                        <li>Debugging and optimization</li>
                                        <li>Documentation and testing</li>
                                    </ul>
                                    How can I assist you today?
                                </div>
                            </div>
                        </div>
                        
                        <div class="ai-input-area">
                            <textarea 
                                id="aiInput" 
                                class="ai-input" 
                                placeholder="Ask Tru.ai anything..."
                                rows="3"
                            ></textarea>
                            <div class="ai-input-actions">
                                <select id="aiTier" class="tier-select">
                                    <option value="auto">Auto</option>
                                    <option value="cheap">Cheap (GPT-3.5)</option>
                                    <option value="mid">Mid (GPT-4)</option>
                                    <option value="high">High (GPT-4 Turbo)</option>
                                </select>
                                <button id="aiSendBtn" class="btn-send">Send →</button>
                            </div>
                        </div>
                    </div>
                `;
                
                // Add event listener for AI send button
                document.getElementById('aiSendBtn')?.addEventListener('click', handleAiMessage);
                document.getElementById('aiInput')?.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        handleAiMessage();
                    }
                });
                break;
        }
    }

    async function handleAiMessage() {
        const input = document.getElementById('aiInput');
        const tier = document.getElementById('aiTier').value;
        const message = input.value.trim();
        
        if (!message) return;

        const chat = document.getElementById('aiChat');
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'ai-message user';
        userMsg.innerHTML = `<div class="message-content">${escapeHtml(message)}</div>`;
        chat.appendChild(userMsg);
        
        // Clear input
        input.value = '';
        
        // Add loading message
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'ai-message assistant';
        loadingMsg.innerHTML = `<div class="message-content">Thinking...</div>`;
        chat.appendChild(loadingMsg);
        chat.scrollTop = chat.scrollHeight;

        try {
            // Create and execute task
            const taskResult = await api.createTask(message, null, tier);
            const execResult = await api.executeTask(taskResult.task_id);
            
            // Replace loading message with response
            loadingMsg.innerHTML = `
                <div class="message-content">
                    <div class="ai-response-header">
                        <strong>Tier:</strong> ${execResult.model_used || taskResult.assigned_tier}
                        <strong>Risk:</strong> ${taskResult.risk_level}
                    </div>
                    <pre>${escapeHtml(execResult.output)}</pre>
                    ${taskResult.risk_level === 'HIGH' ? `
                        <div class="ai-actions">
                            <button class="btn-small btn-approve" onclick="approveTask('${taskResult.task_id}')">✓ Approve</button>
                            <button class="btn-small btn-reject" onclick="rejectTask('${taskResult.task_id}')">✗ Reject</button>
                        </div>
                    ` : ''}
                </div>
            `;
        } catch (error) {
            loadingMsg.innerHTML = `
                <div class="message-content error">
                    ✗ Error: ${escapeHtml(error.message)}
                </div>
            `;
        }
        
        chat.scrollTop = chat.scrollHeight;
    }

    function createNewFile() {
        const fileName = prompt('Enter file name:', 'untitled.txt');
        if (!fileName) return;

        const tabId = 'tab-' + Date.now();
        openTabs.push({
            id: tabId,
            name: fileName,
            content: '',
            modified: false
        });

        renderTabs();
        switchToTab(tabId);
    }

    function renderTabs() {
        const tabsContainer = document.getElementById('editorTabs');
        
        if (openTabs.length === 0) {
            tabsContainer.innerHTML = '<div class="no-tabs">No file open</div>';
            return;
        }

        tabsContainer.innerHTML = openTabs.map(tab => `
            <div class="editor-tab ${tab.id === activeTabId ? 'active' : ''}" data-tab-id="${tab.id}">
                <span class="tab-name">${tab.name}</span>
                ${tab.modified ? '<span class="tab-modified">●</span>' : ''}
                <button class="tab-close" data-tab-id="${tab.id}">×</button>
            </div>
        `).join('');

        // Add click handlers
        tabsContainer.querySelectorAll('.editor-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                if (!e.target.classList.contains('tab-close')) {
                    switchToTab(tab.dataset.tabId);
                }
            });
        });

        tabsContainer.querySelectorAll('.tab-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeTab(btn.dataset.tabId);
            });
        });
    }

    function switchToTab(tabId) {
        activeTabId = tabId;
        const tab = openTabs.find(t => t.id === tabId);
        
        if (!tab) return;

        renderTabs();
        
        const editorContent = document.getElementById('editorContent');
        editorContent.innerHTML = `
            <div class="code-editor">
                <textarea 
                    id="codeEditor" 
                    class="code-textarea"
                    placeholder="Start typing..."
                >${tab.content}</textarea>
            </div>
        `;

        // Update status bar
        document.getElementById('statusFile').textContent = tab.name;
        
        // Add input handler
        const editor = document.getElementById('codeEditor');
        editor?.addEventListener('input', () => {
            tab.content = editor.value;
            tab.modified = true;
            renderTabs();
            updateStatusBar();
        });

        editor?.addEventListener('keyup', updateCursorPosition);
        editor?.addEventListener('click', updateCursorPosition);
    }

    function closeTab(tabId) {
        const tabIndex = openTabs.findIndex(t => t.id === tabId);
        if (tabIndex === -1) return;

        const tab = openTabs[tabIndex];
        if (tab.modified) {
            if (!confirm(`Do you want to save changes to ${tab.name}?`)) {
                return;
            }
        }

        openTabs.splice(tabIndex, 1);

        if (activeTabId === tabId) {
            activeTabId = openTabs.length > 0 ? openTabs[0].id : null;
        }

        if (openTabs.length === 0) {
            const editorContent = document.getElementById('editorContent');
            editorContent.innerHTML = `
                <div class="editor-welcome">
                    <h1>Tru.ai</h1>
                    <p>Super Admin AI Platform</p>
                    <div class="welcome-actions">
                        <button class="welcome-btn" onclick="document.getElementById('openFolderBtn').click()">
                            📁 Open Folder
                        </button>
                        <button class="welcome-btn" onclick="document.getElementById('newFileBtn').click()">
                            📄 New File
                        </button>
                        <button class="welcome-btn" onclick="document.getElementById('askAiBtn').click()">
                            🤖 Ask Tru.ai
                        </button>
                    </div>
                </div>
            `;
        } else {
            switchToTab(activeTabId);
        }

        renderTabs();
    }

    function toggleTerminal(show) {
        terminalVisible = show !== undefined ? show : !terminalVisible;
        const terminal = document.getElementById('terminalPanel');
        terminal.classList.toggle('hidden', !terminalVisible);
    }

    function updateCursorPosition() {
        const editor = document.getElementById('codeEditor');
        if (!editor) return;

        const text = editor.value;
        const pos = editor.selectionStart;
        const lines = text.substr(0, pos).split('\n');
        const line = lines.length;
        const col = lines[lines.length - 1].length + 1;

        document.getElementById('statusPosition').textContent = `Ln ${line}, Col ${col}`;
    }

    function updateStatusBar() {
        const tab = openTabs.find(t => t.id === activeTabId);
        if (tab && tab.modified) {
            document.getElementById('statusModified').classList.remove('hidden');
        } else {
            document.getElementById('statusModified').classList.add('hidden');
        }
    }

    // Global functions for button handlers
    window.approveTask = async function(taskId) {
        try {
            await api.approveTask(taskId, 'APPROVE');
            alert('Task approved successfully');
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    window.rejectTask = async function(taskId) {
        try {
            await api.approveTask(taskId, 'REJECT');
            alert('Task rejected');
        } catch (error) {
            alert('Error: ' + error.message);
        }
    };

    // Utility
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Cmd/Ctrl + ` to toggle terminal
        if ((e.metaKey || e.ctrlKey) && e.key === '`') {
            e.preventDefault();
            toggleTerminal();
        }
        
        // Cmd/Ctrl + N for new file
        if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
            e.preventDefault();
            createNewFile();
        }
        
        // Cmd/Ctrl + S to save
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
            e.preventDefault();
            const tab = openTabs.find(t => t.id === activeTabId);
            if (tab) {
                tab.modified = false;
                renderTabs();
                updateStatusBar();
                console.log('File saved:', tab.name);
            }
        }
    });

    // Initialize
    loadPanelContent('explorer');
});
