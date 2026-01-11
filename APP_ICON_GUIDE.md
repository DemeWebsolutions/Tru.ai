# App Icon Configuration

## Overview

This document describes the app icon setup for the Tru.ai iOS and macOS application.

## Source Image

- **File**: `TruAi-icon.png`
- **Size**: 512x512 pixels
- **Format**: PNG with RGBA channels
- **Design**: Elegant geometric butterfly/star pattern on dark gradient background

## Asset Catalog Structure

```
Assets.xcassets/
├── Contents.json
└── AppIcon.appiconset/
    ├── Contents.json
    ├── icon_1024x1024.png          (App Store)
    ├── icon_20x20@2x.png           (iPhone notification)
    ├── icon_20x20@3x.png           (iPhone notification)
    ├── icon_29x29@2x.png           (iPhone settings)
    ├── icon_29x29@3x.png           (iPhone settings)
    ├── icon_40x40@2x.png           (iPhone spotlight)
    ├── icon_40x40@3x.png           (iPhone spotlight)
    ├── icon_60x60@2x.png           (iPhone app 120x120)
    ├── icon_60x60@3x.png           (iPhone app 180x180)
    ├── icon_20x20.png              (iPad notification)
    ├── icon_20x20@2x_ipad.png      (iPad notification)
    ├── icon_29x29.png              (iPad settings)
    ├── icon_29x29@2x_ipad.png      (iPad settings)
    ├── icon_40x40.png              (iPad spotlight)
    ├── icon_40x40@2x_ipad.png      (iPad spotlight)
    ├── icon_76x76.png              (iPad app)
    ├── icon_76x76@2x.png           (iPad Pro app)
    ├── icon_83.5x83.5@2x.png       (iPad Pro app)
    ├── icon_16x16_mac.png          (macOS)
    ├── icon_16x16@2x_mac.png       (macOS)
    ├── icon_32x32_mac.png          (macOS)
    ├── icon_32x32@2x_mac.png       (macOS)
    ├── icon_128x128_mac.png        (macOS)
    ├── icon_128x128@2x_mac.png     (macOS)
    ├── icon_256x256_mac.png        (macOS)
    ├── icon_256x256@2x_mac.png     (macOS)
    ├── icon_512x512_mac.png        (macOS)
    └── icon_512x512@2x_mac.png     (macOS)
```

## Icon Sizes

### iPhone
- **20pt**: Notification (40x40@2x, 60x60@3x)
- **29pt**: Settings (58x58@2x, 87x87@3x)
- **40pt**: Spotlight (80x80@2x, 120x120@3x)
- **60pt**: App Icon (120x120@2x, 180x180@3x)

### iPad
- **20pt**: Notification (20x20@1x, 40x40@2x)
- **29pt**: Settings (29x29@1x, 58x58@2x)
- **40pt**: Spotlight (40x40@1x, 80x80@2x)
- **76pt**: App Icon (76x76@1x, 152x152@2x)
- **83.5pt**: iPad Pro (167x167@2x)

### App Store
- **1024x1024**: App Store listing (no alpha channel)

### macOS
- **16pt**: Finder (16x16@1x, 32x32@2x)
- **32pt**: Finder (32x32@1x, 64x64@2x)
- **128pt**: Finder (128x128@1x, 256x256@2x)
- **256pt**: Finder (256x256@1x, 512x512@2x)
- **512pt**: Finder (512x512@1x, 1024x1024@2x)

## Usage in Xcode

When you create an Xcode project:

1. The `Assets.xcassets` folder will be automatically recognized
2. The AppIcon set will appear in the Asset Catalog
3. In your target's settings, ensure "AppIcon" is selected as the App Icon Source

## Regenerating Icons

If you need to regenerate icons from a new source image:

1. Replace `TruAi-icon.png` with your new 512x512 icon
2. Run the icon generation script (not included in repository)
3. All icon sizes will be regenerated with proper scaling

## Design Guidelines

- Icon uses a distinctive geometric butterfly/star pattern
- Dark gradient background provides good contrast
- White line art design is visible at all sizes
- Design maintains clarity from 16x16 to 1024x1024
- Follows Apple's Human Interface Guidelines for app icons

## Platform Support

- ✅ iOS 15.0+
- ✅ iPadOS 15.0+
- ✅ macOS 12.0+

## Notes

- All icons are generated from the 512x512 source using high-quality Lanczos resampling
- PNG format with RGBA channels (though App Store icon should not use transparency)
- Icons follow Apple's naming conventions and size requirements
- The asset catalog uses Xcode's standard format (version 1)
