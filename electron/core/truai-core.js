/**
 * TruAi Core - Main Governance Engine
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_CORE_ENGINE_V1
 */

const { RiskEngine, RiskLevels } = require('./risk-engine');
const { AIRouter, AITiers, AIProviders } = require('./ai-router');

class TruAiCore {
  constructor() {
    this.riskEngine = new RiskEngine();
    this.aiRouter = new AIRouter(this.riskEngine);
    this.isOffline = false;
    this.adminId = null;
  }

  /**
   * Initialize TruAi Core
   * @param {Object} config - Configuration
   */
  initialize(config) {
    const { adminId, offlineMode } = config;
    
    this.adminId = adminId;
    this.isOffline = offlineMode || false;
    
    this.riskEngine.logAuditEvent({
      event: 'TRUAI_CORE_INITIALIZED',
      adminId,
      offlineMode: this.isOffline,
      timestamp: new Date().toISOString(),
      forensicId: this.riskEngine.generateForensicId()
    });
  }

  /**
   * Execute AI task with governance
   * @param {Object} task - Task details
   * @returns {Object} Execution result
   */
  async executeTask(task) {
    // Check offline mode (read-only)
    if (this.isOffline) {
      return {
        success: false,
        error: 'Offline mode - read-only. AI execution requires connectivity.',
        riskLevel: RiskLevels.LOCKED
      };
    }

    // Classify risk
    const riskLevel = this.riskEngine.classifyRisk(task);
    
    // Check if manual approval required
    const requiresApproval = this.riskEngine.requiresManualApproval(riskLevel);
    
    if (requiresApproval && !task.adminApproval) {
      return {
        success: false,
        requiresApproval: true,
        riskLevel,
        message: 'Manual admin approval required for this operation'
      };
    }

    // Route to appropriate AI
    const routing = this.aiRouter.route(task);
    
    // Log execution attempt
    this.riskEngine.logAuditEvent({
      event: 'TASK_EXECUTION',
      taskType: task.type,
      riskLevel,
      routing,
      timestamp: new Date().toISOString()
    });

    // Return execution plan (actual AI call would happen here)
    return {
      success: true,
      riskLevel,
      routing,
      forensicId: routing.forensicId,
      requiresApproval: false,
      message: 'Task queued for execution'
    };
  }

  /**
   * Get watermarked AI output
   * @param {string} output - AI output
   * @param {string} forensicId - Forensic ID
   * @returns {string} Watermarked output
   */
  watermarkOutput(output, forensicId) {
    return this.aiRouter.watermarkOutput(output, forensicId);
  }

  /**
   * Admin override for elevated/locked operations
   * @param {Object} override - Override details
   * @returns {boolean} Success
   */
  adminOverride(override) {
    const { adminId, action, reason } = override;
    
    // Verify admin
    if (adminId !== this.adminId) {
      this.riskEngine.logAuditEvent({
        event: 'ADMIN_OVERRIDE_DENIED',
        reason: 'Invalid admin ID',
        timestamp: new Date().toISOString()
      });
      return false;
    }

    // Process override
    switch (action) {
      case 'LIFT_KILL_SWITCH':
        this.riskEngine.deactivateKillSwitch(adminId);
        break;
      
      case 'ACTIVATE_KILL_SWITCH':
        this.riskEngine.activateKillSwitch(reason);
        break;
      
      case 'FORCE_READONLY':
        this.isOffline = true;
        break;
      
      case 'RESTORE_WRITE':
        this.isOffline = false;
        break;
      
      default:
        return false;
    }

    this.riskEngine.logAuditEvent({
      event: 'ADMIN_OVERRIDE_EXECUTED',
      action,
      reason,
      adminId,
      timestamp: new Date().toISOString()
    });

    return true;
  }

  /**
   * Get current system status
   * @returns {Object} System status
   */
  getStatus() {
    return {
      core: 'TruAi Core v1.0',
      risk: this.riskEngine.getStatus(),
      mode: this.isOffline ? 'OFFLINE (Read-Only)' : 'ONLINE',
      adminId: this.adminId,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get audit log (read-only)
   * @returns {Array} Audit log
   */
  getAuditLog() {
    return this.riskEngine.getAuditLog();
  }

  /**
   * Get AI execution log
   * @returns {Array} Execution log
   */
  getExecutionLog() {
    return this.aiRouter.getExecutionLog();
  }

  /**
   * Verify TruAi-originated artifact
   * @param {string} artifact - Artifact to verify
   * @returns {Object} Verification result
   */
  verifyArtifact(artifact) {
    const forensicIdPattern = /TRUAI_\d+_[A-Z0-9]+/g;
    const matches = artifact.match(forensicIdPattern);
    
    if (!matches) {
      return {
        isTruAiOriginated: false,
        forensicIds: []
      };
    }

    return {
      isTruAiOriginated: true,
      forensicIds: matches,
      count: matches.length
    };
  }
}

module.exports = { TruAiCore, RiskLevels, AITiers, AIProviders };
