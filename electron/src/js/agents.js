/**
 * TruAi Desktop IDE - Agent Management
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_AGENTS_V1
 */

// Agents Management - Search Agents / New Agent functionality

let agents = [];
let currentAgent = null;

// Load agents from storage
function loadAgents() {
    const stored = localStorage.getItem('truai-agents');
    if (stored) {
        agents = JSON.parse(stored);
    } else {
        // Default agent
        agents = [{
            id: 'default',
            name: 'Tru.ai Assistant',
            description: 'Default AI assistant',
            icon: '∞',
            createdAt: Date.now()
        }];
        saveAgents();
    }
    currentAgent = agents[0];
    renderAgentsList();
}

// Save agents to storage
function saveAgents() {
    localStorage.setItem('truai-agents', JSON.stringify(agents));
}

// Render agents list
function renderAgentsList(filter = '') {
    const agentsList = document.getElementById('agents-list');
    if (!agentsList) return;
    
    const filtered = filter 
        ? agents.filter(agent => 
            agent.name.toLowerCase().includes(filter.toLowerCase()) ||
            agent.description.toLowerCase().includes(filter.toLowerCase())
          )
        : agents;
    
    if (filtered.length === 0) {
        agentsList.innerHTML = `
            <div style="padding: 16px; text-align: center; color: #858585; font-size: 12px;">
                No agents found
            </div>
        `;
        return;
    }
    
    let html = '';
    filtered.forEach(agent => {
        const isActive = currentAgent && currentAgent.id === agent.id;
        const timeAgo = getTimeAgo(agent.createdAt || Date.now());
        
        html += `
            <div class="agent-item ${isActive ? 'active' : ''}" data-agent-id="${agent.id}">
                <div class="agent-icon">${agent.icon || '∞'}</div>
                <div class="agent-info">
                    <div class="agent-name">${escapeHtml(agent.name)}</div>
                    <div class="agent-description">${escapeHtml(agent.description || 'AI Assistant')}</div>
                </div>
                <div class="agent-time">${timeAgo}</div>
            </div>
        `;
    });
    
    agentsList.innerHTML = html;
    
    // Add click listeners
    document.querySelectorAll('.agent-item').forEach(item => {
        item.addEventListener('click', () => {
            const agentId = item.dataset.agentId;
            selectAgent(agentId);
        });
    });
}

// Select an agent
function selectAgent(agentId) {
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;
    
    currentAgent = agent;
    renderAgentsList();
    
    // Update agent dropdown
    const agentDropdown = document.getElementById('agent-dropdown');
    if (agentDropdown) {
        const text = agentDropdown.querySelector('.dropdown-text');
        if (text) {
            text.textContent = agent.name;
        }
    }
    
    // Clear chat when switching agents
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
        chatMessages.innerHTML = '';
    }
    
    // Reset chat history
    if (window.chatHistory) {
        window.chatHistory = [];
    }
}

// Create new agent
function createNewAgent() {
    const name = prompt('Enter agent name:');
    if (!name || !name.trim()) return;
    
    const description = prompt('Enter agent description (optional):') || '';
    
    const newAgent = {
        id: `agent-${Date.now()}`,
        name: name.trim(),
        description: description.trim(),
        icon: '∞',
        createdAt: Date.now()
    };
    
    agents.push(newAgent);
    saveAgents();
    renderAgentsList();
    selectAgent(newAgent.id);
}

// Setup agents functionality
function setupAgents() {
    loadAgents();
    
    // Search input
    const searchInput = document.getElementById('search-agents-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderAgentsList(e.target.value);
        });
    }
    
    // New agent button
    const newAgentBtn = document.getElementById('new-agent-btn');
    if (newAgentBtn) {
        newAgentBtn.addEventListener('click', createNewAgent);
    }
    
    // Initialize agent dropdown with current agent
    if (currentAgent) {
        selectAgent(currentAgent.id);
    }
}

// Get current agent
function getCurrentAgent() {
    return currentAgent;
}

// Helper functions
function getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export functions
window.setupAgents = setupAgents;
window.getCurrentAgent = getCurrentAgent;
window.selectAgent = selectAgent;
window.createNewAgent = createNewAgent;
