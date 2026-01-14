#!/bin/bash

###############################################################################
# TruAi Core - CI Enforcement Script
# Copyright © 2026 My Deme, LLC. All rights reserved.
# Proprietary and confidential - Internal use only
#
# FORENSIC_MARKER: TRUAI_CI_ENFORCEMENT_V1
#
# This script enforces TruAi Core governance policies in CI/CD pipelines
###############################################################################

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "================================================"
echo "TruAi Core - CI Enforcement"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VIOLATIONS=0

# Check 1: Verify proprietary headers in all source files
echo ""
echo "Checking proprietary headers..."

REQUIRED_HEADER="Copyright © 2026 My Deme, LLC"
SOURCE_FILES=$(find "$PROJECT_ROOT/electron" -type f \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" -o -name "*.tsx" \) ! -path "*/node_modules/*" ! -path "*/dist/*" 2>/dev/null || true)

for file in $SOURCE_FILES; do
  if ! grep -q "$REQUIRED_HEADER" "$file"; then
    echo -e "${RED}✗${NC} Missing proprietary header: $file"
    ((VIOLATIONS++))
  fi
done

if [ $VIOLATIONS -eq 0 ]; then
  echo -e "${GREEN}✓${NC} All source files have proper headers"
fi

# Check 2: Verify forensic markers in core files
echo ""
echo "Checking forensic markers..."

CORE_FILES=$(find "$PROJECT_ROOT/electron/core" -type f -name "*.js" 2>/dev/null || true)

for file in $CORE_FILES; do
  if ! grep -q "FORENSIC_MARKER:" "$file"; then
    echo -e "${RED}✗${NC} Missing forensic marker: $file"
    ((VIOLATIONS++))
  fi
done

if [ $VIOLATIONS -eq 0 ]; then
  echo -e "${GREEN}✓${NC} All core files have forensic markers"
fi

# Check 3: Forbidden tooling detection
echo ""
echo "Checking for forbidden tooling..."

FORBIDDEN_TOOLS=(
  "webpack"
  "vite"
  "parcel"
  "rollup"
  "esbuild"
  "create-react-app"
  "next"
  "nuxt"
  "vue-cli"
)

PACKAGE_JSON="$PROJECT_ROOT/electron/package.json"

if [ -f "$PACKAGE_JSON" ]; then
  for tool in "${FORBIDDEN_TOOLS[@]}"; do
    if grep -q "\"$tool\"" "$PACKAGE_JSON"; then
      echo -e "${RED}✗${NC} Forbidden tool detected in package.json: $tool"
      ((VIOLATIONS++))
    fi
  done
fi

if [ $VIOLATIONS -eq 0 ]; then
  echo -e "${GREEN}✓${NC} No forbidden tooling detected"
fi

# Check 4: Verify TruAi Core integration
echo ""
echo "Checking TruAi Core integration..."

if [ ! -f "$PROJECT_ROOT/electron/core/truai-core.js" ]; then
  echo -e "${RED}✗${NC} TruAi Core engine missing"
  ((VIOLATIONS++))
fi

if [ ! -f "$PROJECT_ROOT/electron/core/risk-engine.js" ]; then
  echo -e "${RED}✗${NC} Risk engine missing"
  ((VIOLATIONS++))
fi

if [ ! -f "$PROJECT_ROOT/electron/core/ai-router.js" ]; then
  echo -e "${RED}✗${NC} AI router missing"
  ((VIOLATIONS++))
fi

if [ $VIOLATIONS -eq 0 ]; then
  echo -e "${GREEN}✓${NC} TruAi Core integration complete"
fi

# Final result
echo ""
echo "================================================"

if [ $VIOLATIONS -eq 0 ]; then
  echo -e "${GREEN}✓ CI Enforcement PASSED${NC}"
  echo "================================================"
  exit 0
else
  echo -e "${RED}✗ CI Enforcement FAILED${NC}"
  echo "Violations found: $VIOLATIONS"
  echo "================================================"
  exit 1
fi
