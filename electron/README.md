# Tru.ai Electron Desktop Application

This directory contains the Electron-based desktop application for Tru.ai, providing a cross-platform IDE experience with AI-powered features.

## Features

- **Cross-Platform**: Runs on macOS, Windows, and Linux
- **AI Assistant**: Integrated AI chat interface for code assistance
- **Code Editor**: Multi-tab editor with syntax-aware features
- **Terminal**: Built-in terminal for command execution
- **Settings**: Customizable preferences for editor and AI
- **Secure**: Context isolation and sandboxed rendering

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn

### Installation

1. Install dependencies:
```bash
cd electron
npm install
```

2. Run in development mode:
```bash
npm start
```

### Building for Production

Build for your current platform:
```bash
npm run build
```

Or build for specific platforms:
```bash
npm run build:mac    # macOS
npm run build:win    # Windows
npm run build:linux  # Linux
```

Built applications will be in the `dist/` directory.

## Project Structure

```
electron/
├── main.js          # Main process (Electron backend)
├── preload.js       # Preload script (secure bridge)
├── renderer.js      # Renderer process (frontend logic)
├── index.html       # Main HTML interface
├── styles.css       # Application styles
├── package.json     # Dependencies and build config
└── README.md        # This file
```

## Security

This application implements security best practices:

- **Context Isolation**: Enabled to prevent renderer access to Node.js
- **Sandbox**: Enabled for additional security
- **CSP**: Content Security Policy enforced
- **No Remote Module**: Remote module access disabled
- **Preload Script**: Secure bridge between main and renderer processes

## Architecture

### Main Process (main.js)
- Application lifecycle management
- Window creation and management
- Native menus
- IPC handlers

### Preload Script (preload.js)
- Secure API exposure to renderer
- Context bridge implementation
- Event forwarding

### Renderer Process (renderer.js)
- UI state management
- Event handling
- AI chat functionality
- Terminal emulation

## Integration with Tru.ai Core

To integrate with Tru.ai Core API:

1. Update the AI message handling in `renderer.js`
2. Replace placeholder responses with actual API calls
3. Configure API endpoints in a configuration file

Example API integration:
```javascript
async function sendAIMessage() {
  const message = aiInput.value.trim();
  
  const response = await fetch('https://api.truai.core/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({ message })
  });
  
  const data = await response.json();
  addChatMessage('ai', data.response);
}
```

## Development

### Hot Reload
In development mode, use Electron's reload functionality:
- Press `Cmd/Ctrl + R` to reload
- Press `Cmd/Ctrl + Shift + I` to open DevTools

### Debugging
DevTools are automatically opened in development mode. You can also:
- Use `console.log()` in any process
- Check main process logs in terminal
- Use Electron DevTools for renderer process

## Customization

### Changing Theme
Edit CSS variables in `styles.css`:
```css
:root {
  --bg-primary: #0f1115;
  --accent-primary: #3b82f6;
  /* ... more variables */
}
```

### Adding New Features
1. Add UI elements in `index.html`
2. Add styles in `styles.css`
3. Add logic in `renderer.js`
4. Add IPC handlers in `main.js` if needed

## License

Copyright © 2026 My Deme, LLC. All rights reserved.

This is proprietary software. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

## Support

For issues and questions, please contact the Tru.ai development team.
