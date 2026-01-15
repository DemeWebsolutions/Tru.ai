/**
 * TruAi Security Acknowledgment
 * 
 * Simplified security prompt (login removed temporarily)
 * 
 * @package TruAi
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', function() {
    // Render security acknowledgment
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="login-container">
            <div class="login-box">
                <div class="login-header">
                    <img src="assets/images/TruAi-transparent-bg.png" alt="TruAi Logo" class="login-logo-img">
                    <h1 class="login-title">Tru.ai</h1>
                    <p class="login-subtitle">Super Admin AI Platform</p>
                </div>

                <div class="security-notice">
                    <h2 style="color: var(--warning-yellow); margin-bottom: 20px;">⚠️ System Access</h2>
                    
                    <div class="legal-content">
                        <p><strong>PROPRIETARY SYSTEM</strong></p>
                        <p>My Deme, LLC. © 2025 - 2026 All Rights Reserved.</p>
                        <p>Unauthorized access is strictly prohibited and may result in legal action.</p>
                        
                        <p style="margin-top: 20px;"><strong>By accessing this system, you acknowledge:</strong></p>
                        <ul style="margin-left: 20px; margin-top: 10px;">
                            <li>You are the authorized system administrator</li>
                            <li>All actions are logged and auditable</li>
                            <li>AI interactions are governed by TruAi Core</li>
                            <li>High-risk actions require manual approval</li>
                            <li>You have full authority to approve system modifications</li>
                        </ul>
                    </div>

                    <button class="btn btn-primary" id="acknowledgeBtn" style="width: 100%; margin-top: 30px; padding: 15px;">
                        I Acknowledge and Accept
                    </button>
                </div>
            </div>
        </div>
    `;

    // Handle acknowledgment
    document.getElementById('acknowledgeBtn').addEventListener('click', function() {
        // Set acknowledged flag in session storage
        sessionStorage.setItem('security_acknowledged', 'true');
        
        // Set cookie for persistence
        document.cookie = 'security_acknowledged=true; path=/; max-age=' + (86400 * 30);
        
        // Reload to show main interface
        window.location.reload();
    });
});
