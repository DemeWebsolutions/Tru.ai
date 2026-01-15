/**
 * TruAi Login Page
 * 
 * Handles login interface with legal notices (Phantom.ai style)
 * 
 * @package TruAi
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    const api = new TruAiAPI();
    const crypto = new TruAiCrypto();
    
    // Check if encryption is supported
    const encryptionSupported = TruAiCrypto.isSupported();
    
    if (!encryptionSupported) {
        console.warn('Web Crypto API not supported. Using fallback authentication.');
    }
    
    // Initialize encryption
    let encryptionReady = false;
    if (encryptionSupported) {
        crypto.initialize().then(ready => {
            encryptionReady = ready;
            if (ready) {
                console.log('🔒 Encrypted login enabled (Phantom.ai style)');
            }
        });
    }
    
    // Render login page
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="login-container">
            <div class="login-box">
                <div class="login-header">
                    <img src="assets/images/TruAi-transparent-bg.png" alt="TruAi Logo" class="login-logo-img">
                    <h1 class="login-title">Tru.ai</h1>
                    <p class="login-subtitle">Super Admin AI Platform</p>
                </div>

                <form id="loginForm" class="login-form">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username" 
                            autocomplete="username"
                            required 
                            autofocus
                        >
                    </div>

                    <div class="form-group">
                        <label for="password">Password</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            autocomplete="current-password"
                            required
                        >
                    </div>

                    <div class="form-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="acceptTerms" required>
                            <span>I accept the Terms of Service and Legal Notices</span>
                        </label>
                    </div>

                    <button type="submit" class="btn btn-primary" id="loginBtn">
                        Sign In
                    </button>

                    <div id="errorMessage" class="error-message hidden"></div>
                </form>

                <div class="legal-notice">
                    <h3>Login Access Restricted</h3>
                    <div class="legal-content">
                        <p><strong>⚠️ PROPRIETARY SYSTEM</strong></p>
                        <p>My Deme, LLC. © 2025 - 2026 All Rights Reserved.</p>
                        <p>Unauthorized access is strictly prohibited and may result in legal action.</p>
                        
                        <p><strong>Single Admin Authorization</strong></p>
                        <p>This system is configured for single-admin use only. All actions are logged and auditable.</p>
                        
                        <p><strong>AI Governance</strong></p>
                        <p>By logging in, you acknowledge that:</p>
                        <ul>
                            <li>All AI interactions are governed by TruAi Core</li>
                            <li>High-risk actions require manual approval</li>
                            <li>Production deployments are logged and traceable</li>
                            <li>You have authority to approve system modifications</li>
                        </ul>

                        <p><strong>Data & Privacy</strong></p>
                        <ul>
                            <li>All prompts, responses, and actions are stored locally</li>
                            <li>No data is transmitted to external parties without explicit action</li>
                            <li>Audit logs are immutable and permanent</li>
                            <li>Session data expires after ${Math.floor(window.TRUAI_CONFIG.SESSION_LIFETIME || 3600 / 60)} minutes of inactivity</li>
                        </ul>

                        <p><strong>System Authority</strong></p>
                        <ul>
                            <li>TruAi Core has authority over all AI routing decisions</li>
                            <li>Cost optimization is automatic unless manually overridden</li>
                            <li>Self-maintenance actions require admin approval</li>
                            <li>Production is the default deployment target</li>
                        </ul>

                        <p><strong>Security & Compliance</strong></p>
                        <ul>
                            <li>🔒 End-to-end encrypted login (Phantom.ai style)</li>
                            <li>AES-256-GCM encryption for credential transmission</li>
                            <li>Client-side password hashing before transmission</li>
                            <li>Localhost-only access enforced</li>
                            <li>All actions are CSRF-protected</li>
                            <li>Failed login attempts are logged</li>
                            <li>Sessions are secured with HTTP-only cookies</li>
                        </ul>

                        <p class="legal-footer">
                            <strong>Copyright Notice</strong><br>
                            Tru.ai | TruAi Core | TruAi - Proprietary and intellectual property<br>
                            My Deme, LLC. © 2025 - 2026 All Rights Reserved.<br>
                            Developed by DemeWebsolutions.com
                        </p>

                        <p class="legal-footer">
                            <strong>Default Credentials (Development Only)</strong><br>
                            Username: <code>admin</code> | Password: <code>admin123</code><br>
                            <span style="color: #f44336;">⚠️ Change immediately in production</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loginBtn = document.getElementById('loginBtn');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const acceptTerms = document.getElementById('acceptTerms').checked;

        if (!acceptTerms) {
            showError('You must accept the Terms of Service to continue');
            return;
        }

        // Disable form
        loginBtn.disabled = true;
        loginBtn.textContent = encryptionReady ? '🔒 Encrypting & Signing in...' : 'Signing in...';
        errorMessage.classList.add('hidden');

        try {
            let result;
            
            if (encryptionReady) {
                // Encrypted login (Phantom.ai style)
                const encryptedCredentials = await crypto.encryptCredentials(username, password);
                
                result = await api.loginEncrypted(
                    encryptedCredentials.encrypted_data,
                    encryptedCredentials.session_id
                );
            } else {
                // Fallback to standard login
                result = await api.login(username, password);
            }
            
            if (result.success) {
                // Update CSRF token
                window.TRUAI_CONFIG.CSRF_TOKEN = result.csrf_token;
                window.TRUAI_CONFIG.IS_AUTHENTICATED = true;
                window.TRUAI_CONFIG.USERNAME = result.username;
                
                // Show encryption status
                if (result.encryption === 'enabled') {
                    console.log('✅ Logged in with encrypted credentials');
                }
                
                // Redirect to dashboard
                window.location.reload();
            }
        } catch (error) {
            showError(error.message || 'Login failed. Please check your credentials.');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Sign In';
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
});
