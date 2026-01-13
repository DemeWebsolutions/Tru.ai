/**
 * Terminal Module
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_TERMINAL_V1
 */

let currentTerminalId = 'terminal-1';
let commandHistory = [];
let historyIndex = -1;

/**
 * Initialize terminal
 */
async function initializeTerminal() {
  const terminalInput = document.getElementById('terminalInput');
  if (!terminalInput) {
    console.error('Terminal input not found');
    return;
  }

  // Create terminal process
  await createTerminalProcess();

  // Setup input listeners
  terminalInput.addEventListener('keydown', handleTerminalKeydown);

  // Listen for terminal output
  if (window.electronAPI && window.electronAPI.onTerminalOutput) {
    window.electronAPI.onTerminalOutput((terminalId, data) => {
      if (terminalId === currentTerminalId) {
        appendTerminalOutput(data);
      }
    });
  }

  // Listen for terminal exit
  if (window.electronAPI && window.electronAPI.onTerminalExit) {
    window.electronAPI.onTerminalExit((terminalId, code) => {
      if (terminalId === currentTerminalId) {
        appendTerminalOutput(`\nProcess exited with code ${code}\n`);
      }
    });
  }

  console.log('Terminal initialized');
}

/**
 * Create terminal process
 */
async function createTerminalProcess() {
  try {
    const result = await window.electronAPI.invoke('create-terminal', currentTerminalId);
    if (result.success) {
      console.log('Terminal process created');
    } else {
      console.error('Failed to create terminal:', result.error);
    }
  } catch (error) {
    console.error('Failed to create terminal process:', error);
  }
}

/**
 * Handle terminal keydown events
 */
async function handleTerminalKeydown(e) {
  const input = e.target;

  if (e.key === 'Enter') {
    e.preventDefault();
    const command = input.value.trim();
    
    if (command) {
      // Add to history
      commandHistory.push(command);
      historyIndex = commandHistory.length;

      // Display command in terminal
      appendTerminalOutput(`$ ${command}\n`);

      // Send to terminal process
      await sendToTerminal(command + '\n');

      // Clear input
      input.value = '';
    }
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    // Navigate history backward
    if (historyIndex > 0) {
      historyIndex--;
      input.value = commandHistory[historyIndex];
    }
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    // Navigate history forward
    if (historyIndex < commandHistory.length - 1) {
      historyIndex++;
      input.value = commandHistory[historyIndex];
    } else {
      historyIndex = commandHistory.length;
      input.value = '';
    }
  } else if (e.key === 'Tab') {
    e.preventDefault();
    // TODO: Implement tab completion
  } else if (e.key === 'c' && e.ctrlKey) {
    e.preventDefault();
    // Send Ctrl+C
    await sendToTerminal('\x03');
  }
}

/**
 * Send data to terminal
 */
async function sendToTerminal(data) {
  try {
    await window.electronAPI.invoke('write-terminal', currentTerminalId, data);
  } catch (error) {
    console.error('Failed to write to terminal:', error);
  }
}

/**
 * Append output to terminal display
 */
function appendTerminalOutput(data) {
  const terminalOutput = document.getElementById('terminalOutput');
  if (!terminalOutput) return;

  // Create text node (preserves formatting)
  const text = document.createTextNode(data);
  const span = document.createElement('span');
  span.appendChild(text);
  terminalOutput.appendChild(span);

  // Auto-scroll to bottom
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

/**
 * Clear terminal
 */
function clearTerminal() {
  const terminalOutput = document.getElementById('terminalOutput');
  if (terminalOutput) {
    terminalOutput.innerHTML = '<div class="terminal-line">Tru.ai Terminal v1.0.0</div><div class="terminal-line">$</div>';
  }
}

/**
 * Kill terminal process
 */
async function killTerminal() {
  try {
    await window.electronAPI.invoke('kill-terminal', currentTerminalId);
    console.log('Terminal process killed');
  } catch (error) {
    console.error('Failed to kill terminal:', error);
  }
}

// Export functions
window.terminalAPI = {
  initialize: initializeTerminal,
  clear: clearTerminal,
  kill: killTerminal
};
