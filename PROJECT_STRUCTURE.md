# Tru.ai iOS Project Structure

## Overview

This document describes the complete structure and architecture of the Tru.ai iOS application framework.

## Directory Structure

```
TruAi/
│
├── TruAiApp.swift                    # Main application entry point
│
├── Models/                           # Data Models Layer
│   ├── AppState.swift               # Global application state
│   ├── User.swift                   # User data model
│   ├── ChatMessage.swift            # Message data model
│   └── Conversation.swift           # Conversation data model
│
├── Services/                         # Business Logic Layer
│   ├── TruAiService.swift           # Core AI service (main orchestrator)
│   ├── NetworkService.swift         # API communication service
│   └── StorageService.swift         # Local persistence service
│
├── ViewModels/                       # MVVM ViewModels
│   └── ChatViewModel.swift          # Chat interface view model
│
├── Views/                            # SwiftUI Views
│   ├── ContentView.swift            # Main tab view container
│   ├── ChatView.swift               # Chat interface view
│   ├── HistoryView.swift            # Conversation history view
│   └── SettingsView.swift           # Settings and preferences view
│
├── Utilities/                        # Helper Utilities
│   └── Extensions.swift             # Swift extensions
│
├── Configuration/                    # App Configuration
│   └── AppConfig.swift              # Configuration constants
│
├── Info.plist                       # iOS app configuration
├── README.md                        # Project documentation
└── PROJECT_STRUCTURE.md            # This file
```

## Architecture Pattern

The application follows the **MVVM (Model-View-ViewModel)** architecture pattern:

- **Models**: Pure data structures representing business entities
- **Views**: SwiftUI views responsible for UI presentation
- **ViewModels**: Business logic and state management
- **Services**: Reusable services for networking, storage, and AI operations

## Key Components

### 1. TruAiApp.swift
- Main app entry point
- Sets up environment objects
- Configures app-wide settings

### 2. Models Layer
- **AppState**: Global app state management (authentication, theme, loading states)
- **User**: User profile and preferences
- **ChatMessage**: Individual message in a conversation
- **Conversation**: Collection of messages with metadata

### 3. Services Layer
- **TruAiService**: Main service orchestrating AI interactions and conversation management
- **NetworkService**: Handles all HTTP requests to Tru.ai API
- **StorageService**: Manages local data persistence using UserDefaults

### 4. ViewModels
- **ChatViewModel**: Manages chat interface state and user interactions

### 5. Views
- **ContentView**: Main tab-based navigation
- **ChatView**: Primary chat interface with message bubbles
- **HistoryView**: List of past conversations
- **SettingsView**: App configuration and preferences

## Data Flow

```
User Action → View → ViewModel → Service → Network/Storage
                ↓
            State Update
                ↓
            View Update
```

## Key Features

1. **Reactive State Management**: Uses `@Published` and `ObservableObject` for reactive updates
2. **Async/Await**: Modern Swift concurrency for network requests
3. **Streaming Support**: AsyncThrowingStream for real-time AI responses
4. **Local Persistence**: UserDefaults for conversation storage
5. **Error Handling**: Comprehensive error handling throughout the stack

## Extension Points

### Adding New Features

1. **New Model**: Add to `Models/` directory
2. **New Service**: Add to `Services/` directory, follow existing patterns
3. **New View**: Add to `Views/` directory, create ViewModel if needed
4. **New ViewModel**: Add to `ViewModels/` directory

### Customization

- **API Configuration**: Modify `AppConfig.swift` or use Settings view
- **UI Theme**: Modify `AppState.swift` theme management
- **Storage**: Extend `StorageService.swift` for additional persistence needs

## Dependencies

- SwiftUI (iOS 15.0+)
- Foundation
- Combine (for reactive programming)

## Testing Strategy

The architecture supports:
- **Unit Tests**: Test services and ViewModels independently
- **Integration Tests**: Test service interactions
- **UI Tests**: Test SwiftUI views and user flows

## Future Enhancements

Potential areas for extension:
- Core Data for more robust persistence
- SwiftUI NavigationStack (iOS 16+)
- Widget extensions
- Siri Shortcuts integration
- Push notifications
- Multi-user support
- Cloud sync
