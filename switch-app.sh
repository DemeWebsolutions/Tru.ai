#!/bin/bash
#
# Tru.ai Application Switcher
# Helper script to switch between TruAiMacApp and TruAiIDEApp
#

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$SCRIPT_DIR"
XCODEPROJ="$PROJECT_DIR/TruAi troubleshoot/TruAi.xcodeproj"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔═══════════════════════════════════════════════╗"
echo "║       Tru.ai Application Switcher             ║"
echo "╚═══════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if Xcode project exists
if [ ! -d "$XCODEPROJ" ]; then
    echo -e "${RED}Error: Xcode project not found at: $XCODEPROJ${NC}"
    exit 1
fi

echo "Project found: $(basename "$XCODEPROJ")"
echo ""
echo "Available Applications:"
echo ""
echo -e "${GREEN}1. TruAiMacApp${NC}      - Full app with authentication (login → IDE)"
echo -e "${GREEN}2. TruAiIDEApp${NC}      - Standalone IDE (direct launch to editor) ⭐"
echo -e "${YELLOW}3. Open in Xcode${NC}    - Open project to configure manually"
echo -e "${RED}4. Exit${NC}"
echo ""
read -p "Select an option (1-4): " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}Selected: TruAiMacApp (with authentication)${NC}"
        echo ""
        echo "To use TruAiMacApp:"
        echo "1. Open the Xcode project"
        echo "2. Ensure TruAiMacApp.swift has the @main attribute"
        echo "3. Remove @main from TruAiIDEApp.swift (or use conditional compilation)"
        echo "4. Build and run"
        echo ""
        echo "Opening Xcode..."
        open "$XCODEPROJ"
        ;;
    2)
        echo ""
        echo -e "${BLUE}Selected: TruAiIDEApp (standalone, no auth)${NC}"
        echo ""
        echo "To use TruAiIDEApp:"
        echo "1. Open the Xcode project"
        echo "2. Ensure TruAiIDEApp.swift has the @main attribute"
        echo "3. Remove @main from TruAiMacApp.swift (or use conditional compilation)"
        echo "4. Build and run"
        echo ""
        echo "Alternative: Create a separate scheme"
        echo "- Product → Scheme → Manage Schemes"
        echo "- Duplicate 'TruAi' scheme"
        echo "- Configure new scheme to use TruAiIDEApp"
        echo ""
        echo "Opening Xcode..."
        open "$XCODEPROJ"
        ;;
    3)
        echo ""
        echo -e "${BLUE}Opening Xcode project...${NC}"
        open "$XCODEPROJ"
        ;;
    4)
        echo ""
        echo -e "${YELLOW}Exiting...${NC}"
        exit 0
        ;;
    *)
        echo ""
        echo -e "${RED}Invalid option. Exiting.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✓ Done!${NC}"
echo ""
echo "For more information, see:"
echo "  - LAUNCH_GUIDE.md         - Setup and launch instructions"
echo "  - APP_COMPARISON.md       - Comparison of both apps"
echo "  - README_IDE_STANDALONE.md - Standalone IDE documentation"
echo ""
