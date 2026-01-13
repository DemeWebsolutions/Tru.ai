#!/bin/bash
# Tru.ai Desktop IDE - Startup Script
# Copyright © 2026 My Deme, LLC. All rights reserved.
# Proprietary and confidential - Internal use only
# 
# FORENSIC_MARKER: TRUAI_START_SCRIPT_V1

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔═══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Tru.ai Desktop IDE - v1.0.0      ║${NC}"
echo -e "${BLUE}║   Copyright © 2026 My Deme, LLC      ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════╝${NC}"
echo ""

# Check if Node.js is installed
check_node() {
  if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js is not installed${NC}"
    echo -e "${YELLOW}Please install Node.js 16+ from https://nodejs.org/${NC}"
    exit 1
  fi
  
  NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
  if [ "$NODE_VERSION" -lt 16 ]; then
    echo -e "${RED}✗ Node.js version 16+ required. Current version: $(node -v)${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"
}

# Check if npm is installed
check_npm() {
  if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm is not installed${NC}"
    echo -e "${YELLOW}Please install npm from https://www.npmjs.com/${NC}"
    exit 1
  fi
  
  echo -e "${GREEN}✓ npm $(npm -v) detected${NC}"
}

# Install dependencies if needed
install_dependencies() {
  if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚙ Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
  else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
  fi
}

# Check for package.json
check_package_json() {
  if [ ! -f "package.json" ]; then
    echo -e "${RED}✗ package.json not found${NC}"
    echo -e "${YELLOW}Please run this script from the electron directory${NC}"
    exit 1
  fi
}

# Start the application
start_app() {
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${GREEN}Starting Tru.ai Desktop IDE...${NC}"
  echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo ""
  
  # Use npm start if available, otherwise use electron directly
  if grep -q '"start"' package.json; then
    npm start
  else
    npx electron .
  fi
}

# Main execution
main() {
  echo -e "${BLUE}Checking system requirements...${NC}"
  echo ""
  
  check_node
  check_npm
  check_package_json
  
  echo ""
  install_dependencies
  
  echo ""
  start_app
}

# Run main function
main
