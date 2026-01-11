# Tru.ai Electron Desktop Application

Cross-platform desktop application for Windows, macOS, and Linux using Electron.

## Overview

This directory contains the Electron-based desktop application that wraps the Tru.ai web interface, providing a native desktop experience across all major platforms similar to Cursor IDE, VS Code, and other Electron-based IDEs.

## Why Electron?

While we have a native macOS version built with SwiftUI, the Electron version provides:
- **Cross-platform**: Single codebase for Windows, macOS, and Linux
- **Web Technologies**: Uses familiar web technologies (HTML, CSS, JavaScript)
- **Rapid Development**: Fast iteration and deployment
- **Ecosystem**: Access to npm packages and web tooling

## Directory Structure

```
electron/
├── package.json              # Node.js dependencies and scripts
├── main.js                   # Electron main process
├── preload.js               # Preload script for security
├── renderer/                # Renderer process (UI)
│   ├── index.html          # Main HTML
│   ├── styles/             # CSS styles
│   ├── js/                 # JavaScript modules
│   └── assets/             # Images, icons, etc.
├── build/                   # Build configuration
│   ├── icon.icns           # macOS icon
│   ├── icon.ico            # Windows icon
│   └── icon.png            # Linux icon
└── README-ELECTRON.md      # This file
```

## Installation

### Prerequisites

- **Node.js**: 16.x or later
- **npm**: 8.x or later (comes with Node.js)
- **Git**: For cloning the repository

### Setup

```bash
# Navigate to the electron directory
cd electron

# Install dependencies
npm install

# Development run
npm start

# Build for your platform
npm run build

# Build for all platforms
npm run build:all
```

## Development

### Running in Development Mode

```bash
cd electron
npm run dev
```

This starts the Electron app with:
- Hot reload enabled
- DevTools open by default
- Debug logging

### Project Structure

#### main.js - Main Process
The main process handles:
- Window creation and management
- Native menus
- System tray
- File system access
- IPC (Inter-Process Communication)

```javascript
const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  
  win.loadFile('renderer/index.html');
}

app.whenReady().then(createWindow);
```

#### preload.js - Security Bridge
Exposes safe APIs to renderer:

```javascript
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('open-file'),
  saveFile: (content) => ipcRenderer.invoke('save-file', content),
  // ... more APIs
});
```

#### renderer/ - UI Layer
Contains the web-based UI:
- HTML for structure
- CSS for styling
- JavaScript for interactivity

## Building for Distribution

### Build Scripts

```json
{
  "scripts": {
    "start": "electron .",
    "dev": "electron . --enable-logging",
    "build": "electron-builder",
    "build:mac": "electron-builder --mac",
    "build:win": "electron-builder --win",
    "build:linux": "electron-builder --linux",
    "build:all": "electron-builder -mwl"
  }
}
```

### Building for macOS

```bash
npm run build:mac
```

Produces:
- `Tru.ai-1.0.0.dmg` - Installer
- `Tru.ai-1.0.0-mac.zip` - Portable app

### Building for Windows

```bash
npm run build:win
```

Produces:
- `Tru.ai Setup 1.0.0.exe` - Installer
- `Tru.ai-1.0.0-win.zip` - Portable

### Building for Linux

```bash
npm run build:linux
```

Produces:
- `Tru.ai-1.0.0.AppImage` - Universal Linux package
- `tru-ai_1.0.0_amd64.deb` - Debian/Ubuntu
- `tru-ai-1.0.0.x86_64.rpm` - RedHat/Fedora

## Configuration

### electron-builder Configuration

Add to `package.json`:

```json
{
  "build": {
    "appId": "ai.tru.desktop",
    "productName": "Tru.ai",
    "directories": {
      "output": "dist"
    },
    "files": [
      "main.js",
      "preload.js",
      "renderer/**/*",
      "node_modules/**/*"
    ],
    "mac": {
      "category": "public.app-category.developer-tools",
      "icon": "build/icon.icns",
      "target": ["dmg", "zip"],
      "darkModeSupport": true
    },
    "win": {
      "icon": "build/icon.ico",
      "target": ["nsis", "zip"]
    },
    "linux": {
      "icon": "build/icon.png",
      "category": "Development",
      "target": ["AppImage", "deb", "rpm"]
    }
  }
}
```

### Auto-Update Configuration

```javascript
const { autoUpdater } = require('electron-updater');

autoUpdater.checkForUpdatesAndNotify();
```

## Features

### Native Features

- **Menu Bar**: Native application menus
- **Keyboard Shortcuts**: System-level shortcuts
- **File Dialogs**: Native file open/save dialogs
- **Notifications**: Desktop notifications
- **System Tray**: Background application support

### IDE Features

- **Code Editor**: Monaco Editor (VS Code's editor)
- **File Explorer**: Tree view with context menus
- **Terminal**: Integrated terminal (xterm.js)
- **Search**: Find in files
- **Git Integration**: Git commands and visualization
- **AI Assistant**: Tru.ai integration

## Dependencies

### Core Dependencies

```json
{
  "dependencies": {
    "electron": "^28.0.0",
    "electron-store": "^8.0.0",
    "monaco-editor": "^0.45.0",
    "xterm": "^5.3.0",
    "marked": "^11.0.0"
  },
  "devDependencies": {
    "electron-builder": "^24.0.0",
    "electron-devtools-installer": "^3.2.0"
  }
}
```

### Monaco Editor Integration

```html
<div id="editor" style="width: 100%; height: 600px;"></div>

<script src="node_modules/monaco-editor/min/vs/loader.js"></script>
<script>
require.config({ paths: { vs: 'node_modules/monaco-editor/min/vs' }});
require(['vs/editor/editor.main'], function() {
  var editor = monaco.editor.create(document.getElementById('editor'), {
    value: '// Start coding...',
    language: 'javascript',
    theme: 'vs-dark'
  });
});
</script>
```

## Security

### Best Practices

1. **Disable Node Integration**
```javascript
webPreferences: {
  nodeIntegration: false,
  contextIsolation: true
}
```

2. **Use Content Security Policy**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self'">
```

3. **Validate IPC Messages**
```javascript
ipcMain.handle('open-file', async (event, filepath) => {
  // Validate filepath
  if (!isValidPath(filepath)) {
    throw new Error('Invalid path');
  }
  // Process...
});
```

## Testing

### Unit Tests

```bash
npm test
```

### E2E Tests

```bash
npm run test:e2e
```

Using Spectron or Playwright for Electron.

## Debugging

### Chrome DevTools

Press `Cmd+Option+I` (macOS) or `Ctrl+Shift+I` (Windows/Linux) to open DevTools.

Or programmatically:
```javascript
mainWindow.webContents.openDevTools();
```

### Main Process Debugging

```bash
electron --inspect=5858 .
```

Then open `chrome://inspect` in Chrome.

### Logging

```javascript
const log = require('electron-log');

log.info('Application started');
log.error('An error occurred:', error);
```

## Performance Optimization

### Tips

1. **Lazy Loading**: Load modules only when needed
2. **Code Splitting**: Split large JavaScript files
3. **Asset Optimization**: Compress images and resources
4. **Memory Management**: Clean up resources properly
5. **Native Modules**: Use native Node modules for performance-critical code

### Monitoring

```javascript
const { app } = require('electron');

app.on('gpu-process-crashed', (event, killed) => {
  console.log('GPU process crashed');
});

setInterval(() => {
  const mem = process.memoryUsage();
  console.log(`Memory: ${Math.round(mem.heapUsed / 1024 / 1024)}MB`);
}, 60000);
```

## Packaging

### Size Optimization

```json
{
  "build": {
    "compression": "maximum",
    "asar": true,
    "asarUnpack": [
      "node_modules/node-pty/**/*"
    ]
  }
}
```

### Platform-Specific Assets

```
build/
├── icon.icns        # macOS (512x512)
├── icon.ico         # Windows (256x256)
├── icon.png         # Linux (512x512)
└── background.png   # DMG background
```

## Publishing

### Manual Distribution

Upload built files to:
- GitHub Releases
- Website downloads
- App stores (Mac App Store, Microsoft Store)

### Auto-Update

```javascript
const { autoUpdater } = require('electron-updater');

autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'DemeWebsolutions',
  repo: 'Tru.ai'
});

autoUpdater.on('update-available', () => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Update available',
    message: 'A new version is available. Download now?',
    buttons: ['Yes', 'No']
  });
});
```

## Troubleshooting

### Common Issues

**1. App won't start**
- Check Node.js version
- Clear node_modules: `rm -rf node_modules && npm install`
- Check console for errors

**2. Build fails**
- Ensure all dependencies are installed
- Check platform-specific requirements
- Review electron-builder logs

**3. IPC not working**
- Verify preload script is loaded
- Check contextBridge usage
- Ensure handlers are registered in main process

**4. Performance issues**
- Profile with DevTools
- Check for memory leaks
- Optimize asset loading

## Comparison: Native vs Electron

| Aspect | Native (SwiftUI) | Electron |
|--------|-----------------|----------|
| Performance | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Startup Time | Fast | Moderate |
| Memory Usage | Low | High |
| Bundle Size | ~50MB | ~150MB |
| Platform Support | macOS/iOS | All platforms |
| Development Speed | Moderate | Fast |
| Web Technologies | No | Yes |
| Native Feel | Excellent | Good |
| Update Speed | App Store | Fast (auto-update) |

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## License

Copyright © 2026 Tru.ai. All rights reserved.

## Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [xterm.js](https://xtermjs.org/)

## Support

- GitHub Issues: [Report a bug](https://github.com/DemeWebsolutions/Tru.ai/issues)
- Email: support@tru.ai
- Documentation: https://docs.tru.ai
