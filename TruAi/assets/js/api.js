/**
 * TruAi API Client
 * 
 * Handles all API communication
 * 
 * @package TruAi
 * @version 1.0.0
 */

class TruAiAPI {
    constructor() {
        this.baseURL = window.TRUAI_CONFIG.API_BASE;
        this.csrfToken = window.TRUAI_CONFIG.CSRF_TOKEN;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (options.body) {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async login(username, password) {
        return this.request('/api/v1/auth/login', {
            method: 'POST',
            body: { username, password }
        });
    }

    async loginEncrypted(encryptedData, sessionId) {
        return this.request('/api/v1/auth/login', {
            method: 'POST',
            body: { 
                encrypted_data: encryptedData,
                session_id: sessionId
            }
        });
    }

    async logout() {
        return this.request('/api/v1/auth/logout', {
            method: 'POST'
        });
    }

    async getAuthStatus() {
        return this.request('/api/v1/auth/status');
    }

    // Task endpoints
    async createTask(prompt, context = null, preferredTier = 'auto') {
        return this.request('/api/v1/task/create', {
            method: 'POST',
            body: { prompt, context, preferred_tier: preferredTier }
        });
    }

    async getTask(taskId) {
        return this.request(`/api/v1/task/${taskId}`);
    }

    async executeTask(taskId) {
        return this.request('/api/v1/task/execute', {
            method: 'POST',
            body: { task_id: taskId }
        });
    }

    async approveTask(taskId, action, target = 'production') {
        return this.request('/api/v1/task/approve', {
            method: 'POST',
            body: { task_id: taskId, action, target }
        });
    }

    // Chat endpoints
    async sendMessage(message, conversationId = null, model = 'auto') {
        return this.request('/api/v1/chat/message', {
            method: 'POST',
            body: { message, conversation_id: conversationId, model }
        });
    }

    async getConversations() {
        return this.request('/api/v1/chat/conversations');
    }

    async getConversation(conversationId) {
        return this.request(`/api/v1/chat/conversation/${conversationId}`);
    }

    // Audit endpoints
    async getAuditLogs() {
        return this.request('/api/v1/audit/logs');
    }
}

// Export for use in other scripts
window.TruAiAPI = TruAiAPI;
