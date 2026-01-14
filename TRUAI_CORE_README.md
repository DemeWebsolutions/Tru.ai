# TruAi Core - Governance & Enforcement

**Copyright © 2026 My Deme, LLC. All rights reserved.**  
**Proprietary and confidential - Internal use only**

## Overview

TruAi Core is the central governance engine for the Tru.ai platform. It enforces security policies, manages AI routing, classifies risk levels, and maintains comprehensive audit trails with forensic watermarking.

## Architecture

### Components

1. **TruAi Core Engine** (`core/truai-core.js`)
   - Central orchestration and governance
   - Admin override console
   - Artifact verification
   - System status monitoring

2. **Risk Engine** (`core/risk-engine.js`)
   - Risk classification (SAFE, ELEVATED, LOCKED)
   - Kill-switch authority
   - Immutable audit logging
   - Forensic ID generation

3. **AI Router** (`core/ai-router.js`)
   - Cost-efficient AI model routing
   - Provider selection (ChatGPT, Claude, Copilot)
   - Output watermarking
   - Copilot subordination enforcement

## Risk Classification

### Risk Levels

- **SAFE** (Green): Low-risk operations, auto-approved
- **ELEVATED** (Amber): Production or system-scope operations, requires review
- **LOCKED** (Red): High-risk or kill-switch active, requires manual admin approval

### Risk Indicators

Risk patterns automatically detected:
- Deployment operations
- Production modifications
- Database deletions
- System-critical changes
- Security configuration edits
- Authentication modifications

## AI Routing Strategy

### Tier Selection

- **CHEAP**: Parsing, formatting, simple queries → ChatGPT
- **MID**: Analysis, review, optimization → Claude or ChatGPT
- **HIGH**: Code generation, complex reasoning → Copilot (subordinate) or Claude

### Provider Roles

- **ChatGPT**: Primary for general tasks
- **Claude**: Primary for analytical and complex reasoning tasks
- **Copilot**: Subordinate for code generation (TruAi-issued prompts only)

## Forensic Watermarking

All AI-generated outputs include:

1. **Forensic ID**: Unique identifier in format `TRUAI_<timestamp>_<random>`
2. **Watermark Embedding**: Automatically added based on content type
   - Code: Comment-based watermarks
   - JSON: Property injection
   - Text: Footer annotation

### Verification

```javascript
const result = await window.truaiCore.verifyArtifact(artifact);
// Returns: { isTruAiOriginated: boolean, forensicIds: string[], count: number }
```

## Governance Features

### Kill Switch

Emergency stop mechanism that:
- Locks all operations (LOCKED risk level)
- Requires admin override to lift
- Fully audited with forensic markers

### Admin Override Console

Single-admin authority for:
- `LIFT_KILL_SWITCH`: Deactivate emergency stop
- `ACTIVATE_KILL_SWITCH`: Emergency stop all operations
- `FORCE_READONLY`: Switch to offline mode
- `RESTORE_WRITE`: Return to online mode

### Audit Trail

- Immutable logging of all events
- Hash-based integrity verification
- Timestamp and forensic ID tracking
- Full traceability for compliance

## Integration

### Electron Main Process

```javascript
const { TruAiCore } = require('./core/truai-core');

const truaiCore = new TruAiCore();
truaiCore.initialize({
  adminId: 'admin-001',
  offlineMode: false
});
```

### Renderer Process (via IPC)

```javascript
// Execute governed task
const result = await window.truaiCore.executeTask({
  type: 'code_generation',
  scope: 'project',
  target: 'auth.js',
  isProduction: false,
  task: 'Refactor authentication logic'
});

// Check system status
const status = await window.truaiCore.getStatus();

// Get audit log
const auditLog = await window.truaiCore.getAuditLog();
```

## CI/CD Enforcement

### Enforcement Script

Run in CI pipeline:

```bash
./ci/enforce-truai-policies.sh
```

### Checks Performed

1. ✓ Proprietary headers in all source files
2. ✓ Forensic markers in core files
3. ✓ No forbidden build tooling
4. ✓ TruAi Core integration completeness
5. ⚠ Hardcoded secret detection (warning)

### Required Header Format

```javascript
/**
 * File Name
 * Copyright © 2026 My Deme, LLC. All rights reserved.
 * Proprietary and confidential - Internal use only
 * 
 * FORENSIC_MARKER: TRUAI_<COMPONENT>_V<VERSION>
 */
```

## Offline Mode

### Read-Only Operation

When offline or explicitly set to read-only:
- No AI execution permitted
- Audit logs accessible
- System status viewable
- Requires admin override to restore write access

### Network Requirement

AI execution requires active connectivity to:
- ChatGPT API
- Claude API
- GitHub Copilot (when selected)

## Security Posture

### Context Isolation

- Electron context isolation enabled
- Sandboxed renderer process
- No remote module access
- Secure IPC bridge via preload script

### Content Security Policy

```
default-src 'self'; 
script-src 'self'; 
style-src 'self' 'unsafe-inline'
```

### Data Protection

- No AI memory externalization
- Encrypted artifacts at rest (production)
- Immutable audit logs
- Forensic watermarking on all outputs

## Compliance & Legal

### Intellectual Property

- All code proprietary to My Deme, LLC
- Forensic watermarks enable origin verification
- Audit trails provide legal defensibility

### Phase Lock

- TruAi Core v1 locked after implementation
- v2 roadmap deferred until stabilization
- No external distribution permitted

## Development

### Testing

```bash
cd electron
npm install
npm start  # Development mode
```

### Building

```bash
npm run build        # Current platform
npm run build:mac    # macOS
npm run build:win    # Windows
npm run build:linux  # Linux
```

### Environment

- Node.js 18+ LTS
- Electron 28+
- No build frameworks (enforced by CI)

## Support

For issues related to TruAi Core governance:
- Review audit logs for forensic analysis
- Check kill-switch status
- Verify risk classification decisions
- Contact My Deme, LLC development team

---

**FORENSIC_MARKER**: TRUAI_CORE_DOCUMENTATION_V1  
**Last Updated**: 2026-01-13
