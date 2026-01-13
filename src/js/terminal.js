const { ipcRenderer } = require('electron');

let terminalId = null;
let terminalHistory = [];
let historyIndex = -1;

function toggleTerminal() {
    const terminal = document.getElementById('terminal');
    if (terminal.style.display === 'none') {
        terminal.style.display = 'flex';
        initializeTerminal();
    } else {
        terminal.style.display = 'none';
    }
}

async function initializeTerminal() {
    if (terminalId) return;
    
    terminalId = `terminal-${Date.now()}`;
    const cwd = appState.currentWorkspace || process.cwd();
    
    const result = await ipcRenderer.invoke('create-terminal', terminalId, cwd);
    if (result.success) {
        setupTerminalListeners();
    }
}

function setupTerminalListeners() {
    const input = document.getElementById('terminal-input');
    const content = document.getElementById('terminal-content');
    
    // Handle terminal output
    ipcRenderer.on('terminal-output', (event, id, data) => {
        if (id === terminalId) {
            appendTerminalOutput(data);
        }
    });
    
    // Handle terminal exit
    ipcRenderer.on('terminal-exit', (event, id) => {
        if (id === terminalId) {
            appendTerminalOutput('\n[Process exited]');
            terminalId = null;
        }
    });
    
    // Handle input
    input.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            const command = input.value;
            if (command.trim()) {
                terminalHistory.push(command);
                historyIndex = terminalHistory.length;
                appendTerminalOutput(`$ ${command}\n`);
                input.value = '';
                
                if (terminalId) {
                    await ipcRenderer.invoke('write-terminal', terminalId, command + '\n');
                }
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = terminalHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex < terminalHistory.length - 1) {
                historyIndex++;
                input.value = terminalHistory[historyIndex];
            } else {
                historyIndex = terminalHistory.length;
                input.value = '';
            }
        }
    });
    
    input.focus();
}

function appendTerminalOutput(text) {
    const content = document.getElementById('terminal-content');
    content.textContent += text;
    content.scrollTop = content.scrollHeight;
}

function clearTerminal() {
    document.getElementById('terminal-content').textContent = '';
}

// Export functions
window.toggleTerminal = toggleTerminal;
window.clearTerminal = clearTerminal;
