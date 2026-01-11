# TruAi Core - Technical Documentation

## Overview

TruAi Core is the intelligent orchestration layer that powers the Tru.ai iOS application. It provides AI routing, cost optimization, risk management, and self-maintenance capabilities.

© 2013 - Present My Deme, LLC. All Rights Reserved.

## Architecture

### Core Components

1. **AI Arbitration Engine**: Analyzes requests and selects optimal AI model
2. **Cost Optimizer**: Minimizes costs through smart routing
3. **Risk Classifier**: Evaluates operation risk and applies workflows
4. **Self-Maintenance**: Monitors health and proposes optimizations

## AI Tier Selection

```
Cheap (GPT-3.5):  Simple queries, < 20 words, no code context
Mid (GPT-4):      Code review, 20-100 words
Copilot:          Complex generation, > 100 words, IDE operations
Auto:             Let TruAi Core decide
```

## Risk Classification

**Low Risk** (Auto-approved):
- Read operations
- Query responses
- Code explanations

**High Risk** (Manual approval):
- Delete operations
- Production deployments
- System configuration

## Cost Optimization

1. Token minimization
2. Response reuse
3. Optimal model selection
4. Historical learning

## Self-Maintenance

TruAi Core automatically:
- Adjusts routing rules
- Updates cost thresholds
- Improves prompts
- Monitors performance

All high-risk changes require manual approval.
