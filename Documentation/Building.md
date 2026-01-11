# Building Tru.ai

## Prerequisites

- macOS 12.0 or later
- Xcode 14.0 or later
- iOS 15.0+ device or simulator
- Apple Developer Account (for device deployment)

## Build Steps

### 1. Clone the Repository

```bash
git clone https://github.com/DemeWebsolutions/Tru.ai.git
cd Tru.ai
```

### 2. Open in Xcode

```bash
open TruAi.xcodeproj
```

Or from Xcode: File → Open → Select `TruAi.xcodeproj`

### 3. Select Target

In Xcode:
1. Select the TruAi project in the navigator
2. Under "Targets", select "TruAi"
3. In "Signing & Capabilities", select your team
4. Xcode will automatically manage signing

### 4. Select Device/Simulator

From the device dropdown in the toolbar:
- Select an iOS Simulator (e.g., iPhone 14 Pro)
- Or connect a physical device and select it

### 5. Build and Run

Press `Cmd+R` or click the Play button in Xcode toolbar

The app should build and launch on your selected device/simulator.

## Build Configuration

### Debug Build (Default)

```bash
# In Xcode, select "Debug" scheme
# Or via command line:
xcodebuild -project TruAi.xcodeproj -scheme TruAi -configuration Debug
```

### Release Build

```bash
# In Xcode, select "Release" scheme
# Or via command line:
xcodebuild -project TruAi.xcodeproj -scheme TruAi -configuration Release
```

## Troubleshooting

### Build Errors

**"No signing certificate found"**
- Go to Signing & Capabilities
- Select your team
- Let Xcode automatically manage signing

**"Module not found"**
- Clean build folder: `Cmd+Shift+K`
- Close and reopen Xcode
- Rebuild: `Cmd+B`

**"Deployment target too low"**
- Select TruAi project
- Under "Deployment Info", ensure iOS 15.0+

### Runtime Issues

**"Unable to load files"**
- The file system service requires proper permissions
- On simulator, files are accessible by default
- On device, may need additional entitlements

**"Network requests failing"**
- Add API keys in Settings
- Check network connectivity
- Verify API endpoints in AppConfig.swift

## Architecture Overview

```
TruAi (iOS App)
├── Models (Data structures)
├── Services (Business logic)
│   └── TruAiService (AI orchestration)
├── ViewModels (Presentation logic)
└── Views (UI components)
```

## Key Files

- `TruAiApp.swift` - Main entry point
- `IDELayoutView.swift` - Main IDE layout
- `TruAiService.swift` - TruAi Core implementation
- `AppConfig.swift` - Configuration

## Next Steps

After building successfully:

1. **Configure API Keys**: Open Settings and add your API keys
2. **Test Features**: Try file explorer, code editor, terminal
3. **AI Integration**: Test chat with TruAi Core
4. **Git Operations**: Initialize a repository and test Git features

## Development Tips

### Hot Reload

SwiftUI supports live previews:
- Open any View file
- Click "Resume" in preview pane
- Changes appear instantly

### Debugging

- Set breakpoints in Xcode
- Use `print()` statements
- Check console output (Cmd+Shift+Y)

### Testing on Device

1. Connect iOS device via USB
2. Trust computer on device
3. Select device in Xcode
4. Build and run

## Performance

### First Build
- May take 2-5 minutes
- Swift compiles all modules
- Index project files

### Subsequent Builds
- 10-30 seconds
- Only changed files recompile
- Incremental compilation

## Distribution

### TestFlight (Beta Testing)

1. Archive: Product → Archive
2. Upload to App Store Connect
3. Invite testers via TestFlight

### App Store

1. Configure app in App Store Connect
2. Archive and upload
3. Submit for review

## Support

For build issues:
- Check Xcode version (must be 14.0+)
- Verify macOS version (12.0+)
- Ensure proper code signing

For technical questions:
support@mydeme.com
