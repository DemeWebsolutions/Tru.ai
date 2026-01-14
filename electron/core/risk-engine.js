/**
 * TruAi Core - Risk Classification Engine
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_CORE_RISK_ENGINE_V1
 */

const RiskLevels = {
  SAFE: 'SAFE',
  ELEVATED: 'ELEVATED',
  LOCKED: 'LOCKED'
};

class RiskEngine {
  constructor() {
    this.currentRiskLevel = RiskLevels.SAFE;
    this.auditLog = [];
    this.killSwitchActive = false;
  }

  /**
   * Classify risk level based on operation type and scope
   * @param {Object} operation - The operation to classify
   * @returns {string} Risk level (SAFE, ELEVATED, LOCKED)
   */
  classifyRisk(operation) {
    const { type, scope, target, isProduction } = operation;

    // Kill switch active = LOCKED
    if (this.killSwitchActive) {
      return RiskLevels.LOCKED;
    }

    // High-risk operations
    const highRiskPatterns = [
      /deploy/i,
      /production/i,
      /delete.*database/i,
      /drop.*table/i,
      /rm\s+-rf/i,
      /system.*critical/i,
      /security.*config/i,
      /auth.*modify/i
    ];

    const operationString = `${type} ${scope} ${target}`.toLowerCase();

    // Check for high-risk patterns
    for (const pattern of highRiskPatterns) {
      if (pattern.test(operationString)) {
        return RiskLevels.LOCKED;
      }
    }

    // Production operations are elevated
    if (isProduction) {
      return RiskLevels.ELEVATED;
    }

    // Check scope
    if (scope === 'system' || scope === 'global') {
      return RiskLevels.ELEVATED;
    }

    // Default to SAFE
    return RiskLevels.SAFE;
  }

  /**
   * Determine if operation requires manual approval
   * @param {string} riskLevel - The risk level
   * @returns {boolean} Whether manual approval is required
   */
  requiresManualApproval(riskLevel) {
    return riskLevel === RiskLevels.LOCKED || riskLevel === RiskLevels.ELEVATED;
  }

  /**
   * Activate kill switch (emergency stop)
   * @param {string} reason - Reason for activation
   */
  activateKillSwitch(reason) {
    this.killSwitchActive = true;
    this.currentRiskLevel = RiskLevels.LOCKED;
    this.logAuditEvent({
      event: 'KILL_SWITCH_ACTIVATED',
      reason,
      timestamp: new Date().toISOString(),
      forensicId: this.generateForensicId()
    });
  }

  /**
   * Deactivate kill switch (requires admin override)
   * @param {string} adminId - Admin identifier
   */
  deactivateKillSwitch(adminId) {
    this.killSwitchActive = false;
    this.currentRiskLevel = RiskLevels.SAFE;
    this.logAuditEvent({
      event: 'KILL_SWITCH_DEACTIVATED',
      adminId,
      timestamp: new Date().toISOString(),
      forensicId: this.generateForensicId()
    });
  }

  /**
   * Log audit event (immutable)
   * @param {Object} event - Event details
   */
  logAuditEvent(event) {
    const auditEntry = {
      ...event,
      id: this.auditLog.length + 1,
      hash: this.generateAuditHash(event)
    };
    this.auditLog.push(auditEntry);
  }

  /**
   * Generate forensic ID for watermarking
   * @returns {string} Forensic ID
   */
  generateForensicId() {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `TRUAI_${timestamp}_${random}`.toUpperCase();
  }

  /**
   * Generate audit hash for integrity
   * @param {Object} event - Event to hash
   * @returns {string} Hash
   */
  generateAuditHash(event) {
    // Simple hash for demonstration (use crypto in production)
    const str = JSON.stringify(event);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Get current risk status
   * @returns {Object} Current risk status
   */
  getStatus() {
    return {
      riskLevel: this.currentRiskLevel,
      killSwitchActive: this.killSwitchActive,
      auditLogSize: this.auditLog.length
    };
  }

  /**
   * Get audit log (read-only)
   * @returns {Array} Audit log entries
   */
  getAuditLog() {
    return [...this.auditLog];
  }
}

module.exports = { RiskEngine, RiskLevels };
