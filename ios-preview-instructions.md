# iOS Preview Instructions

## Viewing on iOS Device

### Option 1: Open in Safari (Recommended)
1. Transfer `preview.html` to your iOS device (via AirDrop, email, or cloud storage)
2. Open the file in Safari
3. Tap the Share button
4. Select "Add to Home Screen"
5. The app will appear as a native iOS app icon

### Option 2: Local Server
1. On your Mac, navigate to the TruAi directory in Terminal
2. Run: `python3 -m http.server 8000`
3. On your iOS device, open Safari
4. Navigate to: `http://[your-mac-ip]:8000/preview.html`
5. Replace `[your-mac-ip]` with your Mac's local IP address

### Option 3: Xcode Simulator
1. Open Xcode
2. Create a new project or open existing
3. Drag `preview.html` into the project
4. Right-click the file → "Open With" → Safari
5. Or use the Simulator's Safari browser

## iOS-Specific Features

The preview includes:
- ✅ Safe area insets for iPhone X and newer
- ✅ iOS-style blur effects (backdrop-filter)
- ✅ Native iOS typography (SF Pro)
- ✅ Proper status bar styling
- ✅ Tab bar with iOS-style blur
- ✅ Touch-optimized button sizes
- ✅ iOS color scheme (#007AFF system blue)

## Testing Touch Interactions

The preview supports:
- Tap to switch tabs
- Type and send messages
- Scroll through conversations
- Interactive settings

## Responsive Design

The preview automatically adapts to:
- iPhone SE (375x667)
- iPhone 12/13/14 (390x844)
- iPhone 14 Pro Max (430x932)
- iPad (with adjustments)

## Notes

- The preview uses web technologies but mimics iOS UI closely
- For actual iOS development, use the SwiftUI code in the project
- The HTML preview is for design reference only
- Best viewed in Safari on iOS for full iOS styling support
