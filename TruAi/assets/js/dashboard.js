/**
 * TruAi Dashboard
 * 
 * Main dashboard interface (Cursor-style 3-column layout)
 * 
 * @package TruAi
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    const api = new TruAiAPI();
    
    // Render dashboard
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="dashboard">
            <div class="top-bar">
                <div class="top-bar-left">
                    <div class="app-title">Tru.ai</div>
                    <span class="status-badge">PRODUCTION</span>
                </div>
                <div class="top-bar-right">
                    <span class="user-info">👤 ${window.TRUAI_CONFIG.USERNAME}</span>
                    <button class="btn-logout" id="logoutBtn">Logout</button>
                </div>
            </div>

            <div class="main-content">
                <div class="three-column">
                    <!-- Left Column: Review & Decision -->
                    <div class="column">
                        <div class="column-header">Review & Approval</div>
                        <div class="column-content">
                            <div class="review-status pending" id="reviewStatus">
                                <strong>Status:</strong> <span id="taskStatus">No active task</span><br>
                                <strong>Risk Level:</strong> <span id="riskLevel">-</span><br>
                                <strong>Tier:</strong> <span id="tierLevel">-</span>
                            </div>

                            <div class="review-actions">
                                <button class="btn btn-accept" id="acceptBtn" disabled>
                                    ✓ Accept
                                </button>
                                <button class="btn btn-reject" id="rejectBtn" disabled>
                                    ✗ Reject
                                </button>
                                <button class="btn" id="saveBtn" disabled>
                                    💾 Save Draft
                                </button>
                            </div>

                            <div class="mt-20">
                                <h4 style="margin-bottom: 10px; color: var(--text-secondary);">Recent Tasks</h4>
                                <div id="recentTasks" style="font-size: 12px; color: var(--text-tertiary);">
                                    No recent tasks
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Center Column: AI Interaction -->
                    <div class="column">
                        <div class="column-header">AI Workspace</div>
                        <div class="column-content">
                            <div class="prompt-section">
                                <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">
                                    Task Prompt
                                </label>
                                <textarea 
                                    class="prompt-input" 
                                    id="promptInput" 
                                    placeholder="Enter your task prompt here... (e.g., 'Refactor authentication logic', 'Create API endpoint for user management')"
                                ></textarea>
                            </div>

                            <div class="file-selector mb-20">
                                <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">
                                    Context Files (Optional)
                                </label>
                                <div class="file-upload-area" id="fileUploadArea">
                                    📁 Click to select files or drag & drop<br>
                                    <small>Upload code files, images, or documentation</small>
                                </div>
                                <input type="file" id="fileInput" multiple style="display: none;">
                                <div id="selectedFiles" style="margin-top: 10px; font-size: 12px;"></div>
                            </div>

                            <button class="btn btn-primary" id="submitBtn" style="width: 100%; margin-bottom: 20px;">
                                🚀 Submit to TruAi Core
                            </button>

                            <div>
                                <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">
                                    AI Response
                                </label>
                                <div class="ai-response" id="aiResponse">
                                    <div style="color: var(--text-tertiary); text-align: center; padding: 40px;">
                                        AI responses will appear here...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right Column: Output & Escalation -->
                    <div class="column">
                        <div class="column-header">Output & Control</div>
                        <div class="column-content">
                            <div class="tier-selector">
                                <div class="tier-option active" data-tier="auto">Auto</div>
                                <div class="tier-option" data-tier="cheap">Cheap</div>
                                <div class="tier-option" data-tier="mid">Mid</div>
                                <div class="tier-option" data-tier="high">High</div>
                            </div>

                            <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: var(--text-secondary); font-size: 14px;">
                                    Generated Output
                                </label>
                                <div class="output-window" id="outputWindow">
                                    <div style="color: var(--text-tertiary); text-align: center; padding: 40px;">
                                        Generated code will appear here...
                                    </div>
                                </div>
                            </div>

                            <button class="btn" id="escalateBtn" disabled style="width: 100%; margin-bottom: 10px;">
                                ⬆️ Escalate to Copilot
                            </button>

                            <button class="btn btn-primary" id="deployBtn" disabled style="width: 100%;">
                                🚀 Deploy to Production
                            </button>

                            <div class="mt-20" style="padding: 15px; background: var(--bg-tertiary); border-radius: 6px; font-size: 12px;">
                                <strong style="color: var(--text-primary);">Deployment Target:</strong>
                                <div style="color: var(--text-secondary); margin-top: 5px;">
                                    <input type="radio" name="deployTarget" value="production" checked> Production (Default)<br>
                                    <input type="radio" name="deployTarget" value="staging"> Staging
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // State
    let selectedTier = 'auto';
    let currentTask = null;
    let selectedFiles = [];

    // Event Listeners
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    document.getElementById('submitBtn').addEventListener('click', handleSubmit);
    document.getElementById('acceptBtn').addEventListener('click', handleAccept);
    document.getElementById('rejectBtn').addEventListener('click', handleReject);
    document.getElementById('saveBtn').addEventListener('click', handleSave);
    document.getElementById('escalateBtn').addEventListener('click', handleEscalate);
    document.getElementById('deployBtn').addEventListener('click', handleDeploy);

    // Tier selector
    document.querySelectorAll('.tier-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.tier-option').forEach(o => o.classList.remove('active'));
            this.classList.add('active');
            selectedTier = this.dataset.tier;
        });
    });

    // File upload
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('fileInput');
    
    fileUploadArea.addEventListener('click', () => fileInput.click());
    
    fileInput.addEventListener('change', function() {
        selectedFiles = Array.from(this.files);
        updateFileDisplay();
    });

    // Functions
    async function handleLogout() {
        try {
            await api.logout();
            window.location.reload();
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    async function handleSubmit() {
        const prompt = document.getElementById('promptInput').value.trim();
        
        if (!prompt) {
            alert('Please enter a task prompt');
            return;
        }

        // Disable submit button
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = '⏳ Processing...';

        try {
            // Create task
            const context = selectedFiles.length > 0 ? {
                files: selectedFiles.map(f => f.name)
            } : null;

            const taskResult = await api.createTask(prompt, context, selectedTier);
            currentTask = taskResult;

            // Update UI
            updateTaskStatus(taskResult);
            document.getElementById('aiResponse').innerHTML = `
                <div style="color: var(--success-green);">
                    ✓ Task created successfully<br><br>
                    <strong>Task ID:</strong> ${taskResult.task_id}<br>
                    <strong>Risk Level:</strong> ${taskResult.risk_level}<br>
                    <strong>Assigned Tier:</strong> ${taskResult.assigned_tier}
                </div>
            `;

            // Execute task
            const execResult = await api.executeTask(taskResult.task_id);
            
            document.getElementById('aiResponse').innerHTML = `
                <div style="color: var(--success-green);">
                    ✓ AI Execution Complete<br><br>
                    <strong>Model Used:</strong> ${execResult.model_used}<br>
                    <strong>Execution ID:</strong> ${execResult.execution_id}
                </div>
            `;

            document.getElementById('outputWindow').innerHTML = `<pre>${escapeHtml(execResult.output)}</pre>`;

            // Enable review buttons
            document.getElementById('acceptBtn').disabled = false;
            document.getElementById('rejectBtn').disabled = false;
            document.getElementById('saveBtn').disabled = false;

        } catch (error) {
            document.getElementById('aiResponse').innerHTML = `
                <div style="color: var(--error-red);">
                    ✗ Error: ${escapeHtml(error.message)}
                </div>
            `;
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '🚀 Submit to TruAi Core';
        }
    }

    async function handleAccept() {
        if (!currentTask) return;

        try {
            await api.approveTask(currentTask.task_id, 'APPROVE');
            document.getElementById('taskStatus').textContent = 'Approved';
            document.querySelector('.review-status').classList.remove('pending');
            document.querySelector('.review-status').classList.add('approved');
            document.getElementById('deployBtn').disabled = false;
            document.getElementById('escalateBtn').disabled = false;
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    async function handleReject() {
        if (!currentTask) return;

        try {
            await api.approveTask(currentTask.task_id, 'REJECT');
            document.getElementById('taskStatus').textContent = 'Rejected';
            resetUI();
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    async function handleSave() {
        if (!currentTask) return;

        try {
            await api.approveTask(currentTask.task_id, 'SAVE_ONLY');
            document.getElementById('taskStatus').textContent = 'Saved as Draft';
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }

    function handleEscalate() {
        alert('Copilot escalation would be triggered here.\n\nIn production, this would format the prompt and context for GitHub Copilot execution.');
    }

    function handleDeploy() {
        const target = document.querySelector('input[name="deployTarget"]:checked').value;
        const confirm = window.confirm(`Deploy to ${target.toUpperCase()}?\n\nThis action will be logged and audited.`);
        
        if (confirm) {
            alert(`Deployment to ${target} initiated.\n\nIn production, this would trigger actual deployment workflows.`);
            resetUI();
        }
    }

    function updateTaskStatus(task) {
        document.getElementById('taskStatus').textContent = task.status;
        document.getElementById('riskLevel').textContent = task.risk_level;
        document.getElementById('tierLevel').textContent = task.assigned_tier;
    }

    function updateFileDisplay() {
        const display = document.getElementById('selectedFiles');
        if (selectedFiles.length > 0) {
            display.innerHTML = '<strong>Selected files:</strong><br>' + 
                selectedFiles.map(f => '📄 ' + f.name).join('<br>');
        } else {
            display.innerHTML = '';
        }
    }

    function resetUI() {
        currentTask = null;
        document.getElementById('promptInput').value = '';
        document.getElementById('aiResponse').innerHTML = `
            <div style="color: var(--text-tertiary); text-align: center; padding: 40px;">
                AI responses will appear here...
            </div>
        `;
        document.getElementById('outputWindow').innerHTML = `
            <div style="color: var(--text-tertiary); text-align: center; padding: 40px;">
                Generated code will appear here...
            </div>
        `;
        document.getElementById('acceptBtn').disabled = true;
        document.getElementById('rejectBtn').disabled = true;
        document.getElementById('saveBtn').disabled = true;
        document.getElementById('deployBtn').disabled = true;
        document.getElementById('escalateBtn').disabled = true;
        document.getElementById('taskStatus').textContent = 'No active task';
        document.getElementById('riskLevel').textContent = '-';
        document.getElementById('tierLevel').textContent = '-';
        selectedFiles = [];
        updateFileDisplay();
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
});
